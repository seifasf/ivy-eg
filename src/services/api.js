// API Service - Centralized API calls for IVY E-commerce
import { getCached, setCached, clearCache } from '../utils/cache'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'

// Helper to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `${BACKEND_BASE_URL}/uploads/${imagePath}`
}

// Helper function for API calls with caching
const apiCall = async (endpoint, options = {}, useCache = false) => {
  // Try user token first, then admin token
  const token = localStorage.getItem('userToken') || localStorage.getItem('adminToken')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }

  // Check cache for GET requests (only if cache is enabled)
  const cacheKey = `${endpoint}_${JSON.stringify(options)}`
  if (useCache && (options.method === undefined || options.method === 'GET')) {
    const cached = getCached(cacheKey)
    if (cached) {
      return cached
    }
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout (increased for slow connections)
    
    const response = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    })

    clearTimeout(timeoutId)

    const responseStatus = response.status
    const responseStatusText = response.statusText

    // Try to get response text first to see what we're getting
    const responseText = await response.text()

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText)
        throw new Error(errorData.message || `API Error: ${responseStatusText}`)
      } catch (e) {
        throw new Error(`API Error: ${responseStatusText} - ${responseText.substring(0, 100)}`)
      }
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error('Invalid JSON response from server')
    }
    
    // Cache GET requests
    if (useCache && (options.method === undefined || options.method === 'GET')) {
      setCached(cacheKey, data)
    }
    
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection and try again.')
    }
    // Re-throw with better error message
    if (error.message) {
    throw error
    }
    throw new Error('Network error. Please check your connection and try again.')
  }
}

// Export cache utilities
export { clearCache }

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

// User APIs (Public users)
export const userAPI = {
  googleAuth: (googleData) => apiCall('/users/google-auth', {
    method: 'POST',
    body: JSON.stringify(googleData)
  }),
  
  getMyOrders: () => apiCall('/users/orders/my-orders')
}

// Dashboard APIs (with caching)
export const dashboardAPI = {
  getStats: () => apiCall('/dashboard/stats', {}, true),
  getRecentOrders: (limit = 5) => apiCall(`/dashboard/recent-orders?limit=${limit}`, {}, true)
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

// Governorate Shipping APIs (with caching)
export const governorateShippingAPI = {
  getAll: () => apiCall('/governorate-shipping', {}, true),
  getByGovernorate: (governorate) => {
    // URL encode to handle spaces and special characters
    const encoded = encodeURIComponent(governorate)
    return apiCall(`/governorate-shipping/${encoded}`, {}, true)
  },
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

// Settings APIs
export const settingsAPI = {
  getAll: () => apiCall('/settings'),
  getByType: (type) => apiCall(`/settings/${type}`),
  update: (type, data) => apiCall(`/settings/${type}`, {
    method: 'PUT',
    body: JSON.stringify({ data })
  })
}

// Public Products API (for frontend - with caching)
export const publicProductsAPI = {
  getAll: () => apiCall('/products', {}, true), // Enable caching
  getById: (id) => apiCall(`/products/${id}`, {}, true) // Enable caching
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

