import { useTheme } from "../../theme/ThemeContext";
import WalletBalanceCard from "./WalletBalanceCard";
import TopUpForm from "./TopUpForm";
import PaymentHistory from "./PaymentHistory";

/**
 * Composes the three Payment-Service pieces into one screen:
 *   wallet   -> GET /api/v1/wallets
 *   onTopUp  -> POST /api/v1/wallets/top-up
 *   payments -> GET /api/v1/payments/users
 */
export default function WalletPage({ wallet, payments, onTopUp }) {
  const { t } = useTheme();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Wallet</h1>
      <div className="space-y-6">
        <WalletBalanceCard wallet={wallet} />
        <TopUpForm onTopUp={onTopUp} />
        <PaymentHistory payments={payments} />
      </div>
    </div>
  );
}
