import { useTheme } from "../../theme/ThemeContext";

export default function AuthShell({ eyebrow, title, children, footer, error }) {
  const { t } = useTheme();
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-orange-500">{eyebrow}</p>
      <h1 className={`mb-6 text-3xl font-black uppercase tracking-tighter ${t.text}`}>{title}</h1>
      {error && (
        <div className="mb-4 border border-rose-500 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400">
          {error}
        </div>
      )}
      <div className="space-y-4">{children}</div>
      {footer && <div className={`mt-6 text-sm ${t.muted}`}>{footer}</div>}
    </div>
  );
}
