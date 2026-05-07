import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  use,
} from "react";
import { useCustomer } from "./CustomerContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { customer, isLoading } = useCustomer();
  // console.log("customer", customer);


  const [cartItems, setCartItems] = useState([]);

  // useEffect(() => {
  //   console.log("cartItems", cartItems);
  // }, [cartItems]);

  // Use refs to store functions so they don't trigger re-renders
  const listenersRef = useRef(new Set());

  // --- STABLE ACTIONS (wrapped in useCallback with no dependencies) ---

  // 1. Add or Increment Item
  const addToCart = useCallback((bundle) => {
      if (!customer) return; // prevents error when null during initial load
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === bundle.id
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            customerId: customer._id,
            id: bundle.id,
            name: bundle.name,
            orderType: bundle.bundleType,
            price: bundle.price,
            quantity: 1,
          },
        ];
      }
    });
  }, [customer]); // Empty dependency array - function never changes

  // 2. Increment/Decrement Quantity - OPTIMIZED
  const updateQuantity = useCallback((id, type) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id !== id) return item;

        let newQuantity = item.quantity;
        if (type === "inc") {
          newQuantity = item.quantity + 1;
        } else if (type === "dec") {
          newQuantity = Math.max(1, item.quantity - 1);
        }

        // Only create new object if quantity actually changed
        if (newQuantity === item.quantity) return item;

        return { ...item, quantity: newQuantity };
      });
    });
  }, []); // Empty dependency array - function never changes

  // 3. Remove Item
  const removeItem = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []); // Empty dependency array

  // 4. Empty cart after pay
  const emptyCart = useCallback(() => {
    setCartItems([]);
    // console.log("Cart cleared");
  }, []); 

  // --- CALCULATIONS (memoized based on cartItems) ---
  const cartTotals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalItems, subtotal };
  }, [cartItems]);

  // --- STABLE CONTEXT VALUE ---
  // Split into two values: one that changes, one that doesn't
  const stableActions = useMemo(
    () => ({
      addToCart,
      updateQuantity,
      removeItem,
      emptyCart,
    }),
    [addToCart, updateQuantity, removeItem, emptyCart]
  );

  const contextValue = useMemo(
    () => ({
      cartItems,
      ...cartTotals,
      ...stableActions,
    }),
    [cartItems, cartTotals, stableActions]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// --- OPTIMIZED SELECTOR HOOK ---
// Use this to subscribe to only specific parts of the cart
export const useCartSelector = (selector) => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartSelector must be used within a CartProvider");
  }
  return useMemo(() => selector(context), [context, selector]);
};
