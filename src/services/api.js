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

// The free backend sleeps when idle and needs up to a minute to wake up,
// so reads retry on network errors and gateway errors instead of failing.
const REQUEST_TIMEOUT_MS = 25000
const WRITE_TIMEOUT_MS = 60000
const RETRY_DELAYS_MS = [1500, 4000, 8000]
const RETRYABLE_STATUS = new Set([502, 503, 504])

const CACHE_MAX_AGE = {
  memory: 60 * 1000,
  swr: 2 * 60 * 1000
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Admin pages act as the admin even if a shopper account is also signed in
const getAuthToken = () => {
  const onAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  const adminToken = localStorage.getItem('adminToken')
  const userToken = localStorage.getItem('userToken')
  return onAdminPage ? adminToken || userToken : userToken || adminToken
}

const parseError = (status, statusText, text) => {
  let message = `Request failed (${status} ${statusText})`
  try {
    const data = JSON.parse(text)
    message = data.message || data.errors?.[0]?.msg || message
  } catch {
    // Not JSON (e.g. a proxy error page); keep the generic message
  }
  const error = new Error(message)
  error.status = status
  return error
}

const request = async (endpoint, options, isRead) => {
  const token = getAuthToken()
  const isFormData = options.body instanceof FormData
  const attempts = isRead ? RETRY_DELAYS_MS.length + 1 : 1

  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      isRead ? REQUEST_TIMEOUT_MS : WRITE_TIMEOUT_MS
    )
    const isLastAttempt = attempt === attempts - 1

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers
        }
      })
      const text = await response.text()

      if (!response.ok) {
        if (RETRYABLE_STATUS.has(response.status) && !isLastAttempt) {
          await sleep(RETRY_DELAYS_MS[attempt])
          continue
        }
        throw parseError(response.status, response.statusText, text)
      }

      try {
        return text ? JSON.parse(text) : null
      } catch {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      if (error.status || error.message === 'Invalid response from server') throw error
      if (!isLastAttempt) {
        await sleep(RETRY_DELAYS_MS[attempt])
        continue
      }
      if (error.name === 'AbortError') {
        throw new Error('The server is taking too long to respond. Please try again.')
      }
      throw new Error('Network error. Please check your connection and try again.')
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

const inflight = new Map()

// cacheMode: false (no cache), true (short in-memory cache) or
// 'swr' (persisted; stale data is returned at once and refreshed in the background)
const apiCall = async (endpoint, options = {}, cacheMode = false) => {
  const isRead = !options.method || options.method === 'GET'

  if (!isRead) {
    const result = await request(endpoint, options, false)
    clearCache(endpoint.split('?')[0].split('/').slice(0, 2).join('/'))
    clearCache('/dashboard')
    return result
  }

  if (!cacheMode) return request(endpoint, options, true)

  const persist = cacheMode === 'swr'
  const maxAge = persist ? CACHE_MAX_AGE.swr : CACHE_MAX_AGE.memory
  const cached = getCached(endpoint, maxAge)

  const load = () => {
    if (!inflight.has(endpoint)) {
      const promise = request(endpoint, options, true)
        .then((data) => {
          setCached(endpoint, data, persist)
          return data
        })
        .finally(() => inflight.delete(endpoint))
      inflight.set(endpoint, promise)
    }
    return inflight.get(endpoint)
  }

  if (cached?.fresh) return cached.data
  if (cached && persist) {
    load().catch(() => {})
    return cached.data
  }
  return load()
}

// Wakes the backend early so the first real request doesn't wait for a cold start
export const warmUpBackend = () => {
  fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {})
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
  create: (formData) => apiCall('/products', {
    method: 'POST',
    body: formData
  }),

  update: (id, formData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: formData
  }),

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
  })
}

// Governorate Shipping APIs (with caching)
export const governorateShippingAPI = {
  getAll: () => apiCall('/governorate-shipping', {}, 'swr'),
  getByGovernorate: (governorate) => {
    // URL encode to handle spaces and special characters
    const encoded = encodeURIComponent(governorate)
    return apiCall(`/governorate-shipping/${encoded}`, {}, 'swr')
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
  getStore: () => apiCall('/settings/store', {}, 'swr'),
  update: (type, data) => apiCall(`/settings/${type}`, {
    method: 'PUT',
    body: JSON.stringify({ data })
  })
}

// Public Products API (for frontend - with caching)
export const publicProductsAPI = {
  getAll: () => apiCall('/products', {}, 'swr'),
  getById: (id) => apiCall(`/products/${id}`, {}, 'swr')
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

