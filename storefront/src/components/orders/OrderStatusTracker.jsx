import { Check, X } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

/**
 * Numbered stepper — justified here because order status IS a real
 * sequence. `status` should be Order.status from your backend
 * (PLACED / CONFIRMED / SHIPPED / DELIVERED, or CANCELLED).
 */
const STEPS = [
  { code: "PLACED", label: "Order received" },
  { code: "CONFIRMED", label: "Payment confirmed" },
  { code: "SHIPPED", label: "Shipped" },
  { code: "DELIVERED", label: "Delivered" },
];

export default function OrderStatusTracker({ status }) {
  const { t } = useTheme();
  const failed = status === "CANCELLED" || status === "PAYMENT_FAILED";
  const activeIndex = failed ? 1 : STEPS.findIndex((s) => s.code === status);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className={`border ${t.border} ${t.surface} p-6`}>
      <p className={`mb-6 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// order.status</p>
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const done = i < resolvedIndex || (i === resolvedIndex && !failed && status === "DELIVERED");
          const isActive = i === resolvedIndex && !done && !failed;
          const isFailedHere = failed && i === resolvedIndex;
          return (
            <div key={step.code} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-mono text-[10px] ${
                    isFailedHere
                      ? "border-rose-500 bg-rose-500/20 text-rose-500"
                      : done
                      ? "border-emerald-400 bg-emerald-400/20 text-emerald-500"
                      : isActive
                      ? "border-orange-500 bg-orange-500/20 text-orange-500 animate-pulse"
                      : `${t.border} ${t.faint}`
                  }`}
                >
                  {isFailedHere ? <X className="h-3 w-3" /> : done ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-10 w-0.5 ${i < resolvedIndex ? "bg-emerald-400/40" : t.border.replace("border-", "bg-")}`} />
                )}
              </div>
              <div className="pb-8">
                <p className={`font-mono text-xs uppercase tracking-wider ${isFailedHere ? "text-rose-500" : done ? "text-emerald-500" : isActive ? "text-orange-500" : t.faint}`}>
                  {step.code}
                </p>
                <p className={`text-sm ${done || isActive || isFailedHere ? t.text : t.faint}`}>{step.label}</p>
              </div>
            </div>
          );
        })}
        {failed && (
          <div className="flex gap-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-500 bg-rose-500/20 font-mono text-[10px] text-rose-500">
              <X className="h-3 w-3" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-rose-500">CANCELLED</p>
              <p className={`text-sm ${t.text}`}>Payment failed or stock unavailable — refund issued.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
