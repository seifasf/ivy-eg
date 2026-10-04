import React from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../services/api'
import { hasDiscount, discountPercent, formatEGP, handleImageError, isSoldOut } from '../utils/product'
import './ProductCard.css'

const MAX_SWATCHES = 5

function ProductCard({ product, eager = false }) {
  const secondImage = product.images?.[0]
  const colors = product.colors || []
  const soldOut = isSoldOut(product)

  return (
    <Link to={`/products/${product._id}`} className={`pcard ${soldOut ? 'is-sold-out' : ''}`}>
      <div className="pcard-media">
        <img
          className="pcard-img"
          src={getImageUrl(product.mainImage)}
          alt={product.title}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={handleImageError}
        />
        {secondImage && (
          <img
            className="pcard-img pcard-img--alt"
            src={getImageUrl(secondImage)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.remove() }}
          />
        )}
        <div className="pcard-tags">
          {soldOut ? (
            <span className="pcard-tag">Sold out</span>
          ) : hasDiscount(product) && (
            <span className="pcard-tag pcard-tag--sale">−{discountPercent(product)}%</span>
          )}
        </div>
        <span className="pcard-cta" aria-hidden="true">
          {soldOut ? 'View' : product.sizes?.length ? 'Choose size' : 'View product'}
        </span>
      </div>

      <div className="pcard-body">
        <div className="pcard-row">
          <h3 className="pcard-title">{product.title}</h3>
          <p className="pcard-price price">
            {hasDiscount(product) ? (
              <>
                <span className="price--sale">{formatEGP(product.discountPrice)}</span>
                <span className="price--was">{formatEGP(product.price)}</span>
              </>
            ) : (
              formatEGP(product.price)
            )}
          </p>
        </div>
        <div className="pcard-meta">
          <span className="pcard-category">{product.category}</span>
          {colors.length > 0 && (
            <span className="pcard-swatches" aria-label={`${colors.length} colors`}>
              {colors.slice(0, MAX_SWATCHES).map(color => (
                <span
                  key={color.name}
                  className="pcard-swatch"
                  style={color.hex ? { background: color.hex } : undefined}
                  title={color.name}
                />
              ))}
              {colors.length > MAX_SWATCHES && <span className="pcard-more">+{colors.length - MAX_SWATCHES}</span>}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
