import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";
import Price from "../ui/Price";

/**
 * `product` matches Product-Service's Product entity:
 * { id, title, description, category, images, discountPercentage,
 *   rating, price, discountPrice, thumbnail }
 *
 * `isAdmin` + `onEdit`/`onDelete` are optional — pass them only on
 * screens where product management makes sense (e.g. an admin catalog
 * view). onEdit(product) -> navigate to /admin/products/:id/edit.
 * onDelete(product) -> DELETE /api/v1/products/{id}.
 */
export default function ProductCard({ product, onAddToCart, isAdmin, onEdit, onDelete }) {
  const { t } = useTheme();
  return (
    <div className={`group relative border ${t.border} ${t.borderHover} ${t.surface} transition-colors`}>
      {isAdmin && (
        <div className="absolute right-2 top-2 z-10 flex gap-1">
          <button
            onClick={() => onEdit?.(product)}
            className={`flex h-7 w-7 items-center justify-center border ${t.border} ${t.surface} ${t.muted} hover:text-cyan-400`}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(product)}
            className={`flex h-7 w-7 items-center justify-center border ${t.border} ${t.surface} ${t.muted} hover:text-rose-400`}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <Link to={`/products/${product.id}`} className="block w-full">
        <div className={`aspect-square overflow-hidden ${t.bg}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Badge>{product.category}</Badge>
          <span className={`flex items-center gap-1 font-mono text-xs ${t.muted}`}>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating}
          </span>
        </div>
        <Link to={`/products/${product.id}`} className={`mb-2 block text-left text-sm font-bold ${t.text} hover:text-orange-500 line-clamp-1`}>
          {product.title}
        </Link>
        <div className="flex items-center justify-between">
          <Price amount={product.price} discount={product.discountPrice} className={`text-base font-bold ${t.text}`} />
          <button
            onClick={() => onAddToCart(product)}
            className={`border ${t.border} p-2 ${t.muted} hover:border-orange-500 hover:text-orange-500`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
