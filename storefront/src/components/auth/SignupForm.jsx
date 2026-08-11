import { useState } from "react";
import { User, Mail, Lock, Phone, MapPin, ArrowRight } from "lucide-react";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

/**
 * `form` matches UserService's UserDto.SignupRequest exactly:
 * { userName, email, password, phone, address }
 * POST /api/v1/user/auth/signup -> SignupResponse { user, otp }
 */
export default function SignupForm({ onSubmit }) {
  const [form, setForm] = useState({ userName: "", email: "", password: "", phone: "", address: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell
      eyebrow="Step 1 / 2"
      title="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-cyan-400 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Input label="Username" icon={User} value={form.userName} onChange={set("userName")} placeholder="jhanishant" />
      <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
      <Input label="Password" icon={Lock} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
      <Input label="Phone" icon={Phone} value={form.phone} onChange={set("phone")} placeholder="+91 9xxxxxxxxx" />
      <Input label="Address" icon={MapPin} value={form.address} onChange={set("address")} placeholder="Street, City" />
      <Button className="w-full" onClick={() => onSubmit(form)}>
        Create account <ArrowRight className="h-4 w-4" />
      </Button>
    </AuthShell>
  );
}
