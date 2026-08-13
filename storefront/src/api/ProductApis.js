import axios from "axios";
import { BASE_URL, ENDPOINTS } from "./endpoints.js";
async function createProductApi(data){
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.createProduct.path}`, data);
    return response.data;
}
async function getProductByIdsApi(data) {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.getProductsByIds.path}`, data);
    return response.data;
}
async function getAllProductsApi(page, size) {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.getAllProducts.path.replace(':page', page).replace(':size', size)}`);
    return response.data;
}
async function getProductsByCategoryApi(category, page) {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.getByCategory.path.replace(':category', category).replace(':page', page)}`);
    return response.data;
}
export { createProductApi, getProductByIdsApi, getAllProductsApi, getProductsByCategoryApi };


