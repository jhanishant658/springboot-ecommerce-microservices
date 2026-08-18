import client from "./client";

/** POST /api/v1/order/placeOrder, no body -> Order */
export const placeOrder = () => client.post("/api/v1/order/placeOrder").then((r) => r.data);

/** GET /api/v1/order/orderHistory -> Order[] */
export const getOrderHistory = () => client.get("/api/v1/order/orderHistory").then((r) => r.data);

/** GET /api/v1/order/getOrderDetails/{orderId} -> OrderDetail */
export const getOrderDetail = (orderId) =>
  client.get(`/api/v1/order/getOrderDetails/${orderId}`).then((r) => r.data);

/** PATCH /api/v1/order/updateOrderStatus/{orderId}/{status} -> string message */
export const updateOrderStatus = (orderId, status) =>
  client.patch(`/api/v1/order/updateOrderStatus/${orderId}/${status}`).then((r) => r.data);
export const directOrder = (userId, productId, qty, price) => {
  const data = {
    userId: userId,
    products: [
      {
        id: productId,
        quantity: qty
      }
    ],
    totalAmount: price * qty
  };

  return client
    .post("/api/v1/order/directOrder", data)
    .then((r) => r.data);
};
  
