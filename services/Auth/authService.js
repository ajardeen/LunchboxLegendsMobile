import API from "../../configs/Axios";

/**
 * Register
 * Creates account + sends OTP email
 */
export const authRegister = async (payload) => {
  const { data } = await API.post("/customers/register", payload);

  return data.data;
};

/**
 * Login
 * Validates password + sends OTP email
 */
export const authLogin = async (payload) => {
  const { data } = await API.post("/customers/login", payload);

  return data.data;
};

/**
 * Verify OTP
 * Returns token + customer
 */
export const authVerifyOtp = async (payload) => {
  const { data } = await API.post("/customers/verify-otp", payload);

  return data.data;
};

/**
 * Resend OTP
 */
export const authResendOtp = async (payload) => {
  const { data } = await API.post("/customers/resend-otp", payload);

  return data.data;
};

/**
 * Forgot Password
 */
export const authForgetPassword = async (payload) => {
  const { data } = await API.post("/customers/forgot-password", payload);

  return data.data;
};
