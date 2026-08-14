import { Package } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";
import OrderStatusTracker from "./OrderStatusTracker";

/** `order` -> Order returned by POST /api/v1/order/placeOrder */
export default function OrderConfirmScreen({ order, onViewHistory, onContinueShopping }) {
  const { t } = useTheme();
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10">
          <Package className="h-7 w-7 text-orange-500" />
        </div>
        <p className={`mb-1 font-mono text-xs uppercase tracking-widest ${t.faint}`}>Order #{order.id}</p>
        <h1 className={`text-2xl font-black uppercase tracking-tighter ${t.text}`}>Order placed</h1>
        <p className={`mt-2 text-sm ${t.muted}`}>Track its status below, or refresh from your orders page.</p>
      </div>
      <OrderStatusTracker status={order.status} />
      <div className="mt-8 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onContinueShopping}>
          Continue shopping
        </Button>
        <Button className="flex-1" onClick={onViewHistory}>
          View orders
        </Button>
      </div>
    </div>
  );
}
