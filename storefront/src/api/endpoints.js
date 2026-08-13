/**
 * REFERENCE ONLY — no fetch/axios calls happen in this file.
 * Exact routes from GateWay/application.properties + each controller.
 *
 * Cart / Order / Wallet / Payment / Notifications all read `userId`
 * server-side from the JWT (UserContext) — send
 * `Authorization: Bearer <token>` on those calls, not a userId param.
 */

export const BASE_URL = "https://urban-waffle-jj9qx5qj69gpc5v65-8080.app.github.dev";;

export const ENDPOINTS = {
  // ---- UserService ----
  signup: { method: "POST", path: "/api/v1/user/auth/signup" },
  login: { method: "POST", path: "/api/v1/user/auth/login" },
  verifyOtp: { method: "GET", path: "/api/v1/user/verifyUser" },
  forgetPassword: { method: "POST", path: "/api/v1/user/auth/forgetPassword" },
  getProfile: { method: "GET", path: "/api/v1/user/users/:userName" },
  updateProfile: { method: "PUT", path: "/api/v1/user/users/:userName" },

  // ---- Product-Service ----
  getProduct: { method: "GET", path: "/api/v1/products/" },
  createProduct: { method: "POST", path: "/api/v1/products" },
  getByCategory: { method: "GET", path: "/api/v1/products/category/:category/:page" },
  getAllProducts: { method: "GET", path: "/api/v1/products/all/:page/:size" },
  getProductsByIds: { method: "POST", path: "/api/v1/products/getProducts" },
  categories: { method: "GET", path: "/api/v1/products/categories" },

  // ---- CartService (auth) ----
  addToCart: { method: "POST", path: "/api/v1/cart/addProduct" },
  updateCart: { method: "PUT", path: "/api/v1/cart/updateProduct" },
  getCart: { method: "POST", path: "/api/v1/cart/getCart" },

  // ---- OrderService (auth) ----
  placeOrder: { method: "POST", path: "/api/v1/order/placeOrder" },
  orderHistory: { method: "GET", path: "/api/v1/order/orderHistory" },
  orderDetail: { method: "GET", path: "/api/v1/order/getOrderDetails/:orderId" },
  updateOrderStatus: { method: "PATCH", path: "/api/v1/order/updateOrderStatus/:orderId/:status" },

  // ---- PaymentService (auth) ----
  getWallet: { method: "GET", path: "/api/v1/wallets" },
  topUpWallet: { method: "POST", path: "/api/v1/wallets/top-up" },
  paymentHistory: { method: "GET", path: "/api/v1/payments/users" },

  // ---- NotificationService (auth) ----
  myNotifications: { method: "GET", path: "/api/v1/notifications/users" },
};