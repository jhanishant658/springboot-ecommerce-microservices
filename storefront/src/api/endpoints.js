/**
 * REFERENCE ONLY — no fetch/axios calls happen in this file.
 * Updated to match the latest backend (Aug 2026 changes):
 *   - Product-Service: added search, price-filter, paginated categories,
 *     update, delete.
 *   - UserService: signup now returns a plain boolean; login now returns
 *     ONLY { token } (no embedded user — decode the JWT or call getProfile
 *     with the userName you already have client-side to get user details);
 *     verifyUser is now GET with a JSON body { userName, otp } instead of
 *     path variables (send it as a GET-with-body request, e.g. axios
 *     `{ method: "get", url, data: { userName, otp } }` — plain fetch()
 *     can't send a body on GET, so use axios or XHR here).
 *
 * Cart / Order / Wallet / Payment / Notifications all read `userId`
 * server-side from the JWT (UserContext) — send
 * `Authorization: Bearer <token>` on those calls, not a userId param.
 */

export const BASE_URL = "https://urban-waffle-jj9qx5qj69gpc5v65-8080.app.github.dev";

export const ENDPOINTS = {
  // ---- UserService ----
  signup: { method: "POST", path: "/api/v1/user/auth/signup" },              // body: SignupRequest -> boolean
  login: { method: "POST", path: "/api/v1/user/auth/login" },                // body: LoginRequest -> AuthResponse { token }
  verifyOtp: { method: "GET", path: "/api/v1/user/verifyUser", bodyOnGet: true }, // body: { userName, otp } -> string message
  forgetPassword: { method: "POST", path: "/api/v1/user/auth/forgetPassword" }, // body: LoginRequest -> string message
  getProfile: { method: "GET", path: "/api/v1/user/users/:userName" },        // -> UserResponse
  updateProfile: { method: "PUT", path: "/api/v1/user/users/:userName" },     // body: ProfileUpdateRequest -> UserResponse

  // ---- Product-Service ----
  getProduct: { method: "GET", path: "/api/v1/products/:id" },                // -> Product
  createProduct: { method: "POST", path: "/api/v1/products" },                // body: CreateProductRequest -> Product
  updateProduct: { method: "PUT", path: "/api/v1/products/:id" },             // body: Product -> Product
  deleteProduct: { method: "DELETE", path: "/api/v1/products/:id" },          // -> 204
  getByCategory: { method: "GET", path: "/api/v1/products/category/:category/:page" }, // -> Page<Product> (size 10)
  getAllProducts: { method: "GET", path: "/api/v1/products/all/:page/:size" }, // -> Page<Product>
  getProductsByIds: { method: "POST", path: "/api/v1/products/getProducts" }, // body: number[] -> CartProduct[]
  searchProducts: { method: "GET", path: "/api/v1/products/search", query: ["keyword", "page"] }, // -> Page<Product> (size 10)
  filterProducts: { method: "GET", path: "/api/v1/products/filter", query: ["keyword", "min", "max", "lowToHigh", "page"] },
  // NOTE: `keyword` here is actually the CATEGORY name — filter only works
  // within a category (findByCategoryAndPriceBetween...) -> Page<Product> (size 10)
  getCategories: { method: "GET", path: "/api/v1/products/categories", query: ["page"] }, // -> Page<String> (size 5)

  // ---- CartService (needs auth header) ----
  addToCart: { method: "POST", path: "/api/v1/cart/addProduct" },       // body: { id, quantity, price }
  updateCart: { method: "PUT", path: "/api/v1/cart/updateProduct" },    // body: { id, quantity, price }[]
  getCart: { method: "POST", path: "/api/v1/cart/getCart" },            // -> CartProduct[]

  // ---- OrderService (needs auth header) ----
  placeOrder: { method: "POST", path: "/api/v1/order/placeOrder" },     // no body -> Order
  orderHistory: { method: "GET", path: "/api/v1/order/orderHistory" },  // -> Order[]
  orderDetail: { method: "GET", path: "/api/v1/order/getOrderDetails/:orderId" }, // -> OrderDetail
  updateOrderStatus: { method: "PATCH", path: "/api/v1/order/updateOrderStatus/:orderId/:status" },
  directPlaceOrder: { method: "POST", path: "/api/v1/order/directOrder" },

  // ---- PaymentService (needs auth header) ----
  getWallet: { method: "GET", path: "/api/v1/wallets" },                // -> WalletResponse
  topUpWallet: { method: "POST", path: "/api/v1/wallets/top-up" },      // body: { amount } -> WalletResponse
  paymentHistory: { method: "GET", path: "/api/v1/payments/users" },    // -> PaymentResponse[]

  // ---- NotificationService (needs auth header) ----
  myNotifications: { method: "GET", path: "/api/v1/notifications/users" }, // -> NotificationResponse[]
  deleteMyNotifications: { method: "DELETE", path: "/api/v1/notifications/users" }, // clears all notifications for the logged-in user
};

/**
 * Spring Data's Page<T> JSON shape — every paginated endpoint above
 * returns this. Components in this project expect exactly these fields:
 *   { content: T[], number: number (0-based current page),
 *     totalPages: number, totalElements: number, size: number,
 *     first: boolean, last: boolean }
 */
