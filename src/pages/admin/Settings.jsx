import React, { useState, useEffect } from 'react'
import {
  HiTruck,
  HiOfficeBuilding,
  HiMail,
  HiPhone,
  HiCheckCircle
} from 'react-icons/hi'
import { settingsAPI, governorateShippingAPI } from '../../services/api'
import './Settings.css'

function Settings() {
  const [shippingSettings, setShippingSettings] = useState({
    baseShippingFee: 0,
    freeShippingThreshold: 0,
    egyptGovernoratesFees: {}
  })

  const [storeSettings, setStoreSettings] = useState({
    storeName: '',
    email: '',
    phone: ''
  })

  const [emailSettings, setEmailSettings] = useState({
    serviceId: '',
    templateId: '',
    publicKey: ''
  })

  const [saveMessage, setSaveMessage] = useState({ show: false, text: '', type: '' })
  const [loading, setLoading] = useState(true)

  // Load settings from backend on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      
      // Load store settings
      const storeSettingsData = await settingsAPI.getByType('store')
      if (storeSettingsData && storeSettingsData.data) {
        setStoreSettings(prev => ({
          ...prev,
          ...storeSettingsData.data
        }))
      }
      
      // Load email settings
      const emailSettingsData = await settingsAPI.getByType('email')
      if (emailSettingsData && emailSettingsData.data) {
        const emailData = emailSettingsData.data
        setEmailSettings({
          serviceId: emailData.serviceId || '',
          templateId: emailData.templateId || '',
          publicKey: emailData.publicKey || ''
        })
        // Update email service config
        const { updateEmailConfig } = await import('../../services/emailService')
        updateEmailConfig(emailData)
      }
      
      // Load shipping settings
      const shippingSettingsData = await settingsAPI.getByType('shipping')
      if (shippingSettingsData && shippingSettingsData.data) {
        setShippingSettings(prev => ({
          ...prev,
          baseShippingFee: shippingSettingsData.data.baseShippingFee || 0,
          freeShippingThreshold: shippingSettingsData.data.freeShippingThreshold || 0
        }))
      }
      
      // Load governorate shipping fees
      const governorateFees = await governorateShippingAPI.getAll()
      if (governorateFees && governorateFees.length > 0) {
        const feesObj = {}
        governorateFees.forEach(item => {
          feesObj[item.governorate] = item.shippingFee
        })
        setShippingSettings(prev => ({
          ...prev,
          egyptGovernoratesFees: feesObj
        }))
      }
    } catch (error) {
      // Error loading settings
    } finally {
      setLoading(false)
    }
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleGovernorateFeeChange = (governorate, value) => {
    setShippingSettings(prev => ({
      ...prev,
      egyptGovernoratesFees: {
        ...prev.egyptGovernoratesFees,
        [governorate]: parseFloat(value) || 0
      }
    }))
  }

  const handleStoreChange = (e) => {
    const { name, value } = e.target
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailChange = (e) => {
    const { name, value } = e.target
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const showSaveMessage = (text, type) => {
    setSaveMessage({ show: true, text, type })
    setTimeout(() => {
      setSaveMessage({ show: false, text: '', type: '' })
    }, 3000)
  }

  const saveShippingSettings = async () => {
    try {
      // Save base shipping settings
      await settingsAPI.update('shipping', {
        baseShippingFee: shippingSettings.baseShippingFee,
        freeShippingThreshold: shippingSettings.freeShippingThreshold
      })
      
      // Save governorate fees (update each one)
      const updatePromises = Object.entries(shippingSettings.egyptGovernoratesFees).map(
        ([governorate, fee]) => governorateShippingAPI.update(governorate, fee)
      )
      await Promise.all(updatePromises)
      
      showSaveMessage('Shipping settings saved successfully!', 'success')
    } catch (error) {
      showSaveMessage(error.message || 'Failed to save shipping settings. Please try again.', 'error')
    }
  }

  const saveStoreSettings = async () => {
    if (!storeSettings.storeName || !storeSettings.email || !storeSettings.phone) {
      showSaveMessage('Please fill in all store information fields', 'error')
      return
    }
    try {
      await settingsAPI.update('store', {
        storeName: storeSettings.storeName,
        email: storeSettings.email,
        phone: storeSettings.phone
      })
      showSaveMessage('Store information saved successfully!', 'success')
    } catch (error) {
      showSaveMessage(error.message || 'Failed to save store information. Please try again.', 'error')
    }
  }

  const saveEmailSettings = async () => {
    try {
      await settingsAPI.update('email', {
        serviceId: emailSettings.serviceId,
        templateId: emailSettings.templateId,
        publicKey: emailSettings.publicKey
      })
      // Update email service config
      const { updateEmailConfig } = await import('../../services/emailService')
      updateEmailConfig(emailSettings)
      showSaveMessage('Email settings saved successfully!', 'success')
    } catch (error) {
      showSaveMessage(error.message || 'Failed to save email settings. Please try again.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="admin-settings-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Settings</h1>
            <p className="admin-page-subtitle">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your store settings and preferences</p>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage.show && (
        <div className={`save-message ${saveMessage.type}`}>
          <HiCheckCircle size={20} />
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Shipping Settings */}
      <div className="settings-section">
        <div className="section-header-settings">
          <HiTruck size={24} />
          <div>
            <h2>Shipping Settings</h2>
            <p>Configure shipping fees and delivery options</p>
          </div>
        </div>

        <div className="settings-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Base Shipping Fee (EGP)</label>
              <input
                type="number"
                name="baseShippingFee"
                value={shippingSettings.baseShippingFee}
                onChange={handleShippingChange}
                min="0"
                step="1"
              />
              <span className="input-note">Default shipping fee for all orders</span>
            </div>

            <div className="form-group">
              <label>Free Shipping Threshold (EGP)</label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={shippingSettings.freeShippingThreshold}
                onChange={handleShippingChange}
                min="0"
                step="1"
              />
              <span className="input-note">Orders above this amount get free shipping</span>
            </div>
          </div>

          <div className="governorates-section">
            <h3>Shipping Fees by Governorate</h3>
            <p className="section-note">Customize shipping fees for specific governorates. Manage these fees from the Dashboard page.</p>
            {Object.keys(shippingSettings.egyptGovernoratesFees).length === 0 ? (
              <p className="no-fees-message">No shipping fees configured yet. Go to Dashboard to set up governorate fees.</p>
            ) : (
              <div className="governorates-grid">
                {Object.entries(shippingSettings.egyptGovernoratesFees)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([governorate, fee]) => (
                    <div key={governorate} className="governorate-fee-item">
                      <label>{governorate}</label>
                      <div className="fee-input-wrapper">
                        <input
                          type="number"
                          value={fee}
                          onChange={(e) => handleGovernorateFeeChange(governorate, e.target.value)}
                          min="0"
                          step="1"
                        />
                        <span>EGP</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button className="btn-save-section" onClick={saveShippingSettings}>
            Save Shipping Settings
          </button>
        </div>
      </div>

      {/* Store Information */}
      <div className="settings-section">
        <div className="section-header-settings">
          <HiOfficeBuilding size={24} />
          <div>
            <h2>Store Information</h2>
            <p>Basic information about your store</p>
          </div>
        </div>

        <div className="settings-content">
          <div className="form-grid">
            <div className="form-group">
              <label>Store Name</label>
              <input
                type="text"
                name="storeName"
                value={storeSettings.storeName}
                onChange={handleStoreChange}
                placeholder="IVY"
              />
            </div>

            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                name="email"
                value={storeSettings.email}
                onChange={handleStoreChange}
                placeholder="ivyforhelp@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={storeSettings.phone}
                onChange={handleStoreChange}
                placeholder="+20 100 000 0000"
              />
            </div>
          </div>

          <button className="btn-save-section" onClick={saveStoreSettings}>
            Save Store Information
          </button>
        </div>
      </div>

      {/* Email Settings (EmailJS) */}
      <div className="settings-section">
        <div className="section-header-settings">
          <HiMail size={24} />
          <div>
            <h2>Email Settings (EmailJS)</h2>
            <p>Configure email notifications for orders and contact form</p>
          </div>
        </div>

        <div className="settings-content">
          <div className="email-info-box">
            <h4>📧 Setup Instructions:</h4>
            <ol>
              <li>Create a free account at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">emailjs.com</a></li>
              <li>Add Gmail service with your store email</li>
              <li>Create an email template for order confirmations</li>
              <li>Copy your credentials and paste them below</li>
            </ol>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Service ID</label>
              <input
                type="text"
                name="serviceId"
                value={emailSettings.serviceId}
                onChange={handleEmailChange}
                placeholder="YOUR_SERVICE_ID"
              />
            </div>

            <div className="form-group">
              <label>Template ID</label>
              <input
                type="text"
                name="templateId"
                value={emailSettings.templateId}
                onChange={handleEmailChange}
                placeholder="YOUR_TEMPLATE_ID"
              />
            </div>

            <div className="form-group">
              <label>Public Key</label>
              <input
                type="text"
                name="publicKey"
                value={emailSettings.publicKey}
                onChange={handleEmailChange}
                placeholder="YOUR_PUBLIC_KEY"
              />
            </div>
          </div>

          <div className="email-status">
            <p>
              {!emailSettings.serviceId || emailSettings.serviceId === '' 
                ? '⚠️ Email integration not configured yet'
                : '✅ Email integration configured'}
            </p>
          </div>

          <button className="btn-save-section" onClick={saveEmailSettings}>
            Save Email Settings
          </button>
        </div>
      </div>

    </div>
  )
}

export default Settings

