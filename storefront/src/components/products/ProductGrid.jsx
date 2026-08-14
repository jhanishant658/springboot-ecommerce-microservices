import { useTheme } from "../../theme/ThemeContext";
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import CategoryChips from "./CategoryChips";
import PriceFilterBar from "./PriceFilterBar";

/**
 * `page` -> Spring Data Page<Product> as-is from whichever endpoint is
 * currently active (all / category / search / filter):
 *   { content, number, totalPages, totalElements, size, first, last }
 *
 * `categories` / `categoriesHasMore` / `onLoadMoreCategories` -> paged
 * from GET /api/v1/products/categories?page=N (5 at a time).
 *
 * The parent owns which endpoint is "active" — this component just
 * fires the intent (search / category / price filter / page change)
 * and renders whatever `page` it's handed.
 */
export default function ProductGrid({
  page,
  categories,
  categoriesHasMore,
  onLoadMoreCategories,
  activeCategory,
  onCategoryChange,
  onSearch,
  onClearSearch,
  onPriceFilter,
  onResetPriceFilter,
  onAddToCart,
  onPageChange,
  isAdmin,
  onEditProduct,
  onDeleteProduct,
}) {
  const { t } = useTheme();
  const products = page?.content ?? [];
  const totalPages = page?.totalPages ?? 1;
  const current = page?.number ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className={`text-3xl font-black uppercase tracking-tighter ${t.text}`}>Catalog</h1>
        <SearchBar onSearch={onSearch} onClear={onClearSearch} />
      </div>

      <div className="mb-4">
        <CategoryChips
          categories={categories}
          hasMore={categoriesHasMore}
          onLoadMore={onLoadMoreCategories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {activeCategory && (
        <div className="mb-6">
          <PriceFilterBar onApply={onPriceFilter} onReset={onResetPriceFilter} />
        </div>
      )}

      {products.length === 0 ? (
        <p className={`py-16 text-center text-sm ${t.muted}`}>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              isAdmin={isAdmin}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={current === 0}
            onClick={() => onPageChange(current - 1)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            ← Prev
          </button>
          <span className={`font-mono text-xs ${t.faint}`}>{current + 1} / {totalPages}</span>
          <button
            disabled={current + 1 >= totalPages}
            onClick={() => onPageChange(current + 1)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 disabled:opacity-30`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
