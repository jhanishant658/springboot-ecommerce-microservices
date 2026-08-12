import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";

import SignupForm from "./components/auth/SignupForm";
import OtpForm from "./components/auth/OtpForm";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";

import ProductGrid from "./components/products/ProductGrid";
import ProductDetail from "./components/products/ProductDetail";
import CreateProductForm from "./components/products/CreateProductForm";

import CartPage from "./components/cart/CartPage";

import OrderConfirmScreen from "./components/orders/OrderConfirmScreen";
import OrderHistoryList from "./components/orders/OrderHistoryList";
import OrderDetailScreen from "./components/orders/OrderDetailScreen";

import WalletPage from "./components/wallet/WalletPage";
import NotificationList from "./components/notifications/NotificationList";


export function AppInner() {
  return (
    <Routes>

      {/* Auth Routes */}

      <Route
        path="/signup"
        element={<SignupForm />}
      />

      <Route
        path="/verify-otp"
        element={<OtpForm />}
      />

      <Route
        path="/login"
        element={<LoginForm />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordForm />}
      />


      {/* Product Routes */}

      <Route
        path="/"
        element={<ProductGrid />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetail />}
      />

      <Route
        path="/admin/products/new"
        element={<CreateProductForm />}
      />


      {/* Cart */}

      <Route
        path="/cart"
        element={<CartPage />}
      />


      {/* Order Routes */}

      <Route
        path="/order-confirm"
        element={<OrderConfirmScreen />}
      />

      <Route
        path="/orders"
        element={<OrderHistoryList />}
      />

      <Route
        path="/orders/:id"
        element={<OrderDetailScreen />}
      />


      {/* Wallet */}

      <Route
        path="/wallet"
        element={<WalletPage />}
      />


      {/* Notifications */}

      <Route
        path="/notifications"
        element={<NotificationList />}
      />

    </Routes>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}