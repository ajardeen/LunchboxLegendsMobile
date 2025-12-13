import React, { createContext, useContext, useEffect, useState } from "react";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  useEffect(() => {
    if (customer) {
      setCustomerId(customer._id);
    }
  }, [customer]);

  return (
    <CustomerContext.Provider value={{customerId, customer, setCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => useContext(CustomerContext);
