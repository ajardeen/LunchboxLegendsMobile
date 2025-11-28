// src/services/Master/authService.js
import API from "../../configs/Axios";

export const authRegister = async (payload) => {
  const { data } = await API.post("/customers/register",payload);
  return data.data;
};
export const authLogin = async (payload) => {
  const { data } = await API.post("/customers/login", payload);
  return data;
};
export const authForgetPassword = async (payload) => {
  const { data } = await API.post("/customers/forgot-password", payload);
  return data;
};

