import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  authRegister,
  authLogin,
  authVerifyOtp,
  authResendOtp,
} from "../../services/Auth/authService";

/**
 * Register -> Send OTP
 */
export const useAuthRegister = (options = {}) => {
  return useMutation({
    mutationFn: authRegister,
    ...options,
  });
};

/**
 * Login -> Send OTP
 */
export const useAuthLogin = (options = {}) => {
  return useMutation({
    mutationFn: authLogin,
    ...options,
  });
};

/**
 * Verify OTP
 */
export const useAuthVerifyOtp = (options = {}) => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await authVerifyOtp(payload);

      // save token
      if (res?.token) {
        await AsyncStorage.setItem("token", res.token);
      }

      return res;
    },
    ...options,
  });
};

/**
 * Resend OTP
 */
export const useAuthResendOtp = (options = {}) => {
  return useMutation({
    mutationFn: authResendOtp,
    ...options,
  });
};