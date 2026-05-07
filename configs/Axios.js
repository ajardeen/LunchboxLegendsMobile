import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.61.218.219:3000/api",
});

API.interceptors.request.use(async (config) => {
  try {
    config.headers["Content-Type"] = "application/json";
    config.headers["X-Organization-Id"] =
      process.env.EXPO_PUBLIC_ORGANIZATION_ID;
    config.headers["X-Branch-Id"] = process.env.EXPO_PUBLIC_BRANCH_ID;

    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.log("Token read error →", err);
  }
  return config;
});

export default API;
