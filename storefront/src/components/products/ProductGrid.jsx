import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import ProductCard from "./ProductCard";
import { getAllProductsApi, getCategoriesApi, getProductsByCategoryApi } from "../../api/ProductApis";
import { addToCartApi } from "../../api/cartApis";

export default function ProductGrid() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategoriesApi().then((data) => setCategories(data.content || data || [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const request = activeCategory ? getProductsByCategoryApi(activeCategory, page) : getAllProductsApi(page, 12);
    request
      .then((data) => {
        if (cancelled) return;
        setProducts(data.content || data || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => !cancelled && setError("Products load nahi ho paaye. Backend/Gateway check karo."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [activeCategory, page]);

  const onAddToCart = async (product) => {
    try {
      await addToCartApi(product, 1);
    } catch {
      navigate("/login");
    }
  };

  const selectCategory = (category) => {
    setActiveCategory(category);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className={`text-3xl font-black uppercase tracking-tighter ${t.text}`}>Catalog</h1>
        <span className={`font-mono text-xs ${t.muted}`}>{products.length} items</span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => selectCategory(null)}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
            !activeCategory ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => selectCategory(c)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              activeCategory === c ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={`py-16 text-center text-sm ${t.muted}`}>Loading products...</p>
      ) : error ? (
        <p className="py-16 text-center text-sm text-rose-400">{error}</p>
      ) : products.length === 0 ? (
        <p className={`py-16 text-center text-sm ${t.muted}`}>No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            ← Prev
          </button>
          <span className={`font-mono text-xs ${t.faint}`}>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}