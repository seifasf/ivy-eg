import React, { useState } from 'react'
import {
  HiTruck,
  HiOfficeBuilding,
  HiMail,
  HiPhone,
  HiLockClosed,
  HiCheckCircle
} from 'react-icons/hi'
import './Settings.css'

function Settings() {
  const [shippingSettings, setShippingSettings] = useState({
    baseShippingFee: 50,
    freeShippingThreshold: 1000,
    egyptGovernoratesFees: {
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
    }
  })

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'IVY',
    email: 'ivyforhelp@gmail.com',
    phone: '+20 100 000 0000'
  })

  const [emailSettings, setEmailSettings] = useState({
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
  })

  const [saveMessage, setSaveMessage] = useState({ show: false, text: '', type: '' })

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

  const saveShippingSettings = () => {
    // TODO: Save to backend
    localStorage.setItem('shippingSettings', JSON.stringify(shippingSettings))
    showSaveMessage('Shipping settings saved successfully!', 'success')
  }

  const saveStoreSettings = () => {
    // TODO: Save to backend
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings))
    showSaveMessage('Store information saved successfully!', 'success')
  }

  const saveEmailSettings = () => {
    // TODO: Save to backend
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings))
    showSaveMessage('Email settings saved successfully!', 'success')
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
            <p className="section-note">Customize shipping fees for specific governorates</p>
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
              <li>Add Gmail service with your email (ivyforhelp@gmail.com)</li>
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
              {emailSettings.serviceId === 'YOUR_SERVICE_ID' 
                ? '⚠️ Email integration not configured yet'
                : '✅ Email integration configured'}
            </p>
          </div>

          <button className="btn-save-section" onClick={saveEmailSettings}>
            Save Email Settings
          </button>
        </div>
      </div>

      {/* Admin Password */}
      <div className="settings-section">
        <div className="section-header-settings">
          <HiLockClosed size={24} />
          <div>
            <h2>Security</h2>
            <p>Change admin password and security settings</p>
          </div>
        </div>

        <div className="settings-content">
          <div className="security-info">
            <h4>🔐 Current Admin Credentials:</h4>
            <div className="credentials-box">
              <p><strong>Email:</strong> admin@ivy.eg</p>
              <p><strong>Password:</strong> IVY@2025</p>
            </div>
            <p className="security-note">
              ⚠️ Password change functionality will be available after backend integration.
              For now, you can modify credentials in <code>src/context/AdminContext.jsx</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

