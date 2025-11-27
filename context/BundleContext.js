// context/BundleContext.js
import { createContext, useContext, useMemo } from "react";
import { useBundles } from "../hooks/Home/useBundles";

const BundleContext = createContext();

export const BundleProvider = ({ children }) => {
  const { data, isLoading, isError, refetch } = useBundles(); // 🔥 fetch once
  console.log("data",data);
  

  // Helper: find bundle by ID
  const getBundleById = (bundleId) => {
    return data?.find((bundle) => bundle.id === bundleId) || null;
  };

  // Helper: find day menu by bundleId + dayName
  const getDayMenu = (bundleId, dayName) => {
    const bundle = getBundleById(bundleId);
    return bundle?.days?.find((d) => d.day === dayName) || null;
  };

  // Helper: find item by bundleId + dayName + itemName
  const getMenuItem = (bundleId, dayName, itemName) => {
    const dayData = getDayMenu(bundleId, dayName);
    return dayData?.items?.find((i) => i.itemName === itemName) || null;
  };

  const value = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      refetch,
      getBundleById,
      getDayMenu,
      getMenuItem,
    }),
    [data, isLoading, isError]
  );

  return (
    <BundleContext.Provider value={value}>
      {children}
    </BundleContext.Provider>
  );
};

// Hook for easy usage
export const useBundleData = () => useContext(BundleContext);
