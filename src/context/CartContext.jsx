import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
const STORAGE_KEY = 'ivyCart'

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// One cart line per product + size + color, so "Tee / M" and "Tee / L" stay separate
export const cartLineId = (id, size = '', color = '') => `${id}::${size || ''}::${color || ''}`

const toNumber = (price) => {
  if (typeof price === 'number') return price
  if (typeof price === 'string') return parseFloat(price.replace(/[,\sEGP]/g, '')) || 0
  return 0
}

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(saved)) return []
    return saved.map(item => ({
      ...item,
      lineId: item.lineId || cartLineId(item.id, item.selectedSize, item.selectedColor)
    }))
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // product: { id, name, price, image, selectedSize?, selectedColor? }
  const addToCart = (product, quantity = 1) => {
    const lineId = cartLineId(product.id, product.selectedSize, product.selectedColor)
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.lineId === lineId)
      if (existing) {
        return prevItems.map(item =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevItems, { ...product, lineId, quantity }]
    })
  }

  const removeFromCart = (lineId) => {
    setCartItems(prevItems => prevItems.filter(item => item.lineId !== lineId))
  }

  const updateQuantity = (lineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(lineId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item => (item.lineId === lineId ? { ...item, quantity: newQuantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + toNumber(item.price) * item.quantity, 0)

  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0)

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
