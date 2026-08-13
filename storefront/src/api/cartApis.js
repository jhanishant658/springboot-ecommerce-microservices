import api from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

export async function addToCartApi(product, quantity = 1) {
  const response = await api.post(ENDPOINTS.addToCart.path, { ...product, quantity });
  return response.data;
}

export async function updateCartApi(products) {
  const response = await api.put(ENDPOINTS.updateCart.path, products);
  return response.data;
}

export async function getCartApi() {
  const response = await api.post(ENDPOINTS.getCart.path);
  return response.data;
}