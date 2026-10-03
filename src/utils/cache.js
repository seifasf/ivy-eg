// API response cache: in memory, optionally mirrored to localStorage so repeat
// visits render instantly while fresh data loads in the background.
const cache = new Map()
const STORAGE_PREFIX = 'ivy-cache:'
const MAX_STALE_AGE = 24 * 60 * 60 * 1000

const readStorage = (key) => {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const getEntry = (key) => {
  let entry = cache.get(key)
  if (!entry) {
    entry = readStorage(key)
    if (entry) cache.set(key, entry)
  }
  if (!entry) return null
  if (Date.now() - entry.timestamp > MAX_STALE_AGE) {
    clearCache(key)
    return null
  }
  return entry
}

// Returns { data, fresh } or null
export const getCached = (key, maxAge) => {
  const entry = getEntry(key)
  if (!entry) return null
  return { data: entry.data, fresh: Date.now() - entry.timestamp <= maxAge }
}

export const setCached = (key, data, persist = false) => {
  const entry = { data, timestamp: Date.now() }
  cache.set(key, entry)
  if (persist) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
    } catch {
      // Storage full or disabled: the in-memory copy is enough
    }
  }
}

export const clearCache = (pattern) => {
  for (const key of [...cache.keys()]) {
    if (!pattern || key.includes(pattern)) cache.delete(key)
  }
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(STORAGE_PREFIX) && (!pattern || key.includes(pattern))) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // localStorage unavailable
  }
}
