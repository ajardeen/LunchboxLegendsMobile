import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.138.6.162:3000/api",
});

API.interceptors.request.use(async (config) => {
  try {
    config.headers["Content-Type"] = "application/json";
    config.headers["X-Organization-Id"] = "691c7d9d841d0f2ce1cd658d";
    config.headers["X-Branch-Id"] = "691c7d9e841d0f2ce1cd658f";

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
