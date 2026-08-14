/**
 * Minimal JWT payload decoder — no external dependency needed.
 * Your backend's JwtTokenProvider puts { userId, email, userName } in
 * the claims, so this is how the frontend recovers "who is logged in"
 * from login's response, which is now just { token } (no user object).
 */
export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
