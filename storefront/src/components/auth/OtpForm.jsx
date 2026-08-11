import { useState } from "react";
import { useTheme } from "../../theme/ThemeContext";
import AuthShell from "./AuthShell";
import Input from "../ui/Input";
import Button from "../ui/Button";

/**
 * Backend verification is a plain GET, not a POST-with-body:
 *   GET /api/v1/user/verifyUser/{userName}/{otp}
 * `onSubmit(otp)` should build that URL with `userName` + this OTP.
 */
export default function OtpForm({ userName, onSubmit, onResend }) {
  const { t } = useTheme();
  const [otp, setOtp] = useState("");

  return (
    <AuthShell eyebrow="Step 2 / 2" title="Verify email">
      <p className={`text-sm ${t.muted}`}>
        We sent a one-time code for{" "}
        <span className={`font-mono ${t.text}`}>{userName || "your account"}</span>.
      </p>
      <Input
        label="One-time code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="0000"
        maxLength={6}
        className="text-center font-mono text-2xl tracking-[0.5em]"
      />
      <Button className="w-full" onClick={() => onSubmit(otp)} disabled={otp.length < 4}>
        Verify & continue
      </Button>
      <button onClick={onResend} className={`w-full text-center text-xs font-bold uppercase tracking-wide ${t.faint} hover:text-cyan-400`}>
        Resend code
      </button>
    </AuthShell>
  );
}
