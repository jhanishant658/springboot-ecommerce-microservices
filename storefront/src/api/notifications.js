import client from "./client";

/** GET /api/v1/notifications/users -> NotificationResponse[] */
export const getMyNotifications = () => client.get("/api/v1/notifications/users").then((r) => r.data);
