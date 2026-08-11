import { useTheme } from "../../theme/ThemeContext";

export default function Button({ children, variant = "primary", className = "", ...props }) {
  const { t } = useTheme();
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-500 text-zinc-950 hover:bg-orange-400",
    secondary: t.secondaryBtn,
    ghost: `${t.muted} ${t.ghostHover}`,
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
