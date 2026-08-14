import client from "./client";

/** GET /api/v1/wallets -> WalletResponse */
export const getWallet = () => client.get("/api/v1/wallets").then((r) => r.data);

/** POST /api/v1/wallets/top-up, body: { amount } -> WalletResponse */
export const topUpWallet = (amount) =>
  client.post("/api/v1/wallets/top-up", { amount }).then((r) => r.data);

/** GET /api/v1/payments/users -> PaymentResponse[] */
export const getPaymentHistory = () => client.get("/api/v1/payments/users").then((r) => r.data);
