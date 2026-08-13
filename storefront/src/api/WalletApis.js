import api from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

export async function getWalletApi() {
  const response = await api.get(ENDPOINTS.getWallet.path);
  return response.data;
}

export async function topUpWalletApi(amount) {
  const response = await api.post(ENDPOINTS.topUpWallet.path, { amount });
  return response.data;
}

export async function getPaymentHistoryApi() {
  const response = await api.get(ENDPOINTS.paymentHistory.path);
  return response.data;
}