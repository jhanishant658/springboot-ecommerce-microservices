import client from "./client";

/** POST /api/v1/user/auth/signup -> boolean */
export const signup = (payload) =>
  client.post("/api/v1/user/auth/signup", payload).then((r) => r.data);

/** POST /api/v1/user/auth/login -> { token } */
export const login = (payload) =>
  client.post("/api/v1/user/auth/login", payload).then((r) => r.data);

/**
 * GET /api/v1/user/verifyUser with a JSON body { userName, otp }.
 * Plain fetch() can't send a body on GET requests — axios can, via
 * the `data` option on a raw request config.
 */
export const verifyOtp = (userName, otp) =>
  client
    .request({ method: "get", url: "/api/v1/user/verifyUser", data: { userName, otp: Number(otp) } })
    .then((r) => r.data);

/** POST /api/v1/user/auth/forgetPassword -> string message */
export const forgetPassword = (payload) =>
  client.post("/api/v1/user/auth/forgetPassword", payload).then((r) => r.data);

/** GET /api/v1/user/users/{userName} -> UserResponse */
export const getProfile = (userName) =>
  client.get(`/api/v1/user/users/${userName}`).then((r) => r.data);

/** PUT /api/v1/user/users/{userName} -> UserResponse */
export const updateProfile = (userName, payload) =>
  client.put(`/api/v1/user/users/${userName}`, payload).then((r) => r.data);
