import { Wallet as WalletIcon } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

/** `wallet` -> PaymentDtos.WalletResponse { id, balance } from GET /api/v1/wallets */
export default function WalletBalanceCard({ wallet }) {
  const { t } = useTheme();
  return (
    <div className={`flex items-center justify-between border ${t.border} ${t.surface} p-6`}>
      <div>
        <p className={`mb-1 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// wallet.{wallet.id}</p>
        <p className={`text-xs font-bold uppercase tracking-wide ${t.muted}`}>Available balance</p>
        <p className={`mt-1 font-mono text-3xl font-black ${t.text}`}>
          ₹{Number(wallet.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10">
        <WalletIcon className="h-7 w-7 text-orange-500" />
      </div>
    </div>
  );
}
