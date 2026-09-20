import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { userAPI, getImageUrl } from '../services/api'
import { OrderSkeleton } from '../components/LoadingSkeleton'
import { HiClock, HiCheckCircle, HiTruck, HiXCircle, HiShoppingBag } from 'react-icons/hi'
import './TrackOrders.css'

function TrackOrders() {
  const { isAuthenticated, user } = useUser()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await userAPI.getMyOrders()
      setOrders(data)
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <HiClock size={20} style={{ color: '#ff9f43' }} />
      case 'processing':
        return <HiClock size={20} style={{ color: '#54a0ff' }} />
      case 'shipped':
        return <HiTruck size={20} style={{ color: '#5f27cd' }} />
      case 'delivered':
        return <HiCheckCircle size={20} style={{ color: '#00d2d3' }} />
      case 'cancelled':
        return <HiXCircle size={20} style={{ color: '#ff4757' }} />
      default:
        return <HiClock size={20} />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9f43'
      case 'processing':
        return '#54a0ff'
      case 'shipped':
        return '#5f27cd'
      case 'delivered':
        return '#00d2d3'
      case 'cancelled':
        return '#ff4757'
      default:
        return '#b0b0b0'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="track-orders-page">
        <div className="track-orders-container">
          <div className="not-authenticated">
            <HiShoppingBag size={64} style={{ color: '#b0b0b0', marginBottom: '20px' }} />
            <h2>Please Sign In</h2>
            <p>Sign in with Google to view your order history</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="track-orders-page">
        <div className="track-orders-container">
          <div className="track-orders-header">
            <h1>My Orders</h1>
            <p>Track and view your order history</p>
          </div>
          <div className="orders-list">
            {[...Array(2)].map((_, i) => (
              <OrderSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="track-orders-page">
      <div className="track-orders-container">
        <div className="track-orders-header">
          <h1>My Orders</h1>
          <p>Track and view your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <HiShoppingBag size={64} style={{ color: '#b0b0b0', marginBottom: '20px' }} />
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-image">
                      <img 
                        src={getImageUrl(item.mainImage)} 
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.src = '/IMGs/IVY-03.png'
                        }}
                      />
                      </div>
                      <div className="order-item-details">
                        <h4>{item.title}</h4>
                        <p>Quantity: {item.quantity}</p>
                        {item.size && <p>Size: {item.size}</p>}
                        <p className="order-item-price">{item.price.toLocaleString()} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{(order.total - order.shippingFee).toLocaleString()} EGP</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>{order.shippingFee.toLocaleString()} EGP</span>
                    </div>
                    {order.promoCode && (
                      <div className="summary-row">
                        <span>Promo Code:</span>
                        <span>{order.promoCode}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{order.total.toLocaleString()} EGP</span>
                    </div>
                  </div>
                  <div className="order-delivery">
                    <p><strong>Delivery Address:</strong></p>
                    <p>{order.userInfo.address}</p>
                    <p>{order.userInfo.city}, {order.userInfo.governorate}</p>
                    <p>{order.userInfo.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrders

