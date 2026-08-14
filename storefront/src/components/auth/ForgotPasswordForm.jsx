import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";

/**
 * Backend's forgetPassword endpoint reuses LoginRequest { email, password }:
 * POST /api/v1/user/auth/forgetPassword -> string message (an OTP is
 * issued server-side, so route the user to OtpForm after this submits).
 */
export default function ForgotPasswordForm({ onSubmit, error }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset password"
      error={error}
      footer={
        <Link to="/login" className="font-bold text-cyan-400 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
      <Input label="New password" icon={Lock} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
      <Button className="w-full" onClick={() => onSubmit(form)}>
        Send verification code
      </Button>
    </AuthShell>
  );
}
