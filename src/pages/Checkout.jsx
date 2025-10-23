import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { sendOrderConfirmation } from '../services/emailService'
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiHome, HiCheckCircle } from 'react-icons/hi'
import './Checkout.css'

const egyptGovernorates = [
  'Cairo',
  'Alexandria',
  'Giza',
  'Qalyubia',
  'Port Said',
  'Suez',
  'Dakahlia',
  'Damietta',
  'Sharqia',
  'Gharbia',
  'Monufia',
  'Beheira',
  'Ismailia',
  'Faiyum',
  'Beni Suef',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Aswan',
  'Luxor',
  'Red Sea',
  'New Valley',
  'Matruh',
  'North Sinai',
  'South Sinai'
].sort()

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    governorate: '',
    city: '',
    address: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [emailStatus, setEmailStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Egyptian phone number (e.g., 01012345678)'
    }

    if (!formData.governorate) {
      newErrors.governorate = 'Please select a governorate'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      
      // Prepare order data
      const orderData = {
        customer: formData,
        items: cartItems,
        total: getCartTotal()
      }

      // Log order for debugging
      console.log('Order submitted:', orderData)

      // Send confirmation email
      const emailResult = await sendOrderConfirmation(orderData)
      
      if (emailResult.success) {
        setEmailStatus('success')
        console.log('Confirmation email sent successfully!')
      } else {
        setEmailStatus('failed')
        console.log('Email failed to send, but order was placed')
      }

      setOrderPlaced(true)
      clearCart()
      setIsSubmitting(false)

      // Redirect to home after 5 seconds
      setTimeout(() => {
        navigate('/')
      }, 5000)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart-message">
            <div className="empty-icon">
              <HiHome size={60} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some products before proceeding to checkout</p>
            <button className="btn-back-home" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="success-message">
            <div className="success-icon">
              <HiCheckCircle size={80} />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order. Your order will reach you as fast as possible!</p>
            
            {emailStatus === 'success' && (
              <div className="email-confirmation-notice">
                <p>✉️ A confirmation email has been sent to <strong>{formData.email}</strong></p>
                <p className="email-notice-subtitle">Please check your inbox for order details.</p>
              </div>
            )}
            
            {emailStatus === 'failed' && (
              <div className="email-warning-notice">
                <p>⚠️ Order placed but email notification failed to send.</p>
                <p className="email-notice-subtitle">We'll contact you via phone at {formData.phone}</p>
              </div>
            )}
            
            <div className="success-details">
              <p><strong>Order Total:</strong> ${getCartTotal().toFixed(2)}</p>
              <p><strong>Delivery to:</strong> {formData.governorate}, {formData.city}</p>
              <p><strong>Contact:</strong> {formData.phone}</p>
            </div>
            
            <div className="delivery-message">
              <h3>What happens next?</h3>
              <ul>
                <li>We'll process your order immediately</li>
                <li>Our team will contact you to confirm delivery details</li>
                <li>Your order will be shipped as fast as possible</li>
                <li>Track your order status via email or phone</li>
              </ul>
            </div>
            
            <p className="redirect-message">Redirecting to home in a few seconds...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your order</p>
        </div>

        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="form-section-title">Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <HiUser size={18} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <HiMail size={18} />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    <HiPhone size={18} />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="01012345678"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Delivery Address</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="governorate" className="form-label">
                    <HiLocationMarker size={18} />
                    <span>Governorate</span>
                  </label>
                  <select
                    id="governorate"
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    className={`form-input ${errors.governorate ? 'error' : ''}`}
                  >
                    <option value="">Select Governorate</option>
                    {egyptGovernorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                  {errors.governorate && <span className="error-message">{errors.governorate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="city" className="form-label">
                    <HiHome size={18} />
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  <HiLocationMarker size={18} />
                  <span>Street Address</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Building number, street name, etc."
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  <span>Additional Notes (Optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Any special instructions for delivery..."
                  rows="3"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-place-order"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing Order...' : `Place Order - $${getCartTotal().toFixed(2)}`}
            </button>
          </form>

          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-note">
              <p>Delivery fees will be calculated based on your location</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

