import { useEffect, useState } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";
import CartLineItem from "./CartLineItem";
import { getCartApi, updateCartApi } from "../../api/cartApis";
import { placeOrderApi } from "../../api/OrderApis";

export default function CartPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCartApi().then((data) => setItems(data || [])).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, [navigate]);

  const onQtyChange = async (itemId, quantity) => {
    const next = items.map((i) => (i.id === itemId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0);
    setItems(next);
    await updateCartApi(next.map((i) => ({ id: i.id, quantity: i.quantity || 1, price: Math.round(i.discountPrice ?? i.price) })));
  };

  const onRemove = (itemId) => onQtyChange(itemId, 0);

  const onCheckout = async () => {
    await placeOrderApi();
    navigate("/order-confirm");
  };

  if (loading) return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading cart...</p>;

  const total = items.reduce((sum, i) => sum + (i.discountPrice ?? i.price) * (i.quantity || 1), 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingCart className={`mx-auto mb-4 h-10 w-10 ${t.faint}`} />
        <h2 className={`mb-2 text-xl font-bold ${t.text}`}>Your cart is empty</h2>
        <p className={`mb-6 text-sm ${t.muted}`}>Nothing here yet — go find something worth buying.</p>
        <Button onClick={() => navigate("/")}>Browse catalog</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Cart</h1>
      <div className="mb-6">
        {items.map((item) => (
          <CartLineItem key={item.id} item={{ ...item, quantity: item.quantity || 1 }} onQtyChange={onQtyChange} onRemove={onRemove} />
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