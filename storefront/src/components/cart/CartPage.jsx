import { ShoppingCart, ArrowRight } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";
import CartLineItem from "./CartLineItem";

/**
 * `items` -> CartProduct[] from POST /api/v1/cart/getCart, each merged
 * with a local `quantity`. `onCheckout` should call
 * POST /api/v1/order/placeOrder (no body — built server-side from cart).
 */
export default function CartPage({ items, onQtyChange, onRemove, onCheckout, onContinueShopping }) {
  const { t } = useTheme();
  const total = items.reduce((sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingCart className={`mx-auto mb-4 h-10 w-10 ${t.faint}`} />
        <h2 className={`mb-2 text-xl font-bold ${t.text}`}>Your cart is empty</h2>
        <p className={`mb-6 text-sm ${t.muted}`}>Nothing here yet — go find something worth buying.</p>
        <Button onClick={onContinueShopping}>Browse catalog</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Cart</h1>
      <div className="mb-6">
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} onQtyChange={onQtyChange} onRemove={onRemove} />
        ))}
      </div>
      <div className={`flex items-center justify-between border-t ${t.border} pt-6`}>
        <span className={`text-sm font-bold uppercase tracking-wide ${t.muted}`}>Total</span>
        <span className={`font-mono text-2xl font-black ${t.text}`}>₹{total}</span>
      </div>
      <Button className="mt-6 w-full" onClick={onCheckout}>
        Place order <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
