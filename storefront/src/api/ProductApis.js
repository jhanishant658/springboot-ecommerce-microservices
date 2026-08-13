import api from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

async function createProductApi(data) {
  const response = await api.post(ENDPOINTS.createProduct.path, data);
  return response.data;
}

async function getProductApi(id) {
  const response = await api.get(`${ENDPOINTS.getProduct.path}${encodeURIComponent(id)}`);
  return response.data;
}

async function getProductByIdsApi(data) {
  const response = await api.post(ENDPOINTS.getProductsByIds.path, data);
  return response.data;
}

async function getAllProductsApi(page, size) {
  const response = await api.get(ENDPOINTS.getAllProducts.path.replace(":page", page).replace(":size", size));
  return response.data;
}

async function getProductsByCategoryApi(category, page) {
  const response = await api.get(ENDPOINTS.getByCategory.path.replace(":category", encodeURIComponent(category)).replace(":page", page));
  return response.data;
}

async function getCategoriesApi(page = 0) {
  const response = await api.get(`${ENDPOINTS.categories.path}?page=${page}`);
  return response.data;
}

export { createProductApi, getProductApi, getProductByIdsApi, getAllProductsApi, getProductsByCategoryApi, getCategoriesApi };