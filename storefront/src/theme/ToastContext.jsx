import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useTheme } from "./ThemeContext";

/**
 * Lightweight toast/popup system — no extra dependency.
 * Fires a small stacked card in the corner of the screen so the user
 * always gets visible confirmation that an action succeeded or failed,
 * instead of things silently happening (or silently failing) in the background.
 *
 * Usage: const { success, error, info } = useToast(); success("Added to cart");
 */

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

const TONES = {
  success: { icon: CheckCircle2, ring: "border-emerald-500", iconClr: "text-emerald-500" },
  error: { icon: XCircle, ring: "border-rose-500", iconClr: "text-rose-500" },
  info: { icon: Info, ring: "border-orange-500", iconClr: "text-orange-500" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "info", duration = 3500) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, tone }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = {
    success: (msg, duration) => push(msg, "success", duration),
    error: (msg, duration) => push(msg, "error", duration ?? 5000),
    info: (msg, duration) => push(msg, "info", duration),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  const { t } = useTheme();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:top-6 sm:right-6">
      {toasts.map((toast) => {
        const tone = TONES[toast.tone] ?? TONES.info;
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex animate-toast-in items-start gap-3 border-l-4 ${tone.ring} ${t.surface} border ${t.border} p-3 shadow-lg`}
            role="status"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.iconClr}`} />
            <p className={`flex-1 text-sm font-semibold ${t.text}`}>{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className={`shrink-0 ${t.faint} hover:${t.text}`}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
