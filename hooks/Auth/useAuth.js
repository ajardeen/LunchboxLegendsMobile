import { useMutation } from "@tanstack/react-query";
import {
  authRegister,
  authLogin,
  authForgetPassword,
} from "../../services/Auth/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Register
 */
export const useAuthRegister = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => authRegister(payload),
    ...options,
  });
};

/**
 * Login (auto save token)
 */
export const useAuthLogin = (options = {}) => {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await authLogin(payload);

      // Save token only if present
      if (res?.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);
      }

      return res;
    },
    ...options,
  });
};

/**
 * Forgot Password
 */
export const useAuthForgotPassword = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => authForgetPassword(payload),
    ...options,
  });
};
