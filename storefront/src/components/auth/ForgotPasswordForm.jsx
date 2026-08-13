import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link , useNavigate} from "react-router-dom";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {forgetPasswordApi} from "../../api/UserApis";

/**
 * Backend's forgetPassword endpoint reuses LoginRequest { email, password }:
 * POST /api/v1/user/auth/forgetPassword -> SignupResponse { user, otp }
 * (an OTP is issued, so route the user to OtpForm after this submits)
 */
export default function ForgotPasswordForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
   const navigate = useNavigate();
  const handleForgotPassword = async () => {
    try {
      const response = await forgetPasswordApi(form);
      console.log("Forgot password request successful:", response);
     
      navigate("/verify-otp", {
        state: {
          userName: response.userName // Pass the userName to the OtpForm
        },
      });
      // Handle success (e.g., show a success message or redirect to OTP verification)
    } catch (error) {
      console.error("Forgot password request failed:", error);
      // Handle error (e.g., show an error message)
    }
  }
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset password"
      footer={
        <Link to="/login" className="font-bold text-cyan-400 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Input label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
      <Input label="New password" icon={Lock} type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
      <Button className="w-full" onClick={handleForgotPassword}>
        Send verification code
      </Button>
    </AuthShell>
  );
}
