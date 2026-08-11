import { createContext, useContext, useState } from "react";

/* One toggle, two token sets. Every component reads colors from
   useTheme() instead of hardcoding zinc-950 etc, so light/dark is a
   single source of truth. */

export const DARK = {
  bg: "bg-zinc-950",
  surface: "bg-zinc-900",
  surfaceHover: "hover:bg-zinc-800",
  border: "border-zinc-800",
  borderHover: "hover:border-zinc-700",
  text: "text-zinc-50",
  muted: "text-zinc-400",
  mutedDark: "text-zinc-500",
  faint: "text-zinc-600",
  navBg: "bg-zinc-950/95",
  inputBg: "bg-zinc-900",
  secondaryBtn: "bg-zinc-800 text-zinc-50 hover:bg-zinc-700 border border-zinc-700",
  ghostHover: "hover:bg-zinc-900 hover:text-zinc-50",
};

export const LIGHT = {
  bg: "bg-zinc-50",
  surface: "bg-white",
  surfaceHover: "hover:bg-zinc-100",
  border: "border-zinc-200",
  borderHover: "hover:border-zinc-300",
  text: "text-zinc-900",
  muted: "text-zinc-500",
  mutedDark: "text-zinc-500",
  faint: "text-zinc-400",
  navBg: "bg-white/95",
  inputBg: "bg-white",
  secondaryBtn: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-300",
  ghostHover: "hover:bg-zinc-100 hover:text-zinc-900",
};

const ThemeContext = createContext(null);

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const t = theme === "dark" ? DARK : LIGHT;
  const toggle = () => setTheme((th) => (th === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle, t }}>{children}</ThemeContext.Provider>;
}
