// Debug utility to clear cache and check API connectivity
import { clearCache } from '../services/api'

export const clearAllCache = () => {
  clearCache()
  localStorage.setItem('cacheCleared', Date.now().toString())
}

export const checkAPIHealth = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
  
  try {
    const response = await fetch(`${API_BASE_URL}/products`)
    
    if (response.ok) {
      const data = await response.json()
      return { healthy: true, data }
    } else {
      const errorText = await response.text()
      return { healthy: false, error: errorText }
    }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.debugCache = { clearAllCache, checkAPIHealth }
}

