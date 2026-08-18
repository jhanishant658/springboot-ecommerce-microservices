import { useState } from "react";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import Price from "../ui/Price";
import Button from "../ui/Button";

export default function ProductDetail({
  product,
  backTo = "/",
  onAddToCart,
  onDirectOrder,
}) {
  const { t } = useTheme();
  const [qty, setQty] = useState(1);

  const images = product.images?.length
    ? product.images
    : [product.thumbnail];

  const [selectedImage, setSelectedImage] = useState(
    images[0] || product.thumbnail
  );
  

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to={backTo}
        className={`mb-6 flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-orange-500`}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="grid gap-10 md:grid-cols-2">

        {/* IMAGE SECTION */}
        <div>
          {/* Main Image */}
          <div className={`aspect-square border ${t.border} ${t.surface}`}>
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Image Gallery */}
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`h-20 w-20 shrink-0 overflow-hidden border ${
                  selectedImage === image
                    ? "border-orange-500"
                    : t.border
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <span className="mb-2 inline-block font-mono text-xs uppercase tracking-widest text-orange-500">
            {product.category}
          </span>

          <h1
            className={`mb-3 text-2xl font-black uppercase tracking-tighter ${t.text}`}
          >
            {product.title}
          </h1>

          <div
            className={`mb-4 flex items-center gap-2 font-mono text-xs ${t.muted}`}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating}
          </div>

          <Price
            amount={product.price}
            discount={product.discountPrice}
            className={`mb-6 block text-3xl font-black ${t.text}`}
          />

          <p
            className={`mb-8 max-w-md text-sm leading-relaxed ${t.muted}`}
          >
            {product.description}
          </p>

          <div className="mb-6 flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-wide ${t.muted}`}
            >
              Qty
            </span>

            <div className={`flex items-center border ${t.border}`}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className={`p-2 ${t.muted} hover:text-orange-500`}
              >
                <Minus className="h-4 w-4" />
              </button>

              <span
                className={`w-10 text-center font-mono text-sm ${t.text}`}
              >
                {qty}
              </span>

              <button
                onClick={() => setQty((q) => q + 1)}
                className={`p-2 ${t.muted} hover:text-orange-500`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => onAddToCart(product, qty)}
                  className="w-full sm:w-auto"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to cart
                </Button>

                <Button
                  onClick={() => onDirectOrder(product, qty)}
                  className="w-full sm:w-auto"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy now
                </Button>
              </div>
        </div>
      </div>
    </div>
  );
}