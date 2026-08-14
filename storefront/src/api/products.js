import client from "./client";

/** GET /api/v1/products/all/{page}/{size} -> Page<Product> */
export const getAllProducts = (page = 0, size = 8) =>
  client.get(`/api/v1/products/all/${page}/${size}`).then((r) => r.data);

/** GET /api/v1/products/{id} -> Product */
export const getProduct = (id) =>
  client.get(`/api/v1/products/${id}`).then((r) => r.data);

/** GET /api/v1/products/category/{category}/{page} -> Page<Product> (size 10, fixed server-side) */
export const getByCategory = (category, page = 0) =>
  client.get(`/api/v1/products/category/${encodeURIComponent(category)}/${page}`).then((r) => r.data);

/** GET /api/v1/products/search?keyword=&page= -> Page<Product> */
export const searchProducts = (keyword, page = 0) =>
  client.get("/api/v1/products/search", { params: { keyword, page } }).then((r) => r.data);

/**
 * GET /api/v1/products/filter?keyword=&min=&max=&lowToHigh=&page=
 * `keyword` here is the category name — filtering only works within
 * a selected category. -> Page<Product>
 */
export const filterProducts = (category, min, max, lowToHigh, page = 0) =>
  client
    .get("/api/v1/products/filter", { params: { keyword: category, min, max, lowToHigh, page } })
    .then((r) => r.data);

/** GET /api/v1/products/categories?page= -> Page<String> (size 5, fixed server-side) */
export const getCategories = (page = 0) =>
  client.get("/api/v1/products/categories", { params: { page } }).then((r) => r.data);

/** POST /api/v1/products/getProducts, body: number[] -> CartProduct[] */
export const getProductsByIds = (ids) =>
  client.post("/api/v1/products/getProducts", ids).then((r) => r.data);

/** POST /api/v1/products, body: CreateProductRequest -> Product */
export const createProduct = (payload) =>
  client.post("/api/v1/products", payload).then((r) => r.data);

/** PUT /api/v1/products/{id}, body: Product -> Product */
export const updateProduct = (id, payload) =>
  client.put(`/api/v1/products/${id}`, payload).then((r) => r.data);

/** DELETE /api/v1/products/{id} -> 204 */
export const deleteProduct = (id) => client.delete(`/api/v1/products/${id}`);
