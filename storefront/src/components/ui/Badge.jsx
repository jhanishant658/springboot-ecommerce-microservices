import { useTheme } from "../../theme/ThemeContext";

export default function Badge({ children, tone = "default" }) {
  const { t } = useTheme();
  const tones = {
    default: `${t.surface} ${t.muted} border ${t.border}`,
    success: "bg-emerald-400/10 text-emerald-500",
    danger: "bg-rose-500/10 text-rose-500",
    warn: "bg-amber-400/10 text-amber-500",
  };
  return (
    <span className={`inline-block px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
}
