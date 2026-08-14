import { Search, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";

/**
 * onSearch(keyword) -> GET /api/v1/products/search?keyword=&page=0
 * onClear() -> go back to plain listing (getAllProducts / getByCategory)
 */
export default function SearchBar({ onSearch, onClear, initialValue = "" }) {
  const { t } = useTheme();
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  const clear = () => {
    setValue("");
    onClear();
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-md">
      <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${t.faint}`} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className={`w-full border ${t.border} ${t.inputBg} ${t.text} py-2 pl-10 pr-9 text-sm outline-none focus:border-cyan-400`}
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${t.faint} hover:text-orange-500`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
