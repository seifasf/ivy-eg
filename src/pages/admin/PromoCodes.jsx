import React, { useState, useEffect } from 'react'
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiTag,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi'
import './PromoCodes.css'

function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxUsage: '',
    currentUsage: 0,
    expiryDate: '',
    active: true
  })

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/promo-codes')
      // const data = await response.json()
      // setPromoCodes(data)
      
      // For now, set empty array
      setPromoCodes([])
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    }
  }

  const openAddModal = () => {
    setEditingCode(null)
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxUsage: '',
      currentUsage: 0,
      expiryDate: '',
      active: true
    })
    setShowModal(true)
  }

  const openEditModal = (code) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      discountType: code.discountType,
      discountValue: code.discountValue.toString(),
      minOrderValue: code.minOrderValue.toString(),
      maxUsage: code.maxUsage.toString(),
      currentUsage: code.currentUsage,
      expiryDate: code.expiryDate,
      active: code.active
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCode(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const codeData = {
      ...formData,
      code: formData.code.toUpperCase(),
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: parseFloat(formData.minOrderValue),
      maxUsage: parseInt(formData.maxUsage),
      id: editingCode ? editingCode.id : Date.now(),
      createdAt: editingCode ? editingCode.createdAt : new Date().toISOString().split('T')[0]
    }

    if (editingCode) {
      setPromoCodes(promoCodes.map(code => code.id === editingCode.id ? codeData : code))
    } else {
      setPromoCodes([...promoCodes, codeData])
    }

    closeModal()
  }

  const handleDelete = (codeId) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      setPromoCodes(promoCodes.filter(code => code.id !== codeId))
    }
  }

  const toggleActive = (codeId) => {
    setPromoCodes(promoCodes.map(code =>
      code.id === codeId ? { ...code, active: !code.active } : code
    ))
  }

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date()
  }

  const isUsageFull = (code) => {
    return code.currentUsage >= code.maxUsage
  }

  const getCodeStatus = (code) => {
    if (!code.active) return { text: 'Inactive', color: '#666666' }
    if (isExpired(code.expiryDate)) return { text: 'Expired', color: '#ff4757' }
    if (isUsageFull(code)) return { text: 'Limit Reached', color: '#ff9f43' }
    return { text: 'Active', color: '#00d2d3' }
  }

  const getUsagePercentage = (code) => {
    return (code.currentUsage / code.maxUsage) * 100
  }

  return (
    <div className="admin-promocodes-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Promo Codes Management</h1>
          <p className="admin-page-subtitle">Create and manage discount codes for your customers</p>
        </div>
        <button className="btn-add-code" onClick={openAddModal}>
          <HiPlus size={20} />
          Create Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="codes-stats">
        <div className="stat-box">
          <span className="stat-value">{promoCodes.length}</span>
          <span className="stat-label">Total Codes</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{promoCodes.filter(c => c.active && !isExpired(c.expiryDate)).length}</span>
          <span className="stat-label">Active Codes</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">
            {promoCodes.reduce((sum, code) => sum + code.currentUsage, 0)}
          </span>
          <span className="stat-label">Total Usage</span>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="codes-list">
        {promoCodes.length === 0 ? (
          <div className="no-codes">
            <HiTag size={60} />
            <p>No promo codes yet</p>
            <button className="btn-add-first" onClick={openAddModal}>
              <HiPlus size={20} />
              Create Your First Promo Code
            </button>
          </div>
        ) : (
          promoCodes.map(code => {
            const status = getCodeStatus(code)
            return (
              <div key={code.id} className="code-card">
                <div className="code-card-header">
                  <div className="code-main-info">
                    <div className="code-badge">
                      <HiTag size={20} />
                      <span className="code-name">{code.code}</span>
                    </div>
                    <span 
                      className="code-status"
                      style={{ 
                        background: `${status.color}15`,
                        color: status.color 
                      }}
                    >
                      {status.text}
                    </span>
                  </div>
                  <div className="code-actions-header">
                    <button
                      className={`btn-toggle ${code.active ? 'active' : 'inactive'}`}
                      onClick={() => toggleActive(code.id)}
                    >
                      {code.active ? <HiCheckCircle size={18} /> : <HiXCircle size={18} />}
                    </button>
                    <button className="btn-edit-icon" onClick={() => openEditModal(code)}>
                      <HiPencil size={18} />
                    </button>
                    <button className="btn-delete-icon" onClick={() => handleDelete(code.id)}>
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>

                <div className="code-card-body">
                  <div className="code-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Discount:</span>
                      <span className="detail-value">
                        {code.discountType === 'percentage' 
                          ? `${code.discountValue}% OFF` 
                          : `${code.discountValue} EGP OFF`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Min. Order:</span>
                      <span className="detail-value">{code.minOrderValue} EGP</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expires:</span>
                      <span className={`detail-value ${isExpired(code.expiryDate) ? 'expired' : ''}`}>
                        {new Date(code.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="usage-section">
                    <div className="usage-header">
                      <span className="usage-label">Usage:</span>
                      <span className="usage-count">
                        {code.currentUsage} / {code.maxUsage}
                      </span>
                    </div>
                    <div className="usage-bar">
                      <div 
                        className="usage-progress"
                        style={{ 
                          width: `${getUsagePercentage(code)}%`,
                          background: isUsageFull(code) ? '#ff4757' : '#00d2d3'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add/Edit Promo Code Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content code-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <HiX size={24} />
              </button>
            </div>

            <form className="modal-body code-form" onSubmit={handleSubmit}>
              {/* Code Details */}
              <div className="form-section">
                <h3>Code Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Promo Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      placeholder="e.g., SUMMER20"
                      style={{ textTransform: 'uppercase' }}
                      maxLength="20"
                    />
                    <span className="input-note">Use letters and numbers only</span>
                  </div>

                  <div className="form-group">
                    <label>Discount Type *</label>
                    <select name="discountType" value={formData.discountType} onChange={handleChange} required>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (EGP)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                    />
                    <span className="input-note">
                      {formData.discountType === 'percentage' ? 'Percentage off' : 'Amount in EGP'}
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Minimum Order Value (EGP) *</label>
                    <input
                      type="number"
                      name="minOrderValue"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="form-section">
                <h3>Usage Limits</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Maximum Usage *</label>
                    <input
                      type="number"
                      name="maxUsage"
                      value={formData.maxUsage}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="100"
                    />
                    <span className="input-note">Total number of times code can be used</span>
                  </div>

                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {formData.code && formData.discountValue && (
                <div className="code-preview">
                  <h3>Preview</h3>
                  <div className="preview-box">
                    <HiTag size={24} />
                    <div className="preview-content">
                      <span className="preview-code">{formData.code.toUpperCase()}</span>
                      <span className="preview-discount">
                        {formData.discountType === 'percentage' 
                          ? `${formData.discountValue}% OFF` 
                          : `${formData.discountValue} EGP OFF`}
                      </span>
                      <span className="preview-min">Min. order: {formData.minOrderValue} EGP</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Status */}
              <div className="form-section">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <label htmlFor="active">
                    Promo code is active and available for customers
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingCode ? 'Update Code' : 'Create Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoCodes

