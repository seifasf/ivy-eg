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
import { productsAPI } from '../../services/api'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    sizes: [],
    mainImage: null,
    additionalImages: [],
    inStock: true
  })
  const [imageFiles, setImageFiles] = useState({
    mainImage: null,
    additionalImages: []
  })
  const [imagePreviews, setImagePreviews] = useState({
    mainImage: null,
    additionalImages: []
  })

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

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      stock: '',
      sizes: [],
      inStock: true
    })
    setImageFiles({ mainImage: null, additionalImages: [] })
    setImagePreviews({ mainImage: null, additionalImages: [] })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice.toString(),
      category: product.category,
      stock: product.stock.toString(),
      sizes: product.sizes || [],
      inStock: product.inStock
    })
    // Show existing images as previews
    setImagePreviews({
      mainImage: `http://localhost:5001/uploads/${product.mainImage}`,
      additionalImages: product.images.map(img => `http://localhost:5001/uploads/${img}`)
    })
    setImageFiles({ mainImage: null, additionalImages: [] })
    setShowModal(true)
  }

  const closeModal = () => {
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
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFiles(prev => ({ ...prev, mainImage: file }))
      setImagePreviews(prev => ({ ...prev, mainImage: URL.createObjectURL(file) }))
    }
  }

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setImageFiles(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...files]
      }))
      const previews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...previews]
      }))
    }
  }

  const removeAdditionalImage = (index) => {
    setImageFiles(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('discountPrice', formData.discountPrice)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('inStock', formData.inStock)
      
      // Sizes array
      formData.sizes.forEach(size => {
        formDataToSend.append('sizes', size)
      })

      // Images
      if (imageFiles.mainImage) {
        formDataToSend.append('mainImage', imageFiles.mainImage)
      }
      imageFiles.additionalImages.forEach(file => {
        formDataToSend.append('images', file)
      })

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formDataToSend)
      } else {
        if (!imageFiles.mainImage) {
          setError('Main image is required')
          setLoading(false)
          return
        }
        await productsAPI.create(formDataToSend)
      }

      await fetchProducts()
      closeModal()
    } catch (error) {
      console.error('Error saving product:', error)
      setError(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true)
        await productsAPI.delete(productId)
        await fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        setError('Failed to delete product')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleActive = async (product) => {
    try {
      const formData = new FormData()
      formData.append('inStock', !product.inStock)
      await productsAPI.update(product._id, formData)
      await fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      setError('Failed to update product status')
    }
  }

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
      {loading && <div className="loading">Loading products...</div>}
      
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
                    src={`http://localhost:5001/uploads/${product.mainImage}`} 
                    alt={product.title} 
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
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map(size => (
                      <div key={size} className="size-badge">
                        {size}
                      </div>
                    ))
                  ) : (
                    <span className="no-sizes">No sizes specified</span>
                  )}
                </div>
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
              {error && <div className="error-message">{error}</div>}
              
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
                      rows="3"
                      placeholder="Product description..."
                    />
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
                    <label>Discounted Price (EGP) *</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="249"
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
                      placeholder="50"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Available Sizes</label>
                    <div className="sizes-checkboxes">
                      {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
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
                </div>
              </div>

              {/* Images */}
              <div className="form-section">
                <h3>Product Images</h3>
                
                {/* Main Image */}
                <div className="form-group">
                  <label>Main Image * {editingProduct && '(Leave empty to keep current)'}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    required={!editingProduct}
                  />
                  {imagePreviews.mainImage && (
                    <div className="image-preview-single">
                      <img src={imagePreviews.mainImage} alt="Main preview" />
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                <div className="form-group">
                  <label>Additional Images (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                  {imagePreviews.additionalImages.length > 0 && (
                    <div className="images-preview-grid">
                      {imagePreviews.additionalImages.map((preview, index) => (
                        <div key={index} className="image-preview">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={() => removeAdditionalImage(index)}
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
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
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

