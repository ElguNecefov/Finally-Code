import React, { createContext, useContext, useState } from 'react';

export const ShopContext = createContext({});

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Səbət funksiyaları
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev; // Əgər artıq səbətdə varsa, təkrar əlavə etməsin
      return [...prev, product];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.id !== productId));
  };

  // Favorit (Bəyənmə) funksiyaları
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        // Əgər artıq bəyənilibsə, siyahıdan çıxarırıq
        return prev.filter(item => item.id !== product.id);
      } else {
        // Bəyənilməyibsə, siyahıya əlavə edirik
        return [...prev, product];
      }
    });
  };

  // ProductCard-ın axtardığı və səni yarımçıq qoyan həmin o funksiya:
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <ShopContext.Provider value={{ 
      cart, 
      favorites, 
      addToCart, 
      removeFromCart, 
      toggleFavorite, 
      isFavorite // ProductCard artıq bu funksiyanı problemsiz tapacaq!
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}