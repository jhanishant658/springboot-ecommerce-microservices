import { Mail, MessageSquare, AlertCircle } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Badge from "../ui/Badge";

/**
 * `notification` -> NotificationDtos.NotificationResponse:
 * { id, userId, recipient, channel: EMAIL|SMS, subject, sentAt,
 *   status: PENDING|SENT|FAILED, errorMessage }
 */
export default function NotificationItem({ notification }) {
  const { t } = useTheme();
  const Icon = notification.channel === "SMS" ? MessageSquare : Mail;
  const tone = notification.status === "SENT" ? "success" : notification.status === "FAILED" ? "danger" : "warn";

  return (
    <div className={`flex items-start gap-3 border ${t.border} ${t.surface} p-4`}>
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border ${t.border} ${t.muted}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm font-bold ${t.text}`}>{notification.subject}</p>
          <Badge tone={tone}>{notification.status}</Badge>
        </div>
        <p className={`mt-1 font-mono text-xs ${t.faint}`}>
          {notification.channel} → {notification.recipient} · {new Date(notification.sentAt).toLocaleString()}
        </p>
        {notification.status === "FAILED" && notification.errorMessage && (
          <p className="mt-2 flex items-center gap-1 text-xs text-rose-400">
            <AlertCircle className="h-3.5 w-3.5" /> {notification.errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
