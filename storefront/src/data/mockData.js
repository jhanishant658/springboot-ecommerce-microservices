/**
 * DEMO DATA — field names match your Spring Boot DTOs/entities exactly,
 * so swapping this for real API responses later needs zero remapping.
 *
 *   Product              -> Product-Service Entity/Product.java
 *   CartProduct           -> CartService Dto/CartProduct.java
 *   Order                -> OrderService Model/Order.java
 *   OrderDetail           -> OrderService Res/OrderDetail.java
 *   UserResponse          -> UserService Dto/UserDto.UserResponse
 *   WalletResponse        -> PaymentService Dtos/PaymentDtos.WalletResponse
 *   PaymentResponse       -> PaymentService Dtos/PaymentDtos.PaymentResponse
 *   NotificationResponse  -> NotificationService Dto/NotificationDtos.NotificationResponse
 */

const IMG_RNR =
  "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/1/f/t/10-rnr-10031-grey-blue-44-rannr-grey-original-imahnmxwf7jfjahx.jpeg?q=70";
const IMG_CHAZE =
  "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/l/a/s/8-chaze-8-ligero-orange-resized-2-original-imahcgzcpg4hwhyf.jpeg?q=70";

// ---- Product-Service: Product entity ----
export const MOCK_PRODUCTS = [
  { id: 1, title: "RNR 10031 Running Shoes — Grey/Blue", description: "Lightweight mesh upper, cushioned midsole, built for daily runs on road or track.", category: "Footwear", images: [IMG_RNR], discountPercentage: 25, rating: 4.3, price: 1999, discountPrice: 1499, thumbnail: IMG_RNR },
  { id: 2, title: "Chaze Ligero Sneakers — Orange", description: "Breathable knit construction with a molded EVA sole for all-day comfort.", category: "Footwear", images: [IMG_CHAZE], discountPercentage: 28, rating: 4.1, price: 1799, discountPrice: 1299, thumbnail: IMG_CHAZE },
  { id: 3, title: "RNR 10031 Running Shoes — Grey/Blue (Wide Fit)", description: "Same grip and cushioning as the standard fit, wider toe box for extra comfort.", category: "Footwear", images: [IMG_RNR], discountPercentage: 24, rating: 4.4, price: 2099, discountPrice: 1599, thumbnail: IMG_RNR },
  { id: 4, title: "Chaze Ligero Sneakers — Orange (Limited)", description: "Limited colourway of the Ligero, same lightweight build with a bolder look.", category: "Footwear", images: [IMG_CHAZE], discountPercentage: 0, rating: 4.2, price: 1899, discountPrice: 1899, thumbnail: IMG_CHAZE },
  { id: 5, title: "RNR 10031 Trainers — Grey/Blue", description: "Multi-surface outsole grip, reinforced heel counter for stability.", category: "Footwear", images: [IMG_RNR], discountPercentage: 18, rating: 4.5, price: 2199, discountPrice: 1799, thumbnail: IMG_RNR },
  { id: 6, title: "Chaze Ligero Sport Shoes — Orange", description: "Sport-tuned fit with extra arch support, ideal for gym and short runs.", category: "Footwear", images: [IMG_CHAZE], discountPercentage: 17, rating: 4.0, price: 1699, discountPrice: 1399, thumbnail: IMG_CHAZE },
];

export const CATEGORIES = [...new Set(MOCK_PRODUCTS.map((p) => p.category))];

// ---- CartService: Dto/CartProduct.java, + client-side quantity ----
export const MOCK_CART = [
  { ...MOCK_PRODUCTS[0], quantity: 1 },
  { ...MOCK_PRODUCTS[2], quantity: 2 },
];

// ---- OrderService: Model/Order.java ----
export const MOCK_ORDERS = [
  { id: 1042, userId: 7, products: [{ id: 1, quantity: 1 }], totalAmount: 1499, status: "DELIVERED", date: "2026-08-05T10:00:00", paymentStatus: 1, inventoryStatus: 1 },
  { id: 1039, userId: 7, products: [{ id: 2, quantity: 1 }], totalAmount: 1299, status: "CANCELLED", date: "2026-08-02T10:00:00", paymentStatus: 0, inventoryStatus: 0 },
  { id: 1058, userId: 7, products: [{ id: 5, quantity: 1 }, { id: 6, quantity: 2 }], totalAmount: 4597, status: "SHIPPED", date: "2026-08-08T10:00:00", paymentStatus: 1, inventoryStatus: 1 },
];

// ---- OrderService: Res/OrderDetail.java ----
export const MOCK_ORDER_DETAIL = {
  products: [MOCK_PRODUCTS[0]],
  quantity: [1],
  totalAmount: 1499,
  status: "DELIVERED",
  date: "2026-08-05T10:00:00",
};

// ---- UserService: Dto/UserDto.UserResponse ----
export const MOCK_USER = { userName: "jhanishant", email: "jhanishant@example.com", phone: "9876543210", address: "24 MG Road, Delhi" };

// ---- PaymentService: Dtos/PaymentDtos.WalletResponse ----
export const MOCK_WALLET = { id: 7, balance: 2450.0 };

// ---- PaymentService: Dtos/PaymentDtos.PaymentResponse ----
export const MOCK_PAYMENTS = [
  { id: 501, orderId: 1042, userId: 7, amount: 1499.0, status: "SUCCESS", message: "Paid from wallet", createdAt: "2026-08-05T10:00:05Z" },
  { id: 498, orderId: 1039, userId: 7, amount: 1299.0, status: "FAILED", message: "Insufficient balance", createdAt: "2026-08-02T10:00:03Z" },
  { id: 512, orderId: 1058, userId: 7, amount: 4597.0, status: "SUCCESS", message: "Paid from wallet", createdAt: "2026-08-08T10:00:04Z" },
];

// ---- NotificationService: Dto/NotificationDtos.NotificationResponse ----
export const MOCK_NOTIFICATIONS = [
  { id: 91, userId: 7, recipient: "jhanishant@example.com", channel: "EMAIL", subject: "Order #1042 delivered", sentAt: "2026-08-05T18:00:00Z", status: "SENT", errorMessage: null },
  { id: 95, userId: 7, recipient: "9876543210", channel: "SMS", subject: "Order #1058 shipped", sentAt: "2026-08-08T16:00:00Z", status: "SENT", errorMessage: null },
  { id: 99, userId: 7, recipient: "jhanishant@example.com", channel: "EMAIL", subject: "Payment failed for order #1039", sentAt: "2026-08-02T10:03:00Z", status: "FAILED", errorMessage: "SMTP timeout" },
];
