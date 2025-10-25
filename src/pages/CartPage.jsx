import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiX, HiHome, HiShoppingCart } from 'react-icons/hi'
import './CartPage.css'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const handleQuantityChange = (id, change) => {
    const item = cartItems.find(item => item.id === id)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity)
      }
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-container">
          <div className="cart-page-header">
            <h1 className="cart-page-title">Shopping Cart</h1>
          </div>

          <div className="empty-cart-page">
            <div className="empty-cart-icon">
              <HiShoppingCart size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Start shopping and add some amazing products!</p>
            <button className="btn-return-home" onClick={() => navigate('/')}>
              <HiHome size={20} />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <div className="cart-page-header">
          <h1 className="cart-page-title">Shopping Cart</h1>
          <span className="cart-page-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-page-content">
          <div className="cart-page-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-page-item">
                <div className="cart-page-item-icon">
                  {React.createElement(item.icon, { size: 32 })}
                </div>
                
                <div className="cart-page-item-details">
                  <h4 className="cart-page-item-name">{item.name}</h4>
                  {item.selectedSize && (
                    <p className="cart-page-item-size">Size: {item.selectedSize}</p>
                  )}
                  <p className="cart-page-item-price">{item.price}</p>
                </div>

                <div className="cart-page-item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="cart-page-item-remove"
                  aria-label="Remove item"
                >
                  <HiX size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-page-summary">
            <h3 className="cart-summary-title">Order Summary</h3>
            
            <div className="cart-summary-details">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{getCartTotal().toLocaleString()} EGP</span>
              </div>
              <div className="cart-summary-row">
                <span className="text-secondary">Delivery</span>
                <span className="text-secondary">Calculated at checkout</span>
              </div>
            </div>

            <div className="cart-summary-divider"></div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span className="total-amount">{getCartTotal().toLocaleString()} EGP</span>
            </div>

            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>

            <button className="btn-continue-shopping" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>

            {cartItems.length > 0 && (
              <button className="btn-clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

