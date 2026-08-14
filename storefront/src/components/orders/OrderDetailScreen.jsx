import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";
import Price from "../ui/Price";
import OrderStatusTracker from "./OrderStatusTracker";

/**
 * `detail` -> OrderDetail from GET /api/v1/order/getOrderDetails/{orderId}
 * { products: CartProduct[], quantity: number[], totalAmount, status, date }
 * `onUpdateStatus` (optional, admin) -> PATCH /updateOrderStatus/{id}/{status}
 */
export default function OrderDetailScreen({ orderId, detail, backTo = "/orders", onUpdateStatus }) {
  const { t } = useTheme();
  const tone = (status) => (status === "DELIVERED" ? "success" : status === "CANCELLED" ? "danger" : "warn");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to={backTo} className={`mb-6 flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-orange-500`}>
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className={`font-mono text-xs ${t.faint}`}>Order #{orderId} · {new Date(detail.date).toLocaleString()}</p>
          <h1 className={`mt-1 text-2xl font-black uppercase tracking-tighter ${t.text}`}>Order detail</h1>
        </div>
        <Badge tone={tone(detail.status)}>{detail.status}</Badge>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <OrderStatusTracker status={detail.status} />
        <div>
          <p className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// items</p>
          <div className="space-y-3">
            {detail.products.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 border ${t.border} ${t.surface} p-3`}>
                <img src={p.thumbnail} className={`h-12 w-12 border ${t.border} object-cover`} alt={p.title} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${t.text}`}>{p.title}</p>
                  <p className={`font-mono text-xs ${t.faint}`}>Qty {detail.quantity[i]}</p>
                </div>
                <Price amount={p.price} discount={p.discountPrice} className={`text-sm ${t.muted}`} />
              </div>
            ))}
          </div>
          <div className={`mt-4 flex items-center justify-between border-t ${t.border} pt-4`}>
            <span className={`text-xs font-bold uppercase tracking-wide ${t.muted}`}>Total</span>
            <span className={`font-mono text-xl font-black ${t.text}`}>₹{detail.totalAmount}</span>
          </div>

          {onUpdateStatus && (
            <div className="mt-6">
              <p className={`mb-2 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// admin: update status</p>
              <div className="flex flex-wrap gap-2">
                {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateStatus(orderId, s)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.surface} border ${t.border} ${t.muted} hover:text-orange-500`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
