import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { ToastProvider, useToast } from "./theme/ToastContext";
import TopNav from "./components/layout/TopNav";

import SignupForm from "./components/auth/SignupForm";
import OtpForm from "./components/auth/OtpForm";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";

import ProductGrid from "./components/products/ProductGrid";
import ProductDetail from "./components/products/ProductDetail";
import ProductForm from "./components/products/ProductForm";

import CartPage from "./components/cart/CartPage";

import OrderConfirmScreen from "./components/orders/OrderConfirmScreen";
import OrderHistoryList from "./components/orders/OrderHistoryList";
import OrderDetailScreen from "./components/orders/OrderDetailScreen";

import WalletPage from "./components/wallet/WalletPage";
import NotificationList from "./components/notifications/NotificationList";

import * as authApi from "./api/auth";
import * as productsApi from "./api/products";
import * as cartApi from "./api/cart";
import * as ordersApi from "./api/orders";
import * as walletApi from "./api/wallet";
import * as notificationsApi from "./api/notifications";
import { decodeJwt } from "./api/jwt";

const AUTH_PATHS = ["/login", "/signup", "/verify-otp", "/forgot-password"];
const EMPTY_PAGE = { content: [], number: 0, totalPages: 1 };

function AppInner() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  // ---- auth ----
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? decodeJwt(token) : null;
  });
  const [pendingUserName, setPendingUserName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // demo-only, no role field on the backend yet

  // ---- products ----
  const [productsPage, setProductsPage] = useState(EMPTY_PAGE);
  const [categories, setCategories] = useState([]);
  const [categoriesPageIdx, setCategoriesPageIdx] = useState(0);
  const [categoriesHasMore, setCategoriesHasMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [browseMode, setBrowseMode] = useState("all"); // all | category | search | filter
  const [searchKeyword, setSearchKeyword] = useState("");

  // ---- cart ----
  const [cartProducts, setCartProducts] = useState([]); // CartProduct[] from getCart
  const [cartQuantities, setCartQuantities] = useState({}); // { [id]: qty } from Cart.products

  // ---- orders / wallet / notifications ----
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState({ id: null, balance: 0 });
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const cartItems = cartProducts.map((cp) => ({ ...cp, quantity: cartQuantities[cp.id] ?? 1 }));
  const unreadNotifications = notifications.filter((n) => n.status !== "SENT").length;

  // ---------- initial + auth-triggered data loads ----------
  useEffect(() => {
    productsApi.getCategories(0).then((res) => {
      setCategories(res.content ?? []);
      setCategoriesHasMore(!res.last);
    });
    productsApi.getAllProducts(0, 8).then(setProductsPage);
  }, []);

  const loadCart = useCallback(() => {
    cartApi.getCart().then(setCartProducts).catch(() => setCartProducts([]));
  }, []);

  useEffect(() => {
    if (!user) return;
    loadCart();
    ordersApi.getOrderHistory().then(setOrders).catch(() => {});
    walletApi.getWallet().then(setWallet).catch(() => {});
    walletApi.getPaymentHistory().then(setPayments).catch(() => {});
    notificationsApi.getMyNotifications().then(setNotifications).catch(() => {});
  }, [user, loadCart]);

  // ---------- auth handlers ----------
  const handleSignup = (form) => {
    setAuthError("");
    authApi
      .signup(form)
      .then((ok) => {
        if (ok) {
          toast.success("Account created — enter the OTP to verify.");
          setPendingUserName(form.userName);
          navigate("/verify-otp");
        } else {
          setAuthError("Signup failed — try a different username/email.");
          toast.error("Signup failed — try a different username/email.");
        }
      })
      .catch(() => {
        setAuthError("Signup failed. Please try again.");
        toast.error("Signup failed. Please try again.");
      });
  };

  const handleVerifyOtp = (otp) => {
    setAuthError("");
    authApi
      .verifyOtp(pendingUserName, otp)
      .then(() => {
        toast.success("Verified! You can log in now.");
        navigate("/login");
      })
      .catch(() => {
        setAuthError("Invalid or expired code.");
        toast.error("Invalid or expired code.");
      });
  };

  const handleLogin = (form) => {
    setAuthError("");
    authApi
      .login(form)
      .then(({ token }) => {
        localStorage.setItem("token", token);
        setUser(decodeJwt(token));
        toast.success("Logged in successfully.");
        navigate("/");
      })
      .catch(() => {
        setAuthError("Invalid email or password.");
        toast.error("Invalid email or password.");
      });
  };

  const handleForgotPassword = (form) => {
    setAuthError("");
    authApi
      .forgetPassword(form)
      .then(() => {
        // Backend's LoginRequest only carries email/password, but OTP
        // verification needs a userName — fetch it via profile lookup
        // if you have one, or update the backend to key OTPs by email.
        toast.success("Reset code sent — check your email.");
        setPendingUserName(form.email);
        navigate("/verify-otp");
      })
      .catch(() => {
        setAuthError("Couldn't start password reset.");
        toast.error("Couldn't start password reset.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartProducts([]);
    setCartQuantities({});
    setOrders([]);
    setWallet({ id: null, balance: 0 });
    setPayments([]);
    setNotifications([]);
    toast.info("Logged out.");
    navigate("/");
  };

  // ---------- product browsing ----------
  const applyPage = (mode) => (res) => {
    setBrowseMode(mode);
    setProductsPage(res);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchKeyword("");
    if (!category) {
      productsApi.getAllProducts(0, 8).then(applyPage("all"));
    } else {
      productsApi.getByCategory(category, 0).then(applyPage("category"));
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setActiveCategory(null);
    productsApi.searchProducts(keyword, 0).then(applyPage("search"));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    productsApi.getAllProducts(0, 8).then(applyPage("all"));
  };

  const handlePriceFilter = ({ min, max, lowToHigh }) => {
    productsApi.filterProducts(activeCategory, min, max, lowToHigh, 0).then(applyPage("filter"));
  };

  const handleResetPriceFilter = () => {
    productsApi.getByCategory(activeCategory, 0).then(applyPage("category"));
  };

  const handlePageChange = (page) => {
    if (browseMode === "category") productsApi.getByCategory(activeCategory, page).then(applyPage("category"));
    else if (browseMode === "search") productsApi.searchProducts(searchKeyword, page).then(applyPage("search"));
    else productsApi.getAllProducts(page, 8).then(applyPage("all"));
  };

  const handleLoadMoreCategories = () => {
    const next = categoriesPageIdx + 1;
    productsApi.getCategories(next).then((res) => {
      setCategories((c) => [...c, ...(res.content ?? [])]);
      setCategoriesHasMore(!res.last);
      setCategoriesPageIdx(next);
    });
  };

  // ---------- cart ----------
  const addToCart = (product, qty = 1) => {
    if (!user) return navigate("/login");
    const price = product.discountPrice ?? product.price;
    cartApi
      .addToCart(product.id, qty, price)
      .then((cart) => {
        setCartQuantities(Object.fromEntries((cart.products ?? []).map((p) => [p.id, p.quantity])));
        loadCart();
        toast.success(`Added "${product.name ?? "item"}" to cart.`);
      })
      .catch(() => toast.error("Couldn't add that to your cart."));
  };
  const directOrder = (product , qty) => {
     if (!user) return navigate("/login");
     
     ordersApi.directOrder(0 , product.id , qty , product.discountPrice).then((order)=>{
      toast.success(`Order Placed "${product.name ?? "item"}"`);
     })
  }

  const updateCartQuantity = (id, quantity) => {
    const products = cartItems.map((i) => ({ id: i.id, quantity: i.id === id ? quantity : i.quantity, price: i.discountPrice ?? i.price }));
    cartApi
      .updateCart(products)
      .then((cart) => {
        setCartQuantities(Object.fromEntries((cart.products ?? []).map((p) => [p.id, p.quantity])));
      })
      .catch(() => toast.error("Couldn't update cart quantity."));
  };

  const removeFromCart = (id) => {
    const products = cartItems.filter((i) => i.id !== id).map((i) => ({ id: i.id, quantity: i.quantity, price: i.discountPrice ?? i.price }));
    cartApi
      .updateCart(products)
      .then(() => {
        loadCart();
        toast.info("Removed from cart.");
      })
      .catch(() => toast.error("Couldn't remove that item."));
  };

  // ---------- checkout ----------
  const handleCheckout = () => {
    if (!user) return navigate("/login");
    ordersApi
      .placeOrder()
      .then((order) => {
        setActiveOrder(order);
        setCartProducts([]);
        setCartQuantities({});
        ordersApi.getOrderHistory().then(setOrders).catch(() => {});
        toast.success("Order placed!");
        navigate("/order-confirm");
      })
      .catch(() => toast.error("Checkout failed. Please try again."));
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    ordersApi
      .updateOrderStatus(orderId, status)
      .then(() => {
        setOrders((os) => os.map((o) => (o.id === Number(orderId) ? { ...o, status } : o)));
        toast.success(`Order status updated to ${status}.`);
      })
      .catch(() => toast.error("Couldn't update order status."));
  };

  // ---------- wallet ----------
  const handleTopUp = (amount) => {
    walletApi
      .topUpWallet(amount)
      .then((w) => {
        setWallet(w);
        walletApi.getPaymentHistory().then(setPayments).catch(() => {});
        toast.success(`Wallet topped up successfully.`);
      })
      .catch(() => toast.error("Top-up failed. Please try again."));
  };

  // ---------- admin product CRUD ----------
  const refreshCurrentProductPage = () => handlePageChange(productsPage.number ?? 0);

  const handleCreateProduct = (payload) => {
    productsApi
      .createProduct(payload)
      .then(() => {
        refreshCurrentProductPage();
        toast.success("Product created.");
        navigate("/");
      })
      .catch(() => toast.error("Couldn't create the product."));
  };

  const handleUpdateProduct = (payload) => {
    productsApi
      .updateProduct(payload.id, payload)
      .then(() => {
        refreshCurrentProductPage();
        toast.success("Product updated.");
        navigate("/");
      })
      .catch(() => toast.error("Couldn't update the product."));
  };

  const handleDeleteProduct = (product) => {
    productsApi
      .deleteProduct(product.id)
      .then(() => {
        refreshCurrentProductPage();
        toast.success("Product deleted.");
        navigate("/");
      })
      .catch(() => toast.error("Couldn't delete the product."));
  };

  // ---------- notifications ----------
  const handleClearNotifications = () => {
    notificationsApi
      .deleteMyNotifications()
      .then(() => {
        setNotifications([]);
        toast.success("All notifications cleared.");
      })
      .catch(() => toast.error("Couldn't clear notifications."));
  };

  return (
    <div className={`min-h-screen ${t.bg} font-sans ${t.text} transition-colors`}>
      <ConditionalNav
        user={user}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        notificationCount={unreadNotifications}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin((a) => !a)}
      />

      <Routes>
        <Route path="/signup" element={<SignupForm onSubmit={handleSignup} error={authError} />} />
        <Route
          path="/verify-otp"
          element={<OtpForm userName={pendingUserName} onSubmit={handleVerifyOtp} onResend={() => {}} error={authError} />}
        />
        <Route path="/login" element={<LoginForm onSubmit={handleLogin} error={authError} />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm onSubmit={handleForgotPassword} error={authError} />} />

        <Route
          path="/"
          element={
            <ProductGrid
              page={productsPage}
              categories={categories}
              categoriesHasMore={categoriesHasMore}
              onLoadMoreCategories={handleLoadMoreCategories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              onPriceFilter={handlePriceFilter}
              onResetPriceFilter={handleResetPriceFilter}
              onAddToCart={addToCart}
              onDirectOrder ={ordersApi.directOrder}
              onPageChange={handlePageChange}
              isAdmin={isAdmin}
              onEditProduct={(p) => navigate(`/admin/products/${p.id}/edit`)}
              onDeleteProduct={handleDeleteProduct}
            />
          }
        />
       <Route
  path="/products/:id"
  element={
    <ProductDetailRoute
      onAddToCart={(p, q) => {
        addToCart(p, q);
        navigate("/cart");
      }}
      onDirectOrder={directOrder}
    />
  }
/>
        <Route path="/admin/products/new" element={<ProductForm onSubmit={handleCreateProduct} />} />
        <Route path="/admin/products/:id/edit" element={<EditProductRoute onSubmit={handleUpdateProduct} onDelete={handleDeleteProduct} />} />

        <Route
          path="/cart"
          element={
            <CartPage
              items={cartItems}
              onQtyChange={updateCartQuantity}
              onRemove={removeFromCart}
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
        <Route path="/orders/:id" element={<OrderDetailRoute onUpdateStatus={isAdmin ? handleUpdateOrderStatus : undefined} />} />

        <Route path="/wallet" element={<WalletPage wallet={wallet} payments={payments} onTopUp={handleTopUp} />} />
        <Route
          path="/notifications"
          element={<NotificationList notifications={notifications} onClearAll={handleClearNotifications} />}
        />
      </Routes>
    </div>
  );
}

function ConditionalNav(props) {
  const location = useLocation();
  if (AUTH_PATHS.includes(location.pathname)) return null;
  return <TopNav {...props} />;
}

function ProductDetailRoute({ onAddToCart,onDirectOrder}) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    productsApi
      .getProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <Navigate to="/" replace />;
  if (!product) return null;
  return <ProductDetail product={product} backTo="/" onAddToCart={onAddToCart} onDirectOrder={onDirectOrder} />;
}

function EditProductRoute({ onSubmit, onDelete }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    productsApi.getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return null;
  return <ProductForm product={product} onSubmit={onSubmit} onDelete={onDelete} />;
}

function OrderDetailRoute({ onUpdateStatus }) {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    ordersApi.getOrderDetail(id).then(setDetail).catch(() => setDetail(null));
  }, [id]);

  if (!detail) return null;
  return <OrderDetailScreen orderId={id} detail={detail} backTo="/orders" onUpdateStatus={onUpdateStatus} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </ThemeProvider>
  );
}
