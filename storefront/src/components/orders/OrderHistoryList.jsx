import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";
import { getOrderHistoryApi } from "../../api/OrderApis";

export default function OrderHistoryList() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tone = (status) => (status === "DELIVERED" ? "success" : status === "CANCELLED" ? "danger" : "warn");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getOrderHistoryApi()
      .then((data) => {
        if (cancelled) return;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Orders load nahi ho paaye. Please login ya backend check karo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading orders...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Order history</h1>

      {error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className={`text-sm ${t.muted}`}>No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <button
              key={o.id || o.orderId}
              onClick={() => navigate(`/orders/${o.id || o.orderId}`)}
              className={`flex w-full items-center justify-between border ${t.border} ${t.surface} p-4 text-left ${t.borderHover}`}
            >
              <div>
                <p className={`font-mono text-xs ${t.faint}`}>
                  #{o.id || o.orderId} · {o.date ? new Date(o.date).toLocaleDateString() : "Processing"}
                </p>
                <p className={`mt-1 text-sm font-bold ${t.text}`}>
                  {o.products?.length ?? 0} items · ₹{o.totalAmount ?? 0}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge tone={tone(o.status)}>{o.status || "PENDING"}</Badge>
                <ChevronRight className={`h-4 w-4 ${t.faint}`} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}