import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";

/**
 * `payments` -> PaymentDtos.PaymentResponse[] from GET /api/v1/payments/users
 * { id, orderId, userId, amount, status: SUCCESS|FAILED, message, createdAt }
 */
export default function PaymentHistory({ payments }) {
  const { t } = useTheme();

  if (payments.length === 0) {
    return <p className={`text-sm ${t.muted}`}>No payments yet.</p>;
  }

  return (
    <div>
      <p className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// payment.history</p>
      <div className="space-y-2">
        {payments.map((p) => (
          <div key={p.id} className={`flex items-center justify-between border ${t.border} ${t.surface} p-4`}>
            <div>
              <p className={`text-sm font-bold ${t.text}`}>Order #{p.orderId}</p>
              <p className={`font-mono text-xs ${t.faint}`}>
                {new Date(p.createdAt).toLocaleString()} · {p.message}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm ${t.text}`}>₹{Number(p.amount).toLocaleString("en-IN")}</span>
              <Badge tone={p.status === "SUCCESS" ? "success" : "danger"}>{p.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
