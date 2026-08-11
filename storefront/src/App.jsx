import { useState } from "react";
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import TopNav from "./components/layout/TopNav";

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

import {
  MOCK_PRODUCTS,
  CATEGORIES,
  MOCK_ORDERS,
  MOCK_ORDER_DETAIL,
  MOCK_WALLET,
  MOCK_PAYMENTS,
  MOCK_NOTIFICATIONS,
} from "./data/mockData";

/**
 * Everything below is DEMO WIRING only — plain useState standing in for
 * your real API + auth/cart/order state. Replace each handler with your
 * own axios/fetch calls to the endpoints in src/api/endpoints.js; the
 * component props are already shaped to match those responses.
 */
function AppInner() {
  const { t } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pendingUserName, setPendingUserName] = useState("");
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [wallet, setWallet] = useState(MOCK_WALLET);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [notifications] = useState(MOCK_NOTIFICATIONS);

  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === product.id);
      if (existing) return c.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...c, { ...product, quantity: qty }];
    });
  };

  const filteredProducts = activeCategory ? MOCK_PRODUCTS.filter((p) => p.category === activeCategory) : MOCK_PRODUCTS;
  const unreadNotifications = notifications.filter((n) => n.status !== "SENT").length;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const totalAmount = cart.reduce((s, i) => s + (i.discountPrice ?? i.price) * i.quantity, 0);
    const newOrder = { id: Math.floor(1000 + Math.random() * 9000), status: "PLACED", totalAmount, date: new Date().toISOString(), products: cart.map((i) => ({ id: i.id, quantity: i.quantity })) };
    setActiveOrder(newOrder);
    setOrders((o) => [newOrder, ...o]);
    setCart([]);
    navigate("/order-confirm");
  };

  const handleTopUp = (amount) => {
    setWallet((w) => ({ ...w, balance: w.balance + amount }));
    setPayments((p) => [
      { id: Math.floor(Math.random() * 100000), orderId: null, userId: wallet.id, amount, status: "SUCCESS", message: "Wallet top-up", createdAt: new Date().toISOString() },
      ...p,
    ]);
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  return (
    <div className={`min-h-screen ${t.bg} font-sans ${t.text} transition-colors`}>
      <ConditionalNav
        user={user}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        notificationCount={unreadNotifications}
        onLogout={() => {
          setUser(null);
          navigate("/");
        }}
      />

      <Routes>
        <Route
          path="/signup"
          element={
            <SignupForm
              onSubmit={(f) => {
                setPendingUserName(f.userName);
                navigate("/verify-otp");
              }}
            />
          }
        />
        <Route
          path="/verify-otp"
          element={
            <OtpForm
              userName={pendingUserName}
              onSubmit={() => {
                setUser({ userName: pendingUserName });
                navigate("/");
              }}
              onResend={() => {}}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              onSubmit={(f) => {
                setUser({ userName: f.email.split("@")[0] });
                navigate("/");
              }}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordForm
              onSubmit={(f) => {
                setPendingUserName(f.email.split("@")[0]);
                navigate("/verify-otp");
              }}
            />
          }
        />

        <Route
          path="/"
          element={
            <ProductGrid
              products={filteredProducts}
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddToCart={addToCart}
            />
          }
        />
        <Route path="/products/:id" element={<ProductDetailRoute onAddToCart={(p, q) => { addToCart(p, q); navigate("/cart"); }} />} />
        <Route path="/admin/products/new" element={<CreateProductForm onSubmit={() => navigate("/")} />} />

        <Route
          path="/cart"
          element={
            <CartPage
              items={cart}
              onQtyChange={(id, qty) => setCart((c) => c.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))}
              onRemove={(id) => setCart((c) => c.filter((i) => i.id !== id))}
              onContinueShopping={() => navigate("/")}
              onCheckout={handleCheckout}
            />
          }
        />

        <Route
          path="/order-confirm"
          element={
            activeOrder ? (
              <OrderConfirmScreen order={activeOrder} onViewHistory={() => navigate("/orders")} onContinueShopping={() => navigate("/")} />
            ) : (
              <Navigate to="/orders" replace />
            )
          }
        />
        <Route path="/orders" element={<OrderHistoryList orders={orders} onView={(o) => navigate(`/orders/${o.id}`)} />} />
        <Route
          path="/orders/:id"
          element={<OrderDetailRoute orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
        />

        <Route path="/wallet" element={<WalletPage wallet={wallet} payments={payments} onTopUp={handleTopUp} />} />
        <Route path="/notifications" element={<NotificationList notifications={notifications} />} />
      </Routes>
    </div>
  );
}

function ConditionalNav({ user, cartCount, notificationCount, onLogout }) {
  // Hides the nav on auth screens, same as the original single-file version.
  const authPaths = ["/login", "/signup", "/verify-otp", "/forgot-password"];
  const location = useLocation();
  if (authPaths.includes(location.pathname)) return null;
  return <TopNav user={user} cartCount={cartCount} notificationCount={notificationCount} onLogout={onLogout} />;
}

function ProductDetailRoute({ onAddToCart }) {
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find((p) => String(p.id) === id);
  if (!product) return <Navigate to="/" replace />;
  return <ProductDetail product={product} backTo="/" onAddToCart={onAddToCart} />;
}

function OrderDetailRoute({ orders, onUpdateStatus }) {
  const { id } = useParams();
  const order = orders.find((o) => String(o.id) === id);
  // Real backend: fetch GET /api/v1/order/getOrderDetails/{id} for full OrderDetail
  // (CartProduct[] with titles/thumbnails). Falling back to demo detail here.
  const detail = order ? { ...MOCK_ORDER_DETAIL, status: order.status, totalAmount: order.totalAmount, date: order.date } : null;
  if (!detail) return <Navigate to="/orders" replace />;
  return <OrderDetailScreen orderId={id} detail={detail} backTo="/orders" onUpdateStatus={onUpdateStatus} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
