import { useTheme } from "../../theme/ThemeContext";

export default function AuthShell({ eyebrow, title, children, footer }) {
  const { t } = useTheme();
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-widest text-orange-500">{eyebrow}</p>
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>{title}</h1>
      <div className="space-y-4">{children}</div>
      {footer && <div className={`mt-6 text-sm ${t.muted}`}>{footer}</div>}
    </div>
  );
}
