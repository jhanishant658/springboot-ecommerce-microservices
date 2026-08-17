import { useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import Button from "../ui/Button";
import NotificationItem from "./NotificationItem";

/**
 * `notifications` -> NotificationResponse[] from GET /api/v1/notifications/users
 * `onClearAll` -> calls DELETE /api/v1/notifications/users and clears local state
 */
export default function NotificationList({ notifications, onClearAll }) {
  const { t } = useTheme();
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClearClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setClearing(true);
    Promise.resolve(onClearAll?.()).finally(() => {
      setClearing(false);
      setConfirming(false);
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className={`text-3xl font-black uppercase tracking-tighter ${t.text}`}>Notifications</h1>
        {notifications.length > 0 && (
          <Button
            variant={confirming ? "primary" : "secondary"}
            className="!px-3 !py-2 text-xs"
            onClick={handleClearClick}
            onBlur={() => setConfirming(false)}
            disabled={clearing}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {clearing ? "Clearing…" : confirming ? "Confirm clear?" : "Clear all"}
          </Button>
        )}
      </div>
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
