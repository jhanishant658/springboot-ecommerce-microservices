import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      className={`relative flex h-8 w-16 items-center rounded-full border transition-colors ${
        isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-300 bg-zinc-100"
      }`}
      title="Toggle theme"
    >
      <span
        className={`absolute flex h-6 w-6 items-center justify-center rounded-full transition-all ${
          isDark ? "left-1 bg-zinc-950" : "left-9 bg-white shadow"
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-orange-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-orange-500" />
        )}
      </span>
    </button>
  );
}
