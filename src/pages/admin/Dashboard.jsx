import React, { useState, useEffect } from 'react'
import { 
  HiShoppingCart, 
  HiShoppingBag, 
  HiCurrencyDollar, 
  HiUsers,
  HiTrendingUp,
  HiClock,
  HiTruck,
  HiCheckCircle
} from 'react-icons/hi'
import { dashboardAPI, governorateShippingAPI } from '../../services/api'
import { StatsSkeleton } from '../../components/LoadingSkeleton'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activePromoCodes: 0,
    totalCustomers: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [shippingFees, setShippingFees] = useState({})

  const [editingGov, setEditingGov] = useState(null)
  const [tempFee, setTempFee] = useState('')
  const [saveMessage, setSaveMessage] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsData = await dashboardAPI.getStats()
      setStats({
        totalOrders: statsData.totalOrders || 0,
        pendingOrders: statsData.pendingOrders || 0,
        totalRevenue: statsData.totalRevenue || 0,
        totalProducts: statsData.totalProducts || 0,
        activePromoCodes: statsData.activePromoCodes || 0,
        totalCustomers: statsData.totalCustomers || 0
      })
      
      // Fetch recent orders
      const ordersData = await dashboardAPI.getRecentOrders(5)
      setRecentOrders(ordersData.map(order => ({
        id: order._id,
        customer: order.userInfo?.name || 'N/A',
        items: order.items?.length || 0,
        total: order.total || 0,
        status: order.status || 'pending',
        date: new Date(order.createdAt).toLocaleDateString()
      })))
      
      // Fetch shipping fees
      const shippingData = await governorateShippingAPI.getAll()
      const feesObj = {}
      if (Array.isArray(shippingData)) {
        shippingData.forEach(item => {
          feesObj[item.governorate] = item.shippingFee
        })
      }
      setShippingFees(feesObj)
    } catch (error) {
      // Set defaults on error
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        activePromoCodes: 0,
        totalCustomers: 0
      })
      setRecentOrders([])
      setShippingFees({})
      alert(`Failed to load dashboard data: ${error.message}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9f43'
      case 'processing': return '#54a0ff'
      case 'shipped': return '#5f27cd'
      case 'delivered': return '#00d2d3'
      case 'cancelled': return '#ff4757'
      default: return '#b0b0b0'
    }
  }

  const handleEditShipping = (governorate) => {
    setEditingGov(governorate)
    setTempFee(shippingFees[governorate].toString())
  }

  const handleSaveShipping = async (governorate) => {
    const newFee = parseInt(tempFee) || 0
    setShippingFees(prev => ({
      ...prev,
      [governorate]: newFee
    }))
    setEditingGov(null)
    setTempFee('')
    
    try {
      // Save to backend
      await governorateShippingAPI.update(governorate, newFee)
      setSaveMessage(true)
      setTimeout(() => setSaveMessage(false), 2000)
    } catch (error) {
    setSaveMessage(true)
    setTimeout(() => setSaveMessage(false), 2000)
    }
  }

  const handleCancelEdit = () => {
    setEditingGov(null)
    setTempFee('')
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(84, 160, 255, 0.1)' }}>
            <HiShoppingCart size={28} style={{ color: '#54a0ff' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-trend">
              <span>All time orders</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 159, 67, 0.1)' }}>
            <HiClock size={28} style={{ color: '#ff9f43' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Orders</p>
            <h3 className="stat-value">{stats.pendingOrders}</h3>
            <p className="stat-trend">
              <span>Needs attention</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 210, 211, 0.1)' }}>
            <HiCurrencyDollar size={28} style={{ color: '#00d2d3' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">{stats.totalRevenue.toLocaleString()} EGP</h3>
            <p className="stat-trend">
              <span>Total revenue from delivered orders</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 71, 87, 0.1)' }}>
            <HiShoppingBag size={28} style={{ color: '#ff4757' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <p className="stat-trend">
              <span>Total products in catalog</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(95, 39, 205, 0.1)' }}>
            <HiShoppingBag size={28} style={{ color: '#5f27cd' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Promo Codes</p>
            <h3 className="stat-value">{stats.activePromoCodes}</h3>
            <p className="stat-trend">
              <span>Currently active</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <HiUsers size={28} style={{ color: '#ffffff' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <h3 className="stat-value">{stats.totalCustomers}</h3>
            <p className="stat-trend">
              <span>Unique customers</span>
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Recent Orders</h2>
          <a href="/admin/orders" className="section-link">View All →</a>
        </div>
        
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="customer-name">{order.customer}</td>
                  <td>{order.items} items</td>
                  <td className="order-total">{order.total.toLocaleString()} EGP</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ 
                        background: `${getStatusColor(order.status)}15`,
                        color: getStatusColor(order.status)
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="order-date">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Fees Management */}
      <div className="dashboard-section shipping-section">
        <div className="section-header">
          <div className="section-title-with-icon">
            <HiTruck size={24} />
            <h2 className="section-title">Shipping Fees by Governorate</h2>
          </div>
          {saveMessage && (
            <div className="save-success">
              <HiCheckCircle size={18} />
              <span>Saved!</span>
            </div>
          )}
        </div>
        
        <div className="shipping-grid">
          {Object.entries(shippingFees)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([governorate, fee]) => (
              <div key={governorate} className="shipping-item">
                <span className="governorate-name">{governorate}</span>
                {editingGov === governorate ? (
                  <div className="edit-shipping-controls">
                    <input
                      type="number"
                      value={tempFee}
                      onChange={(e) => setTempFee(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveShipping(governorate)
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      autoFocus
                      min="0"
                      className="shipping-input"
                    />
                    <button 
                      className="btn-save-shipping"
                      onClick={() => handleSaveShipping(governorate)}
                    >
                      ✓
                    </button>
                    <button 
                      className="btn-cancel-shipping"
                      onClick={handleCancelEdit}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="shipping-fee-display">
                    <span className="fee-value">{fee} EGP</span>
                    <button 
                      className="btn-edit-shipping"
                      onClick={() => handleEditShipping(governorate)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
        <p className="shipping-note">
          💡 Click "Edit" to update shipping fee for any governorate. Changes are saved automatically.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <a href="/admin/products" className="quick-action-card">
            <HiShoppingBag size={32} />
            <span>Add New Product</span>
          </a>
          <a href="/admin/orders" className="quick-action-card">
            <HiShoppingCart size={32} />
            <span>Manage Orders</span>
          </a>
          <a href="/admin/promocodes" className="quick-action-card">
            <HiShoppingBag size={32} />
            <span>Create Promo Code</span>
          </a>
          <a href="/admin/settings" className="quick-action-card">
            <HiCurrencyDollar size={32} />
            <span>Update Shipping</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

