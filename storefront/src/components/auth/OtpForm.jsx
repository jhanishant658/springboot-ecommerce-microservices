import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { verifyUserApi } from "../../api/UserApis";

export default function OtpForm() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { state } = useLocation();
  const userName = state?.userName || "";
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleOtp = async () => {
    const response = await verifyUserApi(userName, otp);
    setMessage(response);
    if (response === "User verified successfully") navigate("/login");
  };

  return (
    <AuthShell eyebrow="Step 2 / 2" title="Verify email">
      <p className={`text-sm ${t.muted}`}>
        We sent a one-time code for <span className={`font-mono ${t.text}`}>{userName || "your account"}</span>.
      </p>
      <Input
        label="One-time code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="0000"
        maxLength={6}
        className="text-center font-mono text-2xl tracking-[0.5em]"
      />
      {message && <p className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>{message}</p>}
      <Button className="w-full" onClick={handleOtp} disabled={!userName || otp.length < 4}>
        Verify & continue
      </Button>
    </AuthShell>
  );
}