import api, { saveAuthToken } from "./http.js";
import { ENDPOINTS } from "./endpoints.js";

async function signupApi(data) {
  const response = await api.post(ENDPOINTS.signup.path, data);
  return response.data;
}

async function loginApi(data) {
  const response = await api.post(ENDPOINTS.login.path, data);
  const token = response.data?.token || response.data?.jwt || response.data?.accessToken;
  if (token) {
    saveAuthToken(token);
  }
  return response.data;
}

async function verifyUserApi(userName, otp) {
  const response = await api.request({
    method: "GET",
    url: ENDPOINTS.verifyOtp.path,
    data: { userName, otp },
  });
  return response.data;
}

async function forgetPasswordApi(data) {
  const response = await api.post(ENDPOINTS.forgetPassword.path, data);
  return response.data;
}

async function getProfileApi(userName) {
  const response = await api.get(ENDPOINTS.getProfile.path.replace(":userName", encodeURIComponent(userName)));
  return response.data;
}

export { signupApi, loginApi, verifyUserApi, forgetPasswordApi, getProfileApi };