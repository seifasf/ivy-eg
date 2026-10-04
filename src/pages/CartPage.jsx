import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiX, HiHome, HiShoppingCart } from 'react-icons/hi'
import './CartPage.css'

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const handleQuantityChange = (lineId, change) => {
    const item = cartItems.find(item => item.lineId === lineId)
    if (item) {
      const newQuantity = item.quantity + change
      if (newQuantity > 0) {
        updateQuantity(lineId, newQuantity)
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
              <div key={item.lineId} className="cart-page-item">
                <Link to={`/products/${item.id}`} className="cart-page-item-icon">
                  <img
                    src={item.image || '/IMGs/IVY-03.png'}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.src.endsWith('/IMGs/IVY-03.png')) e.currentTarget.src = '/IMGs/IVY-03.png'
                    }}
                  />
                </Link>

                <div className="cart-page-item-details">
                  <Link to={`/products/${item.id}`} className="cart-page-item-name">{item.name}</Link>
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="cart-page-item-size">
                      {[item.selectedColor, item.selectedSize && `Size ${item.selectedSize}`].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="cart-page-item-price">
                    {typeof item.price === 'number' 
                      ? `${item.price.toLocaleString()} EGP` 
                      : item.price}
                  </p>
                </div>

                <div className="cart-page-item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.lineId, -1)}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.lineId, 1)}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.lineId)}
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

