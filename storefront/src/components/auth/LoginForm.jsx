import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useTheme } from "../../theme/ThemeContext";

/**
 * `form` matches UserDto.LoginRequest { email, password }.
 * POST /api/v1/user/auth/login -> AuthResponse { token, user }
 */
export default function LoginForm({ onSubmit }) {
  const { t } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
      <Button className="w-full" onClick={() => onSubmit(form)}>
        Sign in <ArrowRight className="h-4 w-4" />
      </Button>
    </AuthShell>
  );
}
