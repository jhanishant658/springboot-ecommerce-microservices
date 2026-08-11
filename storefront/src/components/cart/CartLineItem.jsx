import { Minus, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Price from "../ui/Price";

/**
 * `item` = a CartProduct (Dto/CartProduct.java) merged with the
 * quantity you're tracking client-side: { id, title, rating, price,
 * discountPrice, thumbnail, quantity }
 */
export default function CartLineItem({ item, onQtyChange, onRemove }) {
  const { t } = useTheme();
  return (
    <div className={`flex items-center gap-4 border-b ${t.border} py-4`}>
      <img src={item.thumbnail} alt={item.title} className={`h-16 w-16 border ${t.border} object-cover`} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-bold ${t.text}`}>{item.title}</p>
        <Price amount={item.price} discount={item.discountPrice} className={`text-sm ${t.muted}`} />
      </div>
      <div className={`flex items-center border ${t.border}`}>
        <button onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))} className={`p-1.5 ${t.muted} hover:text-orange-500`}>
          <Minus className="h-3 w-3" />
        </button>
        <span className={`w-8 text-center font-mono text-xs ${t.text}`}>{item.quantity}</span>
        <button onClick={() => onQtyChange(item.id, item.quantity + 1)} className={`p-1.5 ${t.muted} hover:text-orange-500`}>
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <button onClick={() => onRemove(item.id)} className={`p-2 ${t.faint} hover:text-rose-400`}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
