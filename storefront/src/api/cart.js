import client from "./client";

/**
 * POST /api/v1/cart/addProduct
 * body: { id, quantity, price } (CartService.Dto.Product) -> Cart
 */
export const addToCart = (id, quantity, price) =>
  client.post("/api/v1/cart/addProduct", { id, quantity, price }).then((r) => r.data);

/**
 * PUT /api/v1/cart/updateProduct
 * body: { id, quantity, price }[] -> Cart
 */
export const updateCart = (products) =>
  client.put("/api/v1/cart/updateProduct", products).then((r) => r.data);

/** POST /api/v1/cart/getCart -> CartProduct[] */
export const getCart = () => client.post("/api/v1/cart/getCart").then((r) => r.data);
