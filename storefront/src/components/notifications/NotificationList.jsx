import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import NotificationItem from "./NotificationItem";
import { getMyNotificationsApi } from "../../api/NotificationApis";

export default function NotificationList() {
  const { t } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getMyNotificationsApi()
      .then((data) => {
        if (!cancelled) setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError("Notifications load nahi ho paaye. Please login ya backend check karo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className={`py-16 text-center text-sm ${t.muted}`}>Loading notifications...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className={`mb-8 text-3xl font-black uppercase tracking-tighter ${t.text}`}>Notifications</h1>

      {error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : notifications.length === 0 ? (
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