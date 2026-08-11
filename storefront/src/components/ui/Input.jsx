import { useTheme } from "../../theme/ThemeContext";

export default function Input({ label, icon: Icon, error, ...props }) {
  const { t } = useTheme();
  return (
    <label className="block">
      {label && (
        <span className={`mb-2 block text-xs font-bold uppercase tracking-wider ${t.muted}`}>
          {label}
        </span>
      )}
      <div className="relative">
        {Icon && (
          <Icon className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${t.faint}`} />
        )}
        <input
          className={`w-full border ${t.inputBg} ${t.text} py-3 text-sm outline-none transition-colors focus:border-cyan-400 placeholder:${t.faint} ${
            Icon ? "pl-10 pr-3" : "px-3"
          } ${error ? "border-rose-500" : t.border}`}
          {...props}
        />
      </div>
      {error && <span className="mt-1.5 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}
