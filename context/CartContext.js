// /context/CartContext.js
import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // --- ACTIONS ---

  // 1. Add or Increment Item
  const addToCart = (bundle) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === bundle.id);

      if (existingItemIndex > -1) {
        // Item already in cart, increase quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        // New item, add to cart
        return [
          ...prevItems,
          {
            id: bundle.id,
            name: bundle.name,
            price: bundle.price,
            quantity: 1, // Start with quantity 1
          },
        ];
      }
    });
  };

  // 2. Increment/Decrement Quantity
  const updateQuantity = (id, type) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id !== id) return item;
          
          let newQuantity = item.quantity;
          if (type === "inc") {
            newQuantity = item.quantity + 1;
          } else if (type === "dec") {
            // Ensure quantity doesn't go below 1
            newQuantity = Math.max(1, item.quantity - 1);
          }
          
          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0); // Cleanup in case we allow quantity 0 in the future
    });
  };

  // 3. Remove Item
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 4. empty cart after pay 
  const emptyCart = () => {
    setCartItems([]);
    console.log("Cart cleared");
    
  };



  // --- CALCULATIONS ---

  const cartTotals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, subtotal };
  }, [cartItems]);

  // The value exposed to consumers
  const contextValue = {
    cartItems,
    addToCart,
    updateQuantity, 
    removeItem,     
    emptyCart,      
    ...cartTotals,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};