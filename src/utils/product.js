export const FALLBACK_IMAGE = '/IMGs/IVY-03.png'

export const hasDiscount = (product) =>
  product.discountPrice > 0 && product.discountPrice < product.price

export const effectivePrice = (product) =>
  hasDiscount(product) ? product.discountPrice : product.price

export const discountPercent = (product) =>
  hasDiscount(product) ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0

// Products that track units per size are limited by that size; others by total stock.
// Returns Infinity when the backend doesn't report stock.
export const unitsAvailable = (product, size) => {
  if (product.sizeStock?.length) {
    return product.sizeStock.find(line => line.size === size)?.stock ?? 0
  }
  return typeof product.stock === 'number' ? Math.max(product.stock, 0) : Infinity
}

export const isSoldOut = (product) =>
  !product.inStock || (typeof product.stock === 'number' && product.stock <= 0)

export const formatEGP = (value) => `${Number(value || 0).toLocaleString('en-EG')} EGP`

export const handleImageError = (e) => {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
    e.currentTarget.src = FALLBACK_IMAGE
    e.currentTarget.classList.add('is-fallback')
  }
}
