import { useEffect, useState } from "react";
import { ChevronLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Price from "../ui/Price";
import Button from "../ui/Button";
import { getProductApi } from "../../api/ProductApis";
import { addToCartApi } from "../../api/cartApis";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTheme();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductApi(id).then(setProduct).catch(() => setError("Product nahi mila."));
  }, [id]);

  const onAddToCart = async () => {
    try {
      await addToCartApi(product, qty);
      navigate("/cart");
    } catch {
      navigate("/login");
    }
  };

  if (error) return <p className="py-16 text-center text-sm text-rose-400">{error}</p>;
  if (!product) return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading product...</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className={`mb-6 flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-orange-500`}>
        <ChevronLeft className="h-4 w-4" /> Back to catalog
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className={`aspect-square border ${t.border} ${t.surface}`}>
          <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-widest text-orange-500">{product.category}</span>
          <h1 className={`mb-3 text-2xl font-black uppercase tracking-tighter ${t.text}`}>{product.title}</h1>
          <div className={`mb-4 flex items-center gap-2 font-mono text-xs ${t.muted}`}>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating}
          </div>
          <Price amount={product.price} discount={product.discountPrice} className={`mb-6 block text-3xl font-black ${t.text}`} />
          <p className={`mb-8 max-w-md text-sm leading-relaxed ${t.muted}`}>{product.description}</p>
          <div className="mb-6 flex items-center gap-3">
            <span className={`text-xs font-bold uppercase tracking-wide ${t.muted}`}>Qty</span>
            <div className={`flex items-center border ${t.border}`}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className={`p-2 ${t.muted} hover:text-orange-500`}>
                <Minus className="h-4 w-4" />
              </button>
              <span className={`w-10 text-center font-mono text-sm ${t.text}`}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className={`p-2 ${t.muted} hover:text-orange-500`}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button onClick={onAddToCart} className="w-full sm:w-auto">
            <ShoppingCart className="h-4 w-4" /> Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}