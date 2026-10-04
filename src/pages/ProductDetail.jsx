import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HiMinus, HiPlus, HiCheck, HiTruck, HiCash, HiArrowLeft } from 'react-icons/hi'
import { publicProductsAPI, getImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import {
  effectivePrice,
  hasDiscount,
  discountPercent,
  formatEGP,
  handleImageError
} from '../utils/product'
import './ProductDetail.css'

const MAX_QUANTITY = 10
const SIZE_PATTERN = /^[A-Z0-9][A-Z0-9 ./-]{0,19}$/i

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showErrors, setShowErrors] = useState(false)
  const [added, setAdded] = useState(false)
  const galleryRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setActiveImage(0)
    setSelectedSize('')
    setQuantity(1)
    setShowErrors(false)
    setAdded(false)
    window.scrollTo(0, 0)

    const load = async () => {
      try {
        // The product list is usually cached already, so the page renders instantly
        const list = await publicProductsAPI.getAll()
        let found = Array.isArray(list) ? list.find(p => p._id === id) : null
        if (!found) found = await publicProductsAPI.getById(id)
        if (cancelled) return
        setAllProducts(Array.isArray(list) ? list : [])
        setProduct(found)
        setSelectedColor(found.colors?.length === 1 ? found.colors[0].name : '')
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('missing')
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (product) document.title = `${product.title} · IVY`
    return () => { document.title = 'IVY - Your Everyday Wingman' }
  }, [product])

  const images = useMemo(
    () => (product ? [product.mainImage, ...(product.images || [])].filter(Boolean) : []),
    [product]
  )

  const related = useMemo(() => {
    if (!product) return []
    const others = allProducts.filter(p => p._id !== product._id && p.inStock)
    const sameCategory = others.filter(p => p.category === product.category)
    return [...sameCategory, ...others.filter(p => p.category !== product.category)].slice(0, 4)
  }, [allProducts, product])

  if (status === 'loading') {
    return (
      <div className="pdp container" aria-busy="true">
        <div className="pdp-layout">
          <div className="pdp-gallery"><div className="pdp-main pdp-skel" /></div>
          <div className="pdp-info">
            <div className="pdp-skel pdp-skel-line" style={{ width: '40%' }} />
            <div className="pdp-skel pdp-skel-line pdp-skel--xl" style={{ width: '80%' }} />
            <div className="pdp-skel pdp-skel-line" style={{ width: '30%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'missing' || !product) {
    return (
      <div className="pdp container pdp-missing">
        <p className="eyebrow">404</p>
        <h1 className="display pdp-missing-title">Product not found</h1>
        <p className="pdp-muted">It may have sold out or been removed.</p>
        <Link to="/products" className="btn btn--primary">Back to shop</Link>
      </div>
    )
  }

  const colors = product.colors || []
  const sizes = (product.sizes || []).filter(size => SIZE_PATTERN.test(size))
  const soldOut = !product.inStock
  const needsColor = colors.length > 0 && !selectedColor
  const needsSize = sizes.length > 0 && !selectedSize
  const price = effectivePrice(product)

  const addSelection = () => {
    if (needsColor || needsSize) {
      setShowErrors(true)
      return false
    }
    addToCart(
      {
        id: product._id,
        name: product.title,
        price,
        image: getImageUrl(product.mainImage),
        selectedSize: selectedSize || undefined,
        selectedColor: selectedColor || undefined
      },
      quantity
    )
    return true
  }

  const handleAdd = () => {
    if (addSelection()) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    }
  }

  const handleBuyNow = () => {
    if (addSelection()) navigate('/checkout')
  }

  const showImage = (index) => {
    setActiveImage(index)
    const track = galleryRef.current
    if (track) track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' })
  }

  const handleGalleryScroll = (e) => {
    const track = e.currentTarget
    const index = Math.round(track.scrollLeft / track.clientWidth)
    if (index !== activeImage) setActiveImage(index)
  }

  return (
    <div className="pdp">
      <div className="container">
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <button type="button" className="pdp-back" onClick={() => navigate(-1)} aria-label="Go back">
            <HiArrowLeft size={16} />
          </button>
          <Link to="/products">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        </nav>

        <div className="pdp-layout">
          <section className="pdp-gallery" aria-label="Product images">
            {images.length > 1 && (
              <div className="pdp-thumbs" role="tablist">
                {images.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    role="tab"
                    aria-selected={index === activeImage}
                    aria-label={`Image ${index + 1}`}
                    className={`pdp-thumb ${index === activeImage ? 'is-active' : ''}`}
                    onClick={() => showImage(index)}
                  >
                    <img src={getImageUrl(img)} alt="" loading="lazy" decoding="async" onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}

            <div className="pdp-main">
              <div className="pdp-track" ref={galleryRef} onScroll={handleGalleryScroll}>
                {images.map((img, index) => (
                  <img
                    key={img}
                    className="pdp-image"
                    src={getImageUrl(img)}
                    alt={index === 0 ? product.title : `${product.title}, view ${index + 1}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchpriority={index === 0 ? 'high' : undefined}
                    decoding="async"
                    onError={handleImageError}
                  />
                ))}
              </div>
              {hasDiscount(product) && !soldOut && (
                <span className="pdp-badge">−{discountPercent(product)}%</span>
              )}
              {images.length > 1 && (
                <div className="pdp-dots" aria-hidden="true">
                  {images.map((img, index) => (
                    <span key={img} className={index === activeImage ? 'is-active' : ''} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="pdp-info">
            <p className="eyebrow">{product.category}</p>
            <h1 className="display pdp-title">{product.title}</h1>

            <p className="pdp-price price">
              {hasDiscount(product) ? (
                <>
                  <span className="price--sale">{formatEGP(product.discountPrice)}</span>
                  <span className="price--was">{formatEGP(product.price)}</span>
                </>
              ) : (
                formatEGP(product.price)
              )}
            </p>

            {colors.length > 0 && (
              <fieldset className="pdp-option">
                <legend className="pdp-option-label">
                  Color <span className="pdp-option-value">{selectedColor || 'Select'}</span>
                </legend>
                <div className="pdp-swatches">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      className={`pdp-swatch ${selectedColor === color.name ? 'is-selected' : ''} ${color.hex ? '' : 'pdp-swatch--text'}`}
                      onClick={() => { setSelectedColor(color.name); setShowErrors(false) }}
                      aria-pressed={selectedColor === color.name}
                      aria-label={color.name}
                      title={color.name}
                    >
                      {color.hex ? <span style={{ background: color.hex }} /> : color.name}
                    </button>
                  ))}
                </div>
                {showErrors && needsColor && <p className="pdp-error" role="alert">Please choose a color</p>}
              </fieldset>
            )}

            {sizes.length > 0 && (
              <fieldset className="pdp-option">
                <legend className="pdp-option-label">
                  Size <span className="pdp-option-value">{selectedSize || 'Select'}</span>
                </legend>
                <div className="pdp-sizes">
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      className={`pdp-size ${selectedSize === size ? 'is-selected' : ''}`}
                      onClick={() => { setSelectedSize(size); setShowErrors(false) }}
                      aria-pressed={selectedSize === size}
                      disabled={soldOut}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {showErrors && needsSize && <p className="pdp-error" role="alert">Please choose a size</p>}
              </fieldset>
            )}

            {!soldOut && (
              <div className="pdp-option">
                <span className="pdp-option-label">Quantity</span>
                <div className="pdp-qty">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <HiMinus size={14} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(MAX_QUANTITY, q + 1))}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label="Increase quantity"
                  >
                    <HiPlus size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="pdp-actions">
              {soldOut ? (
                <button type="button" className="btn btn--primary btn--block" disabled>Sold out</button>
              ) : (
                <>
                  <button type="button" className="btn btn--primary btn--block" onClick={handleAdd}>
                    {added ? <><HiCheck size={18} /> Added to bag</> : `Add to bag · ${formatEGP(price * quantity)}`}
                  </button>
                  <button type="button" className="btn btn--ghost btn--block" onClick={handleBuyNow}>
                    Buy now
                  </button>
                </>
              )}
              {added && (
                <Link to="/cart" className="pdp-view-bag">View bag →</Link>
              )}
            </div>

            <ul className="pdp-perks">
              <li><HiCash size={18} /> Cash on delivery available</li>
              <li><HiTruck size={18} /> Delivery fee calculated by governorate at checkout</li>
            </ul>

            {product.description && (
              <div className="pdp-description">
                <h2 className="pdp-section-label">Details</h2>
                <p>{product.description}</p>
              </div>
            )}
          </section>
        </div>

        {related.length > 0 && (
          <section className="pdp-related" aria-labelledby="related-title">
            <div className="pdp-related-head">
              <h2 id="related-title" className="display pdp-related-title">You may also like</h2>
              <Link to="/products" className="pdp-related-link">View all</Link>
            </div>
            <div className="pcard-grid">
              {related.map(item => <ProductCard key={item._id} product={item} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
