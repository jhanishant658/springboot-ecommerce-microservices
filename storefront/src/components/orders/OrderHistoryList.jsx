import { ChevronRight } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";

/** `orders` -> Order[] from GET /api/v1/order/orderHistory */
export default function OrderHistoryList({ orders, onView }) {
  const { t } = useTheme();
  const tone = (status) => (status === "DELIVERED" ? "success" : status === "CANCELLED" ? "danger" : "warn");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Order history</h1>
      {orders.length === 0 ? (
        <p className={`text-sm ${t.muted}`}>No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => onView(o)}
              className={`flex w-full items-center justify-between border ${t.border} ${t.surface} p-4 text-left ${t.borderHover}`}
            >
              <div>
                <p className={`font-mono text-xs ${t.faint}`}>#{o.id} · {new Date(o.date).toLocaleDateString()}</p>
                <p className={`mt-1 text-sm font-bold ${t.text}`}>{o.products?.length ?? 0} items · ₹{o.totalAmount}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={tone(o.status)}>{o.status}</Badge>
                <ChevronRight className={`h-4 w-4 ${t.faint}`} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
