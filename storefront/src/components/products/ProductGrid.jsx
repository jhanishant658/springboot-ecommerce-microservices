import { useTheme } from "../../theme/ThemeContext";
import ProductCard from "./ProductCard";

/**
 * `products` -> content of Page<Product> from either:
 *   GET /api/v1/products/all/{page}/{size}
 *   GET /api/v1/products/category/{category}/{page}
 * Category chips + pagination are presentation-only here; wire
 * `onCategoryChange` / `onPageChange` to re-fetch from your API.
 */
export default function ProductGrid() {
  const { t } = useTheme();
  const products = []; // Replace with your products data
  const categories = []; // Replace with your categories data
  const activeCategory = null; // Replace with your active category state
  const page = 0; // Replace with your current page state
  const totalPages = 1; // Replace with your total pages state
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className={`text-3xl font-black uppercase tracking-tighter ${t.text}`}>Catalog</h1>
        <span className={`font-mono text-xs ${t.muted}`}>{products.length} items</span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          // onClick={}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
            !activeCategory ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            // onClick={}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
              activeCategory === c ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
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
            // onClick={}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            ← Prev
          </button>
          <span className={`font-mono text-xs ${t.faint}`}>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            // onClick={}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
