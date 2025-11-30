import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCustomer } from "./CustomerContext";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCustomer } = useCustomer();

  // Load session on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedCustomer = await AsyncStorage.getItem("customer");

        if (token) {
          setUserToken(token);
          if (storedCustomer) {
            setCustomer(JSON.parse(storedCustomer)); // 🔥 restore customer state
          }
          router.replace("/(tabs)/(home)");
        }
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  /** LOGIN */
  const login = async (token, customer) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("customer", JSON.stringify(customer));
    setUserToken(token);
    setCustomer(customer);
    router.replace("/(tabs)/(home)");
  };

  /** LOGOUT */
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("customer");
    setUserToken(null);
    setCustomer(null);
    router.replace("/(auth)/Welcome2Screen");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
