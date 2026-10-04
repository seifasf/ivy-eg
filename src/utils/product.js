export const FALLBACK_IMAGE = '/IMGs/IVY-03.png'

export const hasDiscount = (product) =>
  product.discountPrice > 0 && product.discountPrice < product.price

export const effectivePrice = (product) =>
  hasDiscount(product) ? product.discountPrice : product.price

export const discountPercent = (product) =>
  hasDiscount(product) ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0

export const formatEGP = (value) => `${Number(value || 0).toLocaleString('en-EG')} EGP`

export const handleImageError = (e) => {
  if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) {
    e.currentTarget.src = FALLBACK_IMAGE
    e.currentTarget.classList.add('is-fallback')
  }
}
