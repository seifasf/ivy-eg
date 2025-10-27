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
import './Dashboard.css'

function Dashboard() {
  // Mock data - replace with actual API calls
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activePromoCodes: 0,
    totalCustomers: 0
  })

  const [recentOrders, setRecentOrders] = useState([])
  
  const [shippingFees, setShippingFees] = useState({
    Cairo: 50,
    Giza: 50,
    Alexandria: 75,
    'Qalyubia': 60,
    'Sharqia': 70,
    'Dakahlia': 80,
    'Beheira': 80,
    'Gharbia': 75,
    'Monufia': 70,
    'Kafr El Sheikh': 80,
    'Damietta': 85,
    'Port Said': 90,
    'Ismailia': 85,
    'Suez': 85,
    'North Sinai': 120,
    'South Sinai': 120,
    'Minya': 90,
    'Asyut': 100,
    'Sohag': 110,
    'Qena': 115,
    'Luxor': 120,
    'Aswan': 130,
    'Red Sea': 130,
    'New Valley': 140,
    'Matrouh': 130,
    'Fayoum': 70,
    'Beni Suef': 75
  })

  const [editingGov, setEditingGov] = useState(null)
  const [tempFee, setTempFee] = useState('')
  const [saveMessage, setSaveMessage] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const statsResponse = await fetch('/api/admin/stats')
      // const statsData = await statsResponse.json()
      // setStats(statsData)
      
      // const ordersResponse = await fetch('/api/admin/recent-orders')
      // const ordersData = await ordersResponse.json()
      // setRecentOrders(ordersData)
      
      // For now, set empty data
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        activePromoCodes: 0,
        totalCustomers: 0
      })
      setRecentOrders([])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  const handleSaveShipping = (governorate) => {
    const newFee = parseInt(tempFee) || 0
    setShippingFees(prev => ({
      ...prev,
      [governorate]: newFee
    }))
    setEditingGov(null)
    setTempFee('')
    
    // Show save message
    setSaveMessage(true)
    setTimeout(() => setSaveMessage(false), 2000)
    
    // TODO: Save to backend
    localStorage.setItem('shippingFees', JSON.stringify({
      ...shippingFees,
      [governorate]: newFee
    }))
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
              <HiTrendingUp size={14} />
              <span>+12% from last month</span>
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
              <HiTrendingUp size={14} />
              <span>+18% from last month</span>
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
              <span>Coming soon</span>
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
              <HiTrendingUp size={14} />
              <span>+8% from last month</span>
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

