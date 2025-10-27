// API Service - Centralized API calls for IVY E-commerce
// Backend URL - Update this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Authentication APIs
export const authAPI = {
  login: (credentials) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (userData) => apiCall('/admin/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  forgotPassword: (email) => apiCall('/admin/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (data) => apiCall('/admin/reset-password', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats'),
  getRecentOrders: (limit = 5) => apiCall(`/dashboard/recent-orders?limit=${limit}`)
}

// Orders APIs (Checkout endpoints)
export const ordersAPI = {
  getAll: () => apiCall('/checkout'),
  getById: (id) => apiCall(`/checkout/${id}`),
  updateStatus: (id, status) => apiCall(`/checkout/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  updateShippingFee: (id, shippingFee) => apiCall(`/checkout/${id}/shipping-fee`, {
    method: 'PUT',
    body: JSON.stringify({ shippingFee })
  }),
  delete: (id) => apiCall(`/checkout/${id}`, {
    method: 'DELETE'
  })
}

// Products APIs
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  
  // Admin-only endpoints (with multipart/form-data for images)
  create: async (formData) => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData // FormData for file upload
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return await response.json()
  },
  
  update: async (id, formData) => {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData // FormData for file upload
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return await response.json()
  },
  
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE'
  })
}

// Promo Codes APIs
export const promoCodesAPI = {
  getAll: () => apiCall('/promocodes'),
  getById: (id) => apiCall(`/promocodes/${id}`),
  create: (codeData) => apiCall('/promocodes', {
    method: 'POST',
    body: JSON.stringify(codeData)
  }),
  update: (id, codeData) => apiCall(`/promocodes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(codeData)
  }),
  delete: (id) => apiCall(`/promocodes/${id}`, {
    method: 'DELETE'
  }),
  toggleActive: (id) => apiCall(`/promocodes/${id}/toggle-active`, {
    method: 'PATCH'
  }),
  validate: (code, orderTotal) => apiCall('/promocodes/validate', {
    method: 'POST',
    body: JSON.stringify({ code, orderTotal })
  }),
  apply: (code) => apiCall('/promocodes/apply', {
    method: 'POST',
    body: JSON.stringify({ code })
  })
}

// Governorate Shipping APIs
export const governorateShippingAPI = {
  getAll: () => apiCall('/governorate-shipping'),
  getByGovernorate: (governorate) => apiCall(`/governorate-shipping/${governorate}`),
  initialize: () => apiCall('/governorate-shipping/initialize', {
    method: 'POST'
  }),
  update: (governorate, shippingFee) => apiCall('/governorate-shipping', {
    method: 'PUT',
    body: JSON.stringify({ governorate, shippingFee })
  }),
  updateBulk: (fees) => apiCall('/governorate-shipping/bulk', {
    method: 'PUT',
    body: JSON.stringify({ fees })
  })
}

// Settings/Business APIs (if exists in backend)
export const settingsAPI = {
  // TODO: Implement when business endpoints are ready
  getStore: () => apiCall('/business'),
  updateStore: (storeData) => apiCall('/business', {
    method: 'PUT',
    body: JSON.stringify(storeData)
  })
}

// Public Products API (for frontend)
export const publicProductsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`)
}

// Public Checkout API (for frontend)
export const publicCheckoutAPI = {
  create: (orderData) => apiCall('/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

// Contact API (for frontend contact form)
export const contactAPI = {
  sendMessage: (messageData) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData)
  })
}

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  orders: ordersAPI,
  products: productsAPI,
  promoCodes: promoCodesAPI,
  governorateShipping: governorateShippingAPI,
  settings: settingsAPI,
  publicProducts: publicProductsAPI,
  publicCheckout: publicCheckoutAPI,
  contact: contactAPI
}

