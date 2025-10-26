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
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    discountType: 'percentage',
    category: '',
    stock: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    },
    images: [],
    active: true
  })

  // Mock products data
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Premium T-Shirt',
        description: 'High-quality cotton t-shirt with modern fit',
        price: 299,
        discount: 10,
        discountType: 'percentage',
        category: 'T-Shirts',
        stock: { S: 10, M: 15, L: 20, XL: 8 },
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
        active: true
      },
      {
        id: 2,
        name: 'Casual Hoodie',
        description: 'Comfortable hoodie for everyday wear',
        price: 599,
        discount: 50,
        discountType: 'fixed',
        category: 'Hoodies',
        stock: { S: 5, M: 10, L: 15, XL: 5 },
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'],
        active: true
      }
    ]
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '',
      discountType: 'percentage',
      category: '',
      stock: { S: 0, M: 0, L: 0, XL: 0 },
      images: [],
      active: true
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount.toString(),
      discountType: product.discountType,
      category: product.category,
      stock: { ...product.stock },
      images: [...product.images],
      active: product.active
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleStockChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0
      }
    }))
  }

  const handleImageAdd = () => {
    const imageUrl = prompt('Enter image URL:')
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }))
    }
  }

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) || 0,
      id: editingProduct ? editingProduct.id : Date.now()
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productData : p))
    } else {
      setProducts([...products, productData])
    }

    closeModal()
  }

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const toggleActive = (productId) => {
    setProducts(products.map(p =>
      p.id === productId ? { ...p, active: !p.active } : p
    ))
  }

  const calculateFinalPrice = (price, discount, discountType) => {
    if (discountType === 'percentage') {
      return price - (price * discount / 100)
    }
    return price - discount
  }

  const getTotalStock = (stock) => {
    return Object.values(stock).reduce((sum, qty) => sum + qty, 0)
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
          <span>Active: {products.filter(p => p.active).length}</span>
          <span>Inactive: {products.filter(p => !p.active).length}</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
            <button className="btn-add-first" onClick={openAddModal}>
              <HiPlus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className={`product-card ${!product.active ? 'inactive' : ''}`}>
              <div className="product-image-wrapper">
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="no-image">
                    <HiPhotograph size={40} />
                  </div>
                )}
                {!product.active && <div className="inactive-overlay">INACTIVE</div>}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                
                <div className="product-pricing">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">{product.price.toLocaleString()} EGP</span>
                      <span className="final-price">
                        {calculateFinalPrice(product.price, product.discount, product.discountType).toLocaleString()} EGP
                      </span>
                      <span className="discount-badge">
                        {product.discountType === 'percentage' 
                          ? `-${product.discount}%` 
                          : `-${product.discount} EGP`}
                      </span>
                    </>
                  ) : (
                    <span className="final-price">{product.price.toLocaleString()} EGP</span>
                  )}
                </div>

                <div className="product-stock">
                  <span className="stock-label">Total Stock:</span>
                  <span className={`stock-value ${getTotalStock(product.stock) === 0 ? 'out-of-stock' : ''}`}>
                    {getTotalStock(product.stock)} items
                  </span>
                </div>

                <div className="product-sizes">
                  {Object.entries(product.stock).map(([size, qty]) => (
                    <div key={size} className={`size-badge ${qty === 0 ? 'out' : ''}`}>
                      {size}: {qty}
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <button 
                  className={`btn-toggle ${product.active ? 'active' : 'inactive'}`}
                  onClick={() => toggleActive(product.id)}
                >
                  {product.active ? <HiEye size={18} /> : <HiEyeOff size={18} />}
                  {product.active ? 'Active' : 'Inactive'}
                </button>
                <button className="btn-edit" onClick={() => openEditModal(product)}>
                  <HiPencil size={18} />
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(product.id)}>
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
              {/* Basic Info */}
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
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
                    <label>Price (EGP) *</label>
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
                    <label>Discount</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount Type</label>
                    <select name="discountType" value={formData.discountType} onChange={handleChange}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (EGP)</option>
                    </select>
                  </div>

                  {formData.price && formData.discount > 0 && (
                    <div className="form-group">
                      <label>Final Price</label>
                      <div className="final-price-display">
                        {calculateFinalPrice(
                          parseFloat(formData.price) || 0,
                          parseFloat(formData.discount) || 0,
                          formData.discountType
                        ).toLocaleString()} EGP
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock by Size */}
              <div className="form-section">
                <h3>Stock by Size</h3>
                <div className="stock-grid">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <div key={size} className="stock-input-group">
                      <label>{size}</label>
                      <input
                        type="number"
                        value={formData.stock[size]}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                <p className="stock-total">
                  Total Stock: {getTotalStock(formData.stock)} items
                </p>
              </div>

              {/* Images */}
              <div className="form-section">
                <h3>Product Images</h3>
                <div className="images-section">
                  <div className="images-grid">
                    {formData.images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img} alt={`Product ${index + 1}`} />
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => handleImageRemove(index)}
                        >
                          <HiX size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-add-image"
                      onClick={handleImageAdd}
                    >
                      <HiPlus size={24} />
                      <span>Add Image</span>
                    </button>
                  </div>
                  <p className="images-note">
                    Click "Add Image" to enter image URLs. First image will be the main product image.
                  </p>
                </div>
              </div>

              {/* Active Status */}
              <div className="form-section">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <label htmlFor="active">
                    Product is active and visible to customers
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Update Product' : 'Add Product'}
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

