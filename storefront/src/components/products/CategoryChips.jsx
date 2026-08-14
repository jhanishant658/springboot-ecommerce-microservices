import { useTheme } from "../../theme/ThemeContext";

/**
 * `categoriesPage` -> Page<String> from GET /api/v1/products/categories?page=N
 * (backend pages categories 5 at a time). Pass the accumulated list of
 * category names you've loaded so far in `categories`, and call
 * `onLoadMore` (bumping the page you request) to fetch the next 5 —
 * hide the button once `hasMore` is false (i.e. categoriesPage.last).
 */
export default function CategoryChips({ categories, hasMore, onLoadMore, activeCategory, onCategoryChange }) {
  const { t } = useTheme();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
          !activeCategory ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onCategoryChange(c)}
          className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
            activeCategory === c ? "bg-orange-500 text-zinc-950" : `${t.surface} ${t.muted} hover:text-orange-500`
          }`}
        >
          {c}
        </button>
      ))}
      {hasMore && (
        <button onClick={onLoadMore} className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-cyan-400`}>
          More…
        </button>
      )}
    </div>
  );
}
