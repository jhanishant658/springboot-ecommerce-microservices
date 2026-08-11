import { ShoppingCart, Search, LogOut, Bell, Wallet as WalletIcon } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";

/**
 * user            -> UserService UserResponse ({ userName, email, phone, address }) or null
 * cartCount       -> sum of quantities from CartService getCart response
 * notificationCount -> unread count you derive from NotificationService list
 */
export default function TopNav({ user, cartCount = 0, notificationCount = 0, onLogout }) {
  const { t } = useTheme();
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 border-b ${t.border} ${t.navBg} backdrop-blur`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className={`text-xl font-black uppercase tracking-tighter ${t.text}`}>
          Store<span className="text-orange-500">/</span>front
        </Link>

        <div className="hidden flex-1 items-center gap-2 px-8 sm:flex">
          <div className="relative w-full max-w-md">
            <Search className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${t.faint}`} />
            <input
              placeholder="Search products..."
              className={`w-full border ${t.border} ${t.inputBg} ${t.text} py-2 pl-10 pr-3 text-sm outline-none focus:border-cyan-400`}
            />
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/orders"
                className={`hidden px-3 py-2 text-xs font-bold uppercase tracking-wide ${t.muted} hover:text-orange-500 sm:block`}
              >
                Orders
              </Link>
              <Link to="/wallet" className={`relative p-2 ${t.muted} hover:text-orange-500`} title="Wallet">
                <WalletIcon className="h-5 w-5" />
              </Link>
              <Link to="/notifications" className={`relative p-2 ${t.muted} hover:text-orange-500`} title="Notifications">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 font-mono text-[10px] font-bold text-zinc-950">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className={`relative p-2 ${t.muted} hover:text-orange-500`} title="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 font-mono text-[10px] font-bold text-zinc-950">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={onLogout} className={`p-2 ${t.faint} hover:text-rose-400`} title="Log out">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => navigate("/login")} className="!px-4 !py-2 text-xs">
              Sign in
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
