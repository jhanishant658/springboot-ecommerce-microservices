
// signup api will be here 
import axios from "axios";
import { BASE_URL, ENDPOINTS } from "./endpoints.js";
async function signupApi(data) {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.signup.path}`, data);
    return response.data;
}
async function loginApi(data) {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.login.path}`, data);
    return response.data;
}
async function verifyUserApi(userName, otp) {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.verifyOtp.path}`, {
        userName,
        otp
    });
    return response.data;
}
async function forgetPasswordApi(data) {
    const response = await axios.post(`${BASE_URL}${ENDPOINTS.forgetPassword.path}`, data);
    return response.data;
}

async function getProfileApi(userName) {
    const response = await axios.get(`${BASE_URL}${ENDPOINTS.getProfile.path.replace(':userName', userName)}`);
    return response.data;
}

export { signupApi, loginApi, verifyUserApi, forgetPasswordApi, getProfileApi };
