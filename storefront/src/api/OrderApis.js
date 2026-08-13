import api from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

export async function placeOrderApi() {
  const response = await api.post(ENDPOINTS.placeOrder.path);
  return response.data;
}

export async function getOrderHistoryApi() {
  const response = await api.get(ENDPOINTS.orderHistory.path);
  return response.data;
}

export async function getOrderDetailApi(orderId) {
  const response = await api.get(ENDPOINTS.orderDetail.path.replace(":orderId", orderId));
  return response.data;
}