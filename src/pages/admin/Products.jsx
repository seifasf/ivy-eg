import React, { useState, useEffect } from 'react'
import {
  HiPlus,
  HiSearch,
  HiPencil,
  HiTrash,
  HiX,
  HiPhotograph,
  HiEye,
  HiEyeOff
} from 'react-icons/hi'
import { productsAPI, getImageUrl } from '../../services/api'
import { prepareImage, MAX_UPLOAD_BYTES } from '../../utils/imageCompress'
import './Products.css'

const MAX_EXTRA_IMAGES = 10
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const LOW_STOCK = 3
const MAX_DESCRIPTION = 5000
const FALLBACK_IMAGE = '/IMGs/IVY-03.png'
const MAX_COLORS = 20
const COLOR_PRESETS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#8a8a8a' },
  { name: 'Navy', hex: '#1f2a44' },
  { name: 'Olive', hex: '#5b5f3a' },
  { name: 'Beige', hex: '#d9c8a9' }
]

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discountPrice: '',
  costPrice: '',
  category: '',
  stock: '',
  sizes: [],
  // units per selected size, kept as input strings: { M: '12' }
  sizeStock: {},
  colors: [],
  inStock: true
}

const toNumber = (value) => {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

const salePriceOf = (price, discountPrice) => {
  const sale = toNumber(discountPrice)
  return discountPrice !== '' && sale > 0 && sale < toNumber(price) ? sale : toNumber(price)
}

const allocatedUnits = (sizes, sizeStock) =>
  sizes.reduce((sum, size) => sum + (parseInt(sizeStock[size], 10) || 0), 0)

const revoke = (url) => {
  if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
}

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preparingImages, setPreparingImages] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  // mainImage: { file, preview }; existingImages: filenames already on the product;
  // newImages: [{ file, preview }] picked in this session
  const [mainImage, setMainImage] = useState(null)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [customColor, setCustomColor] = useState({ name: '', hex: '#000000' })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productsAPI.getAll()
      setProducts(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetImages = () => {
    revoke(mainImage?.preview)
    newImages.forEach(img => revoke(img.preview))
    setMainImage(null)
    setExistingImages([])
    setNewImages([])
  }

  const openAddModal = () => {
    resetImages()
    setEditingProduct(null)
    setFormData(emptyForm)
    setError(null)
    setShowModal(true)
  }

  const openEditModal = (product) => {
    resetImages()
    setEditingProduct(product)
    const hasDiscount = product.discountPrice < product.price
    const sizes = (product.sizes || []).filter(size => SIZE_OPTIONS.includes(size))
    const savedUnits = Object.fromEntries((product.sizeStock || []).map(line => [line.size, String(line.stock)]))
    setFormData({
      title: product.title,
      description: product.description,
      price: String(product.price),
      discountPrice: hasDiscount ? String(product.discountPrice) : '',
      costPrice: product.costPrice ? String(product.costPrice) : '',
      category: product.category,
      stock: String(product.stock),
      sizes,
      sizeStock: Object.fromEntries(sizes.map(size => [size, savedUnits[size] ?? ''])),
      colors: product.colors || [],
      inStock: product.inStock
    })
    setMainImage({ file: null, preview: getImageUrl(product.mainImage) })
    setExistingImages(product.images || [])
    setError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return
    resetImages()
    setShowModal(false)
    setEditingProduct(null)
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const removing = prev.sizes.includes(size)
      const sizeStock = { ...prev.sizeStock }
      if (removing) delete sizeStock[size]
      else sizeStock[size] = ''
      return {
        ...prev,
        sizes: removing
          ? prev.sizes.filter(s => s !== size)
          : SIZE_OPTIONS.filter(s => s === size || prev.sizes.includes(s)),
        sizeStock
      }
    })
  }

  const handleSizeUnitsChange = (size, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    setFormData(prev => ({ ...prev, sizeStock: { ...prev.sizeStock, [size]: value } }))
  }

  const splitEvenly = () => {
    setFormData(prev => {
      const total = parseInt(prev.stock, 10) || 0
      const count = prev.sizes.length
      if (!count) return prev
      const base = Math.floor(total / count)
      const extra = total % count
      return {
        ...prev,
        sizeStock: Object.fromEntries(prev.sizes.map((size, i) => [size, String(base + (i < extra ? 1 : 0))]))
      }
    })
  }

  const hasColor = (name) =>
    formData.colors.some(c => c.name.toLowerCase() === name.trim().toLowerCase())

  const addColor = (color) => {
    const name = color.name.trim()
    if (!name || hasColor(name) || formData.colors.length >= MAX_COLORS) return
    setFormData(prev => ({ ...prev, colors: [...prev.colors, { name, hex: color.hex || '' }] }))
  }

  const togglePresetColor = (preset) => {
    if (hasColor(preset.name)) removeColor(preset.name)
    else addColor(preset)
  }

  const removeColor = (name) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c.name !== name) }))
  }

  const addCustomColor = () => {
    addColor(customColor)
    setCustomColor(prev => ({ ...prev, name: '' }))
  }

  const prepareFiles = async (files) => {
    const prepared = []
    for (const file of files) {
      const ready = await prepareImage(file)
      if (ready.size > MAX_UPLOAD_BYTES) {
        throw new Error(`"${file.name}" is larger than 10MB even after compression`)
      }
      prepared.push(ready)
    }
    return prepared
  }

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    setPreparingImages(true)
    try {
      const [ready] = await prepareFiles([file])
      revoke(mainImage?.preview)
      setMainImage({ file: ready, preview: URL.createObjectURL(ready) })
    } catch (err) {
      setError(err.message)
    } finally {
      setPreparingImages(false)
    }
  }

  const handleAdditionalImagesChange = async (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    if (files.length === 0) return
    setError(null)

    const slots = MAX_EXTRA_IMAGES - existingImages.length - newImages.length
    if (files.length > slots) {
      setError(`A product can have up to ${MAX_EXTRA_IMAGES} extra images (${Math.max(slots, 0)} more allowed)`)
      return
    }

    setPreparingImages(true)
    try {
      const ready = await prepareFiles(files)
      setNewImages(prev => [...prev, ...ready.map(file => ({ file, preview: URL.createObjectURL(file) }))])
    } catch (err) {
      setError(err.message)
    } finally {
      setPreparingImages(false)
    }
  }

  const removeExistingImage = (filename) => {
    setExistingImages(prev => prev.filter(img => img !== filename))
  }

  const removeNewImage = (index) => {
    setNewImages(prev => {
      revoke(prev[index]?.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const price = parseFloat(formData.price)
    const sale = formData.discountPrice === '' ? null : parseFloat(formData.discountPrice)
    if (sale !== null && sale > price) {
      setError('Sale price must be lower than the original price')
      return
    }
    if (!editingProduct && !mainImage?.file) {
      setError('Main image is required')
      return
    }
    const totalStock = parseInt(formData.stock, 10) || 0
    const allocated = allocatedUnits(formData.sizes, formData.sizeStock)
    if (formData.sizes.length > 0 && allocated !== totalStock) {
      setError(`Units per size add up to ${allocated}, but total stock is ${totalStock}. They must match.`)
      return
    }

    setSaving(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('price', formData.price)
      formDataToSend.append('discountPrice', sale === null ? '' : formData.discountPrice)
      formDataToSend.append('category', formData.category.trim())
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('inStock', formData.inStock)
      formDataToSend.append('costPrice', formData.costPrice === '' ? '0' : formData.costPrice)
      formDataToSend.append('sizes', JSON.stringify(formData.sizes))
      formDataToSend.append('sizeStock', JSON.stringify(
        formData.sizes.map(size => ({ size, stock: parseInt(formData.sizeStock[size], 10) || 0 }))
      ))
      formDataToSend.append('colors', JSON.stringify(formData.colors))

      if (mainImage?.file) {
        formDataToSend.append('mainImage', mainImage.file)
      }
      newImages.forEach(img => formDataToSend.append('images', img.file))

      if (editingProduct) {
        formDataToSend.append('oldImages', JSON.stringify(existingImages))
        await productsAPI.update(editingProduct._id, formDataToSend)
      } else {
        await productsAPI.create(formDataToSend)
      }

      resetImages()
      setShowModal(false)
      setEditingProduct(null)
      await fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error.message || 'Failed to save product. Please check all fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        setLoading(true)
        await productsAPI.delete(productId)
        await fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        setError(error.message || 'Failed to delete product. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleActive = async (product) => {
    const next = !product.inStock
    setProducts(prev => prev.map(p => (p._id === product._id ? { ...p, inStock: next } : p)))
    try {
      const formData = new FormData()
      formData.append('inStock', next)
      await productsAPI.update(product._id, formData)
    } catch (error) {
      console.error('Error updating product:', error)
      setProducts(prev => prev.map(p => (p._id === product._id ? { ...p, inStock: product.inStock } : p)))
      setError(error.message || 'Failed to update product status. Please try again.')
    }
  }

  const sizeMismatch = formData.sizes.length > 0 &&
    allocatedUnits(formData.sizes, formData.sizeStock) !== (parseInt(formData.stock, 10) || 0)

  const calculateDiscount = (price, discountPrice) => {
    if (discountPrice >= price) return 0
    return Math.round(((price - discountPrice) / price) * 100)
  }

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Management</h1>
          <p className="admin-page-subtitle">Add, edit, and manage your products</p>
        </div>
        <button className="btn-add-product" onClick={openAddModal}>
          <HiPlus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="products-controls">
        <div className="search-box">
          <HiSearch size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="products-stats">
          <span>Total: {products.length}</span>
          <span>In Stock: {products.filter(p => p.inStock).length}</span>
          <span>Out of Stock: {products.filter(p => !p.inStock).length}</span>
        </div>
      </div>

      {/* Products Grid */}
      {error && <div className="error-message">{error}</div>}
      {loading && products.length === 0 && <div className="loading">Loading products...</div>}
      
      <div className="products-grid">
        {filteredProducts.length === 0 && !loading ? (
          <div className="no-products">
            <p>No products found</p>
            <button className="btn-add-first" onClick={openAddModal}>
              <HiPlus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className={`product-card ${!product.inStock ? 'inactive' : ''}`}>
              <div className="product-image-wrapper">
                {product.mainImage ? (
                  <img 
                    src={getImageUrl(product.mainImage)} 
                    alt={product.title} 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <HiPhotograph size={40} />
                  </div>
                )}
                {!product.inStock && <div className="inactive-overlay">OUT OF STOCK</div>}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-category">{product.category}</p>
                
                <div className="product-pricing">
                  {product.discountPrice < product.price ? (
                    <>
                      <span className="original-price">{product.price.toLocaleString()} EGP</span>
                      <span className="final-price">
                        {product.discountPrice.toLocaleString()} EGP
                      </span>
                      <span className="discount-badge">
                        -{calculateDiscount(product.price, product.discountPrice)}%
                      </span>
                    </>
                  ) : (
                    <span className="final-price">{product.price.toLocaleString()} EGP</span>
                  )}
                </div>

                <div className="product-stock">
                  <span className="stock-label">Total Stock:</span>
                  <span className={`stock-value ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock} items
                  </span>
                </div>

                <div className="product-sizes">
                  {product.sizeStock?.length > 0 ? (
                    product.sizeStock.map(line => (
                      <div
                        key={line.size}
                        className={`size-badge ${line.stock === 0 ? 'is-empty' : line.stock <= LOW_STOCK ? 'is-low' : ''}`}
                        title={`${line.stock} left in ${line.size}`}
                      >
                        {line.size} · {line.stock}
                      </div>
                    ))
                  ) : product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map(size => (
                      <div key={size} className="size-badge">
                        {size}
                      </div>
                    ))
                  ) : (
                    <span className="no-sizes">No sizes specified</span>
                  )}
                </div>

                <div className="product-margin">
                  {product.costPrice > 0 ? (() => {
                    const sale = product.discountPrice < product.price ? product.discountPrice : product.price
                    const profit = sale - product.costPrice
                    return (
                      <>
                        <span>Cost {product.costPrice.toLocaleString()} EGP</span>
                        <span className={profit < 0 ? 'is-loss' : 'is-profit'}>
                          {profit >= 0 ? '+' : ''}{profit.toLocaleString()} EGP / piece
                        </span>
                      </>
                    )
                  })() : (
                    <span className="is-missing">No cost set: edit to add it</span>
                  )}
                </div>

                {product.colors?.length > 0 && (
                  <div className="admin-color-dots">
                    {product.colors.map(color => (
                      <span
                        key={color.name}
                        className="admin-color-dot"
                        style={color.hex ? { background: color.hex } : undefined}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button 
                  className={`btn-toggle ${product.inStock ? 'active' : 'inactive'}`}
                  onClick={() => toggleActive(product)}
                >
                  {product.inStock ? <HiEye size={18} /> : <HiEyeOff size={18} />}
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
                <button className="btn-edit" onClick={() => openEditModal(product)}>
                  <HiPencil size={18} />
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                  <HiTrash size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <HiX size={24} />
              </button>
            </div>

            <form className="modal-body product-form" onSubmit={handleSubmit}>
              {error && <div className="error-message" role="alert">{error}</div>}

              {/* Basic Info */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      maxLength={150}
                      placeholder="e.g., Premium T-Shirt"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      maxLength={60}
                      placeholder="e.g., T-Shirts, Hoodies"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="6"
                      maxLength={MAX_DESCRIPTION}
                      placeholder={'Fabric, fit and care, e.g.\n100% cotton, 240 GSM\nRelaxed fit, true to size\nMachine wash cold'}
                    />
                    <p className="input-note">
                      Shown on the product page; new lines are kept. {formData.description.length}/{MAX_DESCRIPTION}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section">
                <h3>Pricing</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Original Price (EGP) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="299"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sale Price (EGP) — optional</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      min="0"
                      max={formData.price || undefined}
                      step="0.01"
                      placeholder="Leave empty for no discount"
                    />
                  </div>

                  {formData.price && formData.discountPrice && parseFloat(formData.discountPrice) < parseFloat(formData.price) && (
                    <div className="form-group">
                      <label>Discount</label>
                      <div className="final-price-display">
                        {calculateDiscount(parseFloat(formData.price), parseFloat(formData.discountPrice))}% OFF
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Cost per piece (EGP) *</label>
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="What one piece costs you"
                    />
                    <p className="input-note">Private: only admins see this. Used for profit analytics.</p>
                  </div>

                  {formData.price && formData.costPrice !== '' && (() => {
                    const sale = salePriceOf(formData.price, formData.discountPrice)
                    const profit = sale - toNumber(formData.costPrice)
                    const margin = sale > 0 ? Math.round((profit / sale) * 100) : 0
                    return (
                      <div className="form-group">
                        <label>Profit per piece</label>
                        <div className={`final-price-display ${profit < 0 ? 'is-loss' : ''}`}>
                          {profit.toLocaleString()} EGP · {margin}% margin
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Stock & Sizes */}
              <div className="form-section">
                <h3>Stock & Sizes</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Total Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      step="1"
                      placeholder="50"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Available Sizes</label>
                    <div className="sizes-checkboxes">
                      {SIZE_OPTIONS.map(size => (
                        <label key={size} className="size-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeToggle(size)}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.sizes.length > 0 && (() => {
                    const total = parseInt(formData.stock, 10) || 0
                    const allocated = allocatedUnits(formData.sizes, formData.sizeStock)
                    const remaining = total - allocated
                    return (
                      <div className="form-group full-width">
                        <div className="size-stock-head">
                          <label>Units per size</label>
                          <button type="button" className="size-stock-split" onClick={splitEvenly} disabled={!total}>
                            Split evenly
                          </button>
                        </div>
                        <div className="size-stock-grid">
                          {formData.sizes.map(size => (
                            <label key={size} className="size-stock-field">
                              <span>{size}</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={formData.sizeStock[size] ?? ''}
                                onChange={(e) => handleSizeUnitsChange(size, e.target.value)}
                                placeholder="0"
                                aria-label={`Units in size ${size}`}
                              />
                            </label>
                          ))}
                        </div>
                        <p className={`size-stock-status ${remaining === 0 ? 'is-ok' : 'is-off'}`} role="status">
                          {allocated} of {total} units assigned
                          {remaining > 0 && ` · ${remaining} still to assign`}
                          {remaining < 0 && ` · ${-remaining} too many`}
                          {remaining === 0 && ' · matches total stock'}
                        </p>
                      </div>
                    )
                  })()}

                  <div className="form-group full-width">
                    <label>Colors (optional — shoppers must pick one if you add any)</label>
                    <div className="admin-color-presets">
                      {COLOR_PRESETS.map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          className={`admin-color-chip ${hasColor(preset.name) ? 'selected' : ''}`}
                          onClick={() => togglePresetColor(preset)}
                          aria-pressed={hasColor(preset.name)}
                        >
                          <span className="admin-color-dot" style={{ background: preset.hex }} />
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <div className="admin-color-custom">
                      <input
                        type="color"
                        value={customColor.hex}
                        onChange={(e) => setCustomColor(prev => ({ ...prev, hex: e.target.value }))}
                        aria-label="Custom color"
                      />
                      <input
                        type="text"
                        value={customColor.name}
                        onChange={(e) => setCustomColor(prev => ({ ...prev, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCustomColor()
                          }
                        }}
                        maxLength={40}
                        placeholder="Custom color name, e.g. Burgundy"
                      />
                      <button
                        type="button"
                        className="admin-color-add"
                        onClick={addCustomColor}
                        disabled={!customColor.name.trim() || hasColor(customColor.name) || formData.colors.length >= MAX_COLORS}
                      >
                        <HiPlus size={16} /> Add
                      </button>
                    </div>

                    {formData.colors.length > 0 && (
                      <div className="admin-color-selected">
                        {formData.colors.map(color => (
                          <span key={color.name} className="admin-color-chip selected">
                            <span
                              className="admin-color-dot"
                              style={color.hex ? { background: color.hex } : undefined}
                            />
                            {color.name}
                            <button
                              type="button"
                              onClick={() => removeColor(color.name)}
                              aria-label={`Remove ${color.name}`}
                            >
                              <HiX size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="form-section">
                <h3>Product Images</h3>
                
                {/* Main Image */}
                <div className="form-group">
                  <label>Main Image * {editingProduct && '(choose a file only to replace it)'}</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
                    onChange={handleMainImageChange}
                    disabled={preparingImages || saving}
                  />
                  {mainImage?.preview && (
                    <div className="image-preview-single">
                      <img
                        src={mainImage.preview}
                        alt="Main preview"
                        onError={(e) => {
                          if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                <div className="form-group">
                  <label>
                    Additional Images (optional, {existingImages.length + newImages.length}/{MAX_EXTRA_IMAGES})
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    disabled={preparingImages || saving || existingImages.length + newImages.length >= MAX_EXTRA_IMAGES}
                  />
                  {preparingImages && <p className="input-note">Optimizing images…</p>}
                  {(existingImages.length > 0 || newImages.length > 0) && (
                    <div className="images-preview-grid">
                      {existingImages.map(filename => (
                        <div key={filename} className="image-preview">
                          <img src={getImageUrl(filename)} alt="Product" loading="lazy" />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={() => removeExistingImage(filename)}
                            aria-label="Remove image"
                          >
                            <HiX size={16} />
                          </button>
                        </div>
                      ))}
                      {newImages.map((img, index) => (
                        <div key={img.preview} className="image-preview">
                          <img src={img.preview} alt={`New image ${index + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={() => removeNewImage(index)}
                            aria-label="Remove image"
                          >
                            <HiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* In Stock Status */}
              <div className="form-section">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  <label htmlFor="inStock">
                    Product is in stock and available for purchase
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={saving || preparingImages || sizeMismatch}>
                  {saving ? 'Saving...' : preparingImages ? 'Optimizing images…' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

