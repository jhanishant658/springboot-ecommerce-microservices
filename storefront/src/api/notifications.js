import client from "./client";

/** GET /api/v1/notifications/users -> NotificationResponse[] */
export const getMyNotifications = () => client.get("/api/v1/notifications/users").then((r) => r.data);

/** DELETE /api/v1/notifications/users -> clears all notifications for the logged-in user */
export const deleteMyNotifications = () => client.delete("/api/v1/notifications/users").then((r) => r.data);
