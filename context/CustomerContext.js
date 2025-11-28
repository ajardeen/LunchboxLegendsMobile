import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const stored = await AsyncStorage.getItem("customer");
        if (stored) setCustomer(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, loading }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
