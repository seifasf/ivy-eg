import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { publicProductsAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import { effectivePrice } from '../utils/product'
import './Shop.css'

const SORTS = {
  newest: { label: 'Newest', compare: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) },
  'price-asc': { label: 'Price: low to high', compare: (a, b) => effectivePrice(a) - effectivePrice(b) },
  'price-desc': { label: 'Price: high to low', compare: (a, b) => effectivePrice(b) - effectivePrice(a) }
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  const selectedCategory = searchParams.get('category') || 'all'
  const sort = SORTS[searchParams.get('sort')] ? searchParams.get('sort') : 'newest'

  const fetchProducts = async () => {
    setStatus('loading')
    try {
      const data = await publicProductsAPI.getAll()
      setProducts(Array.isArray(data) ? data.filter(p => p.inStock) : [])
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const categories = useMemo(
    () => ['all', ...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  )

  const visibleProducts = useMemo(() => {
    const list = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory)
    return [...list].sort(SORTS[sort].compare)
  }, [products, selectedCategory, sort])

  const updateParam = (key, value, fallback) => {
    const next = new URLSearchParams(searchParams)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="shop">
      <header className="shop-head container">
        <p className="eyebrow">IVY · Shop</p>
        <h1 className="display shop-title">
          {selectedCategory === 'all' ? 'The collection' : selectedCategory}
        </h1>
      </header>

      <div className="shop-toolbar-wrap">
        <div className="shop-toolbar container">
          <div className="shop-filters" role="tablist" aria-label="Categories">
            {categories.length > 1 && categories.map(category => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                className={`shop-chip ${selectedCategory === category ? 'is-active' : ''}`}
                onClick={() => updateParam('category', category, 'all')}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
          <div className="shop-toolbar-end">
            {status === 'ready' && (
              <span className="shop-count">
                {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'items'}
              </span>
            )}
            <label className="shop-sort">
              <span className="visually-hidden">Sort by</span>
              <select value={sort} onChange={(e) => updateParam('sort', e.target.value, 'newest')}>
                {Object.entries(SORTS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        {status === 'loading' ? (
          <div className="pcard-grid" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="shop-skel">
                <div className="shop-skel-media" />
                <div className="shop-skel-line" />
                <div className="shop-skel-line shop-skel-line--short" />
              </div>
            ))}
          </div>
        ) : status === 'error' ? (
          <div className="shop-empty">
            <h2 className="display shop-empty-title">Couldn't load products</h2>
            <p>Check your connection and try again.</p>
            <button type="button" className="btn btn--primary" onClick={fetchProducts}>Try again</button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="shop-empty">
            <h2 className="display shop-empty-title">
              {selectedCategory === 'all' ? 'New drop coming soon' : 'Nothing here yet'}
            </h2>
            <p>
              {selectedCategory === 'all'
                ? 'Follow @ivywear.eg to be first to know.'
                : 'No products in this category right now.'}
            </p>
            {selectedCategory !== 'all' && (
              <button type="button" className="btn btn--ghost" onClick={() => updateParam('category', 'all', 'all')}>
                View all products
              </button>
            )}
          </div>
        ) : (
          <div className="pcard-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} eager={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
