import api from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

export async function getMyNotificationsApi() {
  const response = await api.get(ENDPOINTS.myNotifications.path);
  return response.data;
}