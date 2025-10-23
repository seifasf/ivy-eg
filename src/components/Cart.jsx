import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiShoppingBag, HiX, HiTrash, HiMinus, HiPlus } from 'react-icons/hi'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart()

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  if (!isCartOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="cart-sidebar">
        <div className="cart-header">
          <div className="cart-header-content">
            <HiShoppingBag size={24} />
            <h2>Shopping Cart</h2>
          </div>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>
            <HiX size={24} />
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon-wrapper">
                <HiShoppingBag size={60} />
              </div>
              <p className="empty-text">Your cart is empty</p>
              <button className="btn-continue-shopping" onClick={() => {
                setIsCartOpen(false)
                navigate('/products')
              }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-icon">
                        {ItemIcon ? <ItemIcon size={32} /> : <HiShoppingBag size={32} />}
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">{item.price}</p>
                        <div className="cart-item-quantity">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <HiMinus size={14} />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <HiPlus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${getCartTotal().toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <button className="clear-cart-btn" onClick={clearCart}>
                  <HiTrash size={18} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart

