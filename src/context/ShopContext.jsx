import React, { createContext, useContext, useState } from 'react'

const ShopContext = createContext({});

export function ShopProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState([])

  const toggleFavorite = (product) => {
    setFavorites(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    )
  }

  const isFavorite = (id) => favorites.some(p => p.id === id)

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id))

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <ShopContext.Provider value={{ favorites, cart, cartTotal, toggleFavorite, isFavorite, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}