import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";

/**
 * Only meaningful when a category is selected — backend's /filter
 * endpoint filters price WITHIN a category (`keyword` = category name).
 * onApply({ min, max, lowToHigh }) -> GET /api/v1/products/filter
 *   ?keyword=<activeCategory>&min=&max=&lowToHigh=&page=0
 */
export default function PriceFilterBar({ onApply, onReset }) {
  const { t } = useTheme();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [lowToHigh, setLowToHigh] = useState(true);

  return (
    <div className={`flex flex-wrap items-center gap-2 border ${t.border} ${t.surface} p-3`}>
      <span className={`font-mono text-[11px] uppercase tracking-widest ${t.faint}`}>Price</span>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className={`w-20 border ${t.border} ${t.inputBg} ${t.text} px-2 py-1.5 text-xs outline-none focus:border-cyan-400`}
      />
      <span className={t.faint}>–</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className={`w-20 border ${t.border} ${t.inputBg} ${t.text} px-2 py-1.5 text-xs outline-none focus:border-cyan-400`}
      />
      <button
        onClick={() => setLowToHigh((v) => !v)}
        className={`px-2 py-1.5 text-xs font-bold uppercase tracking-wide ${t.surface} border ${t.border} ${t.muted} hover:text-orange-500`}
      >
        {lowToHigh ? "Low → High" : "High → Low"}
      </button>
      <Button
        variant="secondary"
        className="!px-3 !py-1.5 text-xs"
        disabled={min === "" || max === ""}
        onClick={() => onApply({ min: Number(min), max: Number(max), lowToHigh })}
      >
        Apply
      </Button>
      <button
        onClick={() => {
          setMin("");
          setMax("");
          onReset();
        }}
        className={`text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-rose-400`}
      >
        Reset
      </button>
    </div>
  );
}
