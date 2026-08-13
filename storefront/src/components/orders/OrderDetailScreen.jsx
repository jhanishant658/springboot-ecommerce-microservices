import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";
import Price from "../ui/Price";
import OrderStatusTracker from "./OrderStatusTracker";
import { getOrderDetailApi } from "../../api/OrderApis";

export default function OrderDetailScreen() {
  const { id } = useParams();
  const { t } = useTheme();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tone = (status) => (status === "DELIVERED" ? "success" : status === "CANCELLED" ? "danger" : "warn");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getOrderDetailApi(id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) setError("Order detail load nahi ho paayi.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading order detail...</p>;
  }

  if (error || !detail) {
    return <p className="py-16 text-center text-sm text-rose-400">{error || "Order not found."}</p>;
  }

  const products = detail.products || [];
  const quantities = detail.quantity || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/orders" className={`mb-6 flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-orange-500`}>
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className={`font-mono text-xs ${t.faint}`}>
            Order #{id} · {detail.date ? new Date(detail.date).toLocaleString() : "Processing"}
          </p>
          <h1 className={`mt-1 text-2xl font-black uppercase tracking-tighter ${t.text}`}>Order detail</h1>
        </div>
        <Badge tone={tone(detail.status)}>{detail.status || "PENDING"}</Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <OrderStatusTracker status={detail.status} />

        <div>
          <p className={`mb-3 font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>// items</p>

          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 border ${t.border} ${t.surface} p-3`}>
                <img src={p.thumbnail} className={`h-12 w-12 border ${t.border} object-cover`} alt={p.title} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${t.text}`}>{p.title}</p>
                  <p className={`font-mono text-xs ${t.faint}`}>Qty {quantities[i] || 1}</p>
                </div>
                <Price amount={p.price} discount={p.discountPrice} className={`text-sm ${t.muted}`} />
              </div>
            ))}
          </div>

          <div className={`mt-4 flex items-center justify-between border-t ${t.border} pt-4`}>
            <span className={`text-xs font-bold uppercase tracking-wide ${t.muted}`}>Total</span>
            <span className={`font-mono text-xl font-black ${t.text}`}>₹{detail.totalAmount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}