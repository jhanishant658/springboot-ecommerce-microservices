import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useTheme } from "../../theme/ThemeContext";
import { loginApi } from "../../api/UserApis";

/**
 * `form` matches UserDto.LoginRequest { email, password }.
 * POST /api/v1/user/auth/login -> AuthResponse { token, user }
 */
export default function LoginForm() {
  const { t } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
 const handleLogin = async () => {
  try {
    const response = await loginApi(form);

    console.log("Login successful:", response);

    localStorage.setItem("token", response.token);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-bold text-cyan-400 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
      <Input label="Password" icon={Lock} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
      <div className="flex justify-end">
        <Link to="/forgot-password" className={`text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-cyan-400`}>
          Forgot password?
        </Link>
      </div>
      <Button className="w-full" onClick={handleLogin}>
        Sign in <ArrowRight className="h-4 w-4" />
      </Button>
    </AuthShell>
  );
}
