import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

/**
 * onTopUp(amount) -> POST /api/v1/wallets/top-up
 * body: PaymentDtos.TopUpRequest { amount }
 */
export default function TopUpForm({ onTopUp }) {
  const { t } = useTheme();
  const [amount, setAmount] = useState("");

  return (
    <div className={`border ${t.border} ${t.surface} p-6`}>
      <p className={`mb-4 text-xs font-bold uppercase tracking-wide ${t.muted}`}>Top up wallet</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(String(a))}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.surface} border ${t.border} ${t.muted} hover:text-orange-500`}
          >
            ₹{a}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm ${t.faint}`}>₹</span>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className={`w-full border ${t.border} ${t.inputBg} ${t.text} py-3 pl-7 pr-3 text-sm outline-none focus:border-cyan-400`}
          />
        </div>
        <Button
          disabled={!amount || Number(amount) <= 0}
          onClick={() => {
            onTopUp(Number(amount));
            setAmount("");
          }}
        >
          Add money
        </Button>
      </div>
    </div>
  );
}
