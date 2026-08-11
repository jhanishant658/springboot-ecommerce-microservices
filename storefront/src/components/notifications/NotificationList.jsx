import { Bell } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import NotificationItem from "./NotificationItem";

/** `notifications` -> NotificationResponse[] from GET /api/v1/notifications/users */
export default function NotificationList({ notifications }) {
  const { t } = useTheme();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Notifications</h1>
      {notifications.length === 0 ? (
        <div className="py-16 text-center">
          <Bell className={`mx-auto mb-4 h-10 w-10 ${t.faint}`} />
          <p className={`text-sm ${t.muted}`}>You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}
    </div>
  );
}
