import React, { useState, useEffect } from 'react'
import {  
  HiSearch,
  HiFilter,
  HiEye,
  HiTruck,
  HiCurrencyDollar,
  HiX
} from 'react-icons/hi'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Mock orders data - replace with API
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        customer: { name: 'Ahmed Mohamed', email: 'ahmed@email.com', phone: '+20 100 123 4567' },
        items: [
          { name: 'Premium T-Shirt', size: 'L', quantity: 2, price: 299 },
          { name: 'Casual Hoodie', size: 'M', quantity: 1, price: 599 }
        ],
        total: 1197,
        shippingFee: 50,
        status: 'pending',
        date: '2025-10-26T10:30:00',
        governorate: 'Cairo',
        city: 'Nasr City',
        address: '123 Main Street, Apt 4',
        paymentMethod: 'COD'
      },
      {
        id: 'ORD-002',
        customer: { name: 'Sara Ali', email: 'sara@email.com', phone: '+20 100 234 5678' },
        items: [
          { name: 'Sports Jacket', size: 'XL', quantity: 1, price: 799 }
        ],
        total: 799,
        shippingFee: 50,
        status: 'processing',
        date: '2025-10-26T08:15:00',
        governorate: 'Giza',
        city: '6th October',
        address: '456 Street Name',
        paymentMethod: 'InstaPay'
      }
    ]
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  // Filter orders
  useEffect(() => {
    let filtered = orders

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9f43',
      processing: '#54a0ff',
      shipped: '#5f27cd',
      delivered: '#00d2d3',
      cancelled: '#ff4757'
    }
    return colors[status] || '#b0b0b0'
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handleShippingFeeUpdate = (orderId, newFee) => {
    const fee = parseInt(newFee) || 0
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, shippingFee: fee } : order
    ))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, shippingFee: fee })
    }
  }

  const viewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders Management</h1>
        <p className="admin-page-subtitle">Track and manage all customer orders</p>
      </div>

      {/* Filters & Search */}
      <div className="orders-controls">
        <div className="search-box">
          <HiSearch size={20} />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filters">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-id-section">
                  <span className="order-id">{order.id}</span>
                  <span
                    className="order-status-badge"
                    style={{
                      background: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status)
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <button className="btn-view" onClick={() => viewOrder(order)}>
                  <HiEye size={18} />
                  View Details
                </button>
              </div>

              <div className="order-card-body">
                <div className="order-info-item">
                  <span className="label">Customer:</span>
                  <span className="value">{order.customer.name}</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Items:</span>
                  <span className="value">{order.items.length} items</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Total:</span>
                  <span className="value strong">{(order.total + order.shippingFee).toLocaleString()} EGP</span>
                </div>
                <div className="order-info-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="order-card-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.id}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <HiX size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Info */}
              <div className="modal-section">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span>{selectedOrder.customer.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span>{selectedOrder.customer.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span>{selectedOrder.customer.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Payment:</span>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="modal-section">
                <h3>Shipping Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Governorate:</span>
                    <span>{selectedOrder.governorate}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">City:</span>
                    <span>{selectedOrder.city}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="label">Address:</span>
                    <span>{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="modal-section">
                <h3>Order Items</h3>
                <div className="items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-details">
                        <span className="item-name">{item.name}</span>
                        <span className="item-size">Size: {item.size}</span>
                      </div>
                      <div className="item-price-section">
                        <span className="item-qty">x{item.quantity}</span>
                        <span className="item-price">{(item.price * item.quantity).toLocaleString()} EGP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Fee Control */}
              <div className="modal-section">
                <h3>Shipping Fee</h3>
                <div className="shipping-fee-control">
                  <label>
                    <HiTruck size={18} />
                    Shipping Fee (EGP):
                  </label>
                  <input
                    type="number"
                    value={selectedOrder.shippingFee}
                    onChange={(e) => handleShippingFeeUpdate(selectedOrder.id, e.target.value)}
                    min="0"
                    className="shipping-fee-input"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="modal-section">
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.total.toLocaleString()} EGP</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shippingFee.toLocaleString()} EGP</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{(selectedOrder.total + selectedOrder.shippingFee).toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="modal-section">
                <h3>Update Order Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="status-select-modal"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders

