import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiCheckCircle, HiShoppingCart } from 'react-icons/hi'
import './AddToCartNotification.css'

function AddToCartNotification({ show, onClose, productName }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const handleViewCart = () => {
    onClose()
    navigate('/cart')
  }

  return (
    <div className="cart-notification-overlay">
      <div className="cart-notification">
        <div className="notification-icon">
          <HiCheckCircle size={32} />
        </div>
        
        <div className="notification-content">
          <h3 className="notification-title">Added to Cart!</h3>
          <p className="notification-product">{productName}</p>
        </div>

        <div className="notification-actions">
          <button className="btn-view-cart" onClick={handleViewCart}>
            <HiShoppingCart size={18} />
            <span>View Cart</span>
          </button>
          <button className="btn-checkout" onClick={handleCheckout}>
            <span>Checkout</span>
          </button>
        </div>

        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  )
}

export default AddToCartNotification

