import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { sendOrderConfirmation } from '../services/emailService'
import { publicCheckoutAPI, promoCodesAPI, governorateShippingAPI } from '../services/api'
import { HiUser, HiMail, HiPhone, HiLocationMarker, HiHome, HiCheckCircle } from 'react-icons/hi'
import './Checkout.css'

// Match exact names from backend
const egyptGovernorates = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Qalyubia',
  'Sharqia',
  'Dakahlia',
  'Beheira',
  'Gharbia',
  'Monufia',
  'Kafr El Sheikh',
  'Damietta',
  'Port Said',
  'Ismailia',
  'Suez',
  'North Sinai',
  'South Sinai',
  'Minya',
  'Asyut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Red Sea',
  'New Valley',
  'Matrouh',
  'Fayoum',
  'Beni Suef'
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
    notes: '',
    promoCode: '',
    paymentMethod: 'cod'
  })
  const [errors, setErrors] = useState({})
  const [emailStatus, setEmailStatus] = useState(null)
  const [shippingFee, setShippingFee] = useState(0)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [validatedPromoCode, setValidatedPromoCode] = useState(null)
  const [loadingShipping, setLoadingShipping] = useState(false)

  // Fetch shipping fee when governorate changes
  useEffect(() => {
    const fetchShippingFee = async () => {
      if (formData.governorate) {
        try {
          setLoadingShipping(true)
          const data = await governorateShippingAPI.getByGovernorate(formData.governorate)
          
          if (data && data.shippingFee !== undefined && data.shippingFee !== null) {
            setShippingFee(Number(data.shippingFee))
          } else {
            // Try fallback: get all and find match
            try {
              const allFees = await governorateShippingAPI.getAll()
              const matchingFee = allFees.find(f => 
                f.governorate && f.governorate.toLowerCase() === formData.governorate.toLowerCase()
              )
              if (matchingFee && matchingFee.shippingFee !== undefined) {
                setShippingFee(Number(matchingFee.shippingFee))
              } else {
                setShippingFee(0)
              }
            } catch (fallbackError) {
              setShippingFee(0)
            }
          }
        } catch (error) {
          // Try fallback: get all fees
          try {
            const allFees = await governorateShippingAPI.getAll()
            const matchingFee = allFees.find(f => 
              f.governorate && f.governorate.toLowerCase() === formData.governorate.toLowerCase()
            )
            if (matchingFee && matchingFee.shippingFee !== undefined) {
              setShippingFee(Number(matchingFee.shippingFee))
            } else {
              setShippingFee(0)
            }
          } catch (fallbackError) {
            setShippingFee(0)
          }
        } finally {
          setLoadingShipping(false)
        }
      } else {
        setShippingFee(0)
      }
    }
    fetchShippingFee()
  }, [formData.governorate])

  // Validate promo code when it changes (with debouncing)
  useEffect(() => {
    const validatePromoCode = async () => {
      if (formData.promoCode && formData.promoCode.trim()) {
        try {
          const orderTotal = getCartTotal()
          const validation = await promoCodesAPI.validate(formData.promoCode.trim(), orderTotal)
          if (validation.valid) {
            setPromoDiscount(validation.discount || 0)
            setValidatedPromoCode(formData.promoCode.trim())
          } else {
            setPromoDiscount(0)
            setValidatedPromoCode(null)
            if (formData.promoCode.trim()) {
              setErrors(prev => ({ ...prev, promoCode: validation.message || 'Invalid promo code' }))
            }
          }
        } catch (error) {
          setPromoDiscount(0)
          setValidatedPromoCode(null)
          setErrors(prev => ({ ...prev, promoCode: 'Failed to validate promo code' }))
        }
      } else {
        setPromoDiscount(0)
        setValidatedPromoCode(null)
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.promoCode
          return newErrors
        })
      }
    }
    
    // Debounce validation to reduce API calls
    const timeoutId = setTimeout(validatePromoCode, 800)
    return () => clearTimeout(timeoutId)
  }, [formData.promoCode, getCartTotal])

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

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // Calculate final total
        const subtotal = getCartTotal()
        const finalTotal = subtotal - promoDiscount + shippingFee

        // Prepare order data for backend
      const orderData = {
          userId: isAuthenticated && user ? user.id : null, // Link to user if logged in
          userInfo: {
            name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            country: 'Egypt',
            governorate: formData.governorate,
            address: formData.address,
            apartment: formData.city,
            notes: formData.notes
          },
          items: cartItems.map(item => {
            // Handle both number and string price formats
            let price
            if (typeof item.price === 'number') {
              price = item.price
            } else if (typeof item.price === 'string') {
              price = parseFloat(item.price.replace(/[,\sEGP]/g, '')) || 0
            } else {
              price = 0
            }
            
            return {
              productId: item.id,
              title: item.name,
              price: price,
              mainImage: item.image ? item.image.split('/').pop() : '',
              quantity: item.quantity,
              size: item.selectedSize || ''
            }
          }),
          paymentMethod: formData.paymentMethod,
          total: finalTotal,
          shippingFee: shippingFee,
          promoCode: validatedPromoCode || ''
        }

        // Submit order to backend
        const result = await publicCheckoutAPI.create(orderData)
        
        // Apply promo code if valid
        if (validatedPromoCode) {
          try {
            await promoCodesAPI.apply(validatedPromoCode)
          } catch (error) {
            // Continue even if promo code application fails
          }
        }

      // Send confirmation email
        const emailResult = await sendOrderConfirmation({
          customer: formData,
          items: cartItems,
          total: finalTotal,
          shippingFee: shippingFee,
          promoDiscount: promoDiscount
        })
      
      if (emailResult.success) {
        setEmailStatus('success')
      } else {
        setEmailStatus('failed')
      }

      setOrderPlaced(true)
      clearCart()
      setIsSubmitting(false)

      // Redirect to home after 5 seconds
      setTimeout(() => {
        navigate('/')
      }, 5000)
      } catch (error) {
        alert(error.message || 'Failed to place order. Please check your information and try again.')
        setIsSubmitting(false)
      }
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
              <p><strong>Order Total:</strong> {(getCartTotal() - promoDiscount + shippingFee).toLocaleString()} EGP</p>
              {promoDiscount > 0 && (
                <p><strong>Promo Discount:</strong> -{promoDiscount.toLocaleString()} EGP ({formData.promoCode})</p>
              )}
              {shippingFee > 0 && (
                <p><strong>Shipping Fee:</strong> {shippingFee.toLocaleString()} EGP</p>
              )}
              <p><strong>Payment Method:</strong> {
                formData.paymentMethod === 'cod' ? 'Cash on Delivery' :
                formData.paymentMethod === 'telda' ? 'Telda (ivyeg)' :
                formData.paymentMethod === 'instapay' ? 'InstaPay' : ''
              }</p>
              <p><strong>Delivery to:</strong> {formData.governorate}, {formData.city}</p>
              <p><strong>Contact:</strong> {formData.phone}</p>
            </div>
            
            {formData.paymentMethod === 'telda' && (
              <div className="payment-instructions">
                <h4>📱 Telda Payment Instructions</h4>
                <p>Please send <strong>{(getCartTotal() - promoDiscount + shippingFee).toLocaleString()} EGP</strong> to:</p>
                <p className="payment-info-highlight">Username: <strong>ivyeg</strong></p>
              </div>
            )}
            
            {formData.paymentMethod === 'instapay' && (
              <div className="payment-instructions">
                <h4>🏦 InstaPay Payment Instructions</h4>
                <p>Please send <strong>{(getCartTotal() - promoDiscount + shippingFee).toLocaleString()} EGP</strong> via InstaPay.</p>
                <p className="payment-info-highlight">Contact us for payment details</p>
              </div>
            )}
            
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

                      <div className="form-group">
                        <label htmlFor="promoCode" className="form-label">
                          <span>Promo Code (Optional)</span>
                        </label>
                        <div className="promo-input-wrapper">
                          <input
                            type="text"
                            id="promoCode"
                            name="promoCode"
                            value={formData.promoCode}
                            onChange={handleChange}
                            className={`form-input promo-input ${errors.promoCode ? 'error' : validatedPromoCode ? 'valid' : ''}`}
                            placeholder="Enter your promo code"
                            style={{ textTransform: 'uppercase' }}
                          />
                          {validatedPromoCode && (
                            <div className="promo-success-animation">
                              <svg className="promo-checkmark" viewBox="0 0 52 52">
                                <circle className="promo-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                <path className="promo-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        {validatedPromoCode && (
                          <p className="promo-info success">
                            <span className="promo-spark">✨</span> 
                            Promo code applied! You save {promoDiscount.toLocaleString()} EGP
                          </p>
                        )}
                        {errors.promoCode && (
                          <span className="error-message">{errors.promoCode}</span>
                        )}
                        {formData.promoCode && !validatedPromoCode && !errors.promoCode && (
                          <p className="promo-info">
                            <span className="promo-spark">⏳</span> 
                            Validating promo code...
                          </p>
                        )}
                      </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Payment Method</h3>
              
              <div className="payment-methods">
                <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">💵</div>
                    <div className="payment-details">
                      <h4>Cash on Delivery (COD)</h4>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'telda' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telda"
                    checked={formData.paymentMethod === 'telda'}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">💳</div>
                    <div className="payment-details">
                      <h4>Telda</h4>
                      <p>Send <strong>{getCartTotal().toLocaleString()} EGP</strong> to username: <strong className="payment-username">ivyeg</strong></p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${formData.paymentMethod === 'instapay' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={formData.paymentMethod === 'instapay'}
                    onChange={handleChange}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">🏦</div>
                    <div className="payment-details">
                      <h4>InstaPay</h4>
                      <p>Send <strong>{getCartTotal().toLocaleString()} EGP</strong> via InstaPay</p>
                      <p className="payment-note">Contact us for payment details</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
            </div>

            <button 
              type="submit" 
              className="btn-place-order"
              disabled={isSubmitting || loadingShipping}
            >
              {isSubmitting ? 'Processing Order...' : `Place Order - ${(getCartTotal() - promoDiscount + shippingFee).toLocaleString()} EGP`}
            </button>
          </form>

          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    <div className="summary-item-details">
                      {item.selectedSize && <span className="summary-item-size">Size: {item.selectedSize}</span>}
                      <span className="summary-item-qty">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="summary-item-price">
                    {(() => {
                      let price
                      if (typeof item.price === 'number') {
                        price = item.price
                      } else if (typeof item.price === 'string') {
                        price = parseFloat(item.price.replace(/[,\sEGP]/g, '')) || 0
                      } else {
                        price = 0
                      }
                      return (price * item.quantity).toLocaleString()
                    })()} EGP
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{getCartTotal().toLocaleString()} EGP</span>
            </div>

            {promoDiscount > 0 && (
              <div className="summary-row discount">
                <span>Promo Discount ({formData.promoCode}):</span>
                <span>-{promoDiscount.toLocaleString()} EGP</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {loadingShipping ? 'Calculating...' : `${shippingFee.toLocaleString()} EGP`}
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">
                {(getCartTotal() - promoDiscount + shippingFee).toLocaleString()} EGP
              </span>
            </div>

            <div className="summary-note">
              <p>Delivery fees calculated based on your governorate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

