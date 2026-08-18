import { useEffect, useState } from "react";
import { Plus, Star, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";
import Price from "../ui/Price";

export default function ProductCard({
  product,
  onAddToCart,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const { t } = useTheme();

  const images =
    product.images?.length > 0
      ? product.images
      : [product.thumbnail];

  const [currentImage, setCurrentImage] = useState(product.thumbnail);
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        setCurrentImage(images[nextIndex]);
        return nextIndex;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isHovered, images]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setImageIndex(0);
    setCurrentImage(product.thumbnail);
  };

  return (
    <div
      className={`group relative border ${t.border} ${t.borderHover} ${t.surface} transition-colors`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
            src={currentImage}
            alt={product.title}
            className="h-full w-full object-cover transition-all duration-300"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Badge>{product.category}</Badge>

          <span
            className={`flex items-center gap-1 font-mono text-xs ${t.muted}`}
          >
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className={`mb-2 block text-left text-sm font-bold ${t.text} hover:text-orange-500 line-clamp-1`}
        >
          {product.title}
        </Link>

        <div className="flex items-center justify-between">
          <Price
            amount={product.price}
            discount={product.discountPrice}
            className={`text-base font-bold ${t.text}`}
          />

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