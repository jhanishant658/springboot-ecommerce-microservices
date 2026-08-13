import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import WalletBalanceCard from "./WalletBalanceCard";
import TopUpForm from "./TopUpForm";
import PaymentHistory from "./PaymentHistory";
import { getPaymentHistoryApi, getWalletApi, topUpWalletApi } from "../../api/WalletApis";

export default function WalletPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWallet = async () => {
    const [walletResponse, paymentsResponse] = await Promise.all([getWalletApi(), getPaymentHistoryApi()]);
    setWallet(walletResponse);
    setPayments(Array.isArray(paymentsResponse) ? paymentsResponse : []);
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    loadWallet()
      .catch(() => {
        if (!cancelled) {
          setError("Wallet load nahi ho paaya. Please login ya backend check karo.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleTopUp = async (amount) => {
    try {
      const updatedWallet = await topUpWalletApi(amount);
      setWallet(updatedWallet);
      const paymentsResponse = await getPaymentHistoryApi();
      setPayments(Array.isArray(paymentsResponse) ? paymentsResponse : []);
    } catch {
      navigate("/login");
    }
  };

  if (loading) {
    return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading wallet...</p>;
  }

  if (error) {
    return <p className="py-16 text-center text-sm text-rose-400">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Wallet</h1>
      <div className="space-y-6">
        <WalletBalanceCard wallet={wallet || { id: "-", balance: 0 }} />
        <TopUpForm onTopUp={handleTopUp} />
        <PaymentHistory payments={payments} />
      </div>
    </div>
  );
}