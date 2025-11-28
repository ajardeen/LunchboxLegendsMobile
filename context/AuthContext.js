import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login session on app open
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        setUserToken(token);
        router.replace("/(tabs)/(home)"); // already logged in → go home
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  /** LOGIN */
  const login = async (token, customer) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("customer", JSON.stringify(customer));
    setUserToken(token);
    router.replace("/(tabs)/(home)");
  };

  /** LOGOUT */
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("customer");
    setUserToken(null);
    router.replace("/(auth)/Welcome2Screen"); // go to login/signup
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
