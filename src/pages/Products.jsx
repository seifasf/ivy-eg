import React from 'react'
import './Products.css'

function Products() {

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">Our Collection</h1>
          <p className="products-hero-subtitle">Explore our range of premium products</p>
        </div>
      </section>

      <div className="products-main">
        <div className="filter-bar">
          <h3 className="filter-label">Filter by Category:</h3>
          <div className="filter-chips">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid-container">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => openProductModal(product)}
            >
              <div className="product-card-icon">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-card-img" />
                ) : (
                  <HiShoppingCart size={48} />
                )}
              </div>

              <div className="product-card-body">
                <h3 className="product-card-title">{product.name}</h3>
                <span className="product-card-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductModal}>
              <HiX size={28} />
            </button>

            <div className="modal-content-grid">
              <div className="modal-image-section">
                <div className="image-carousel">
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <>
                      <button className="carousel-btn prev" onClick={prevImage}>
                        ‹
                      </button>
                      <button className="carousel-btn next" onClick={nextImage}>
                        ›
                      </button>
                    </>
                  )}
                  <img 
                    src={selectedProduct.images?.[currentImageIndex] || selectedProduct.image || 'https://via.placeholder.com/800?text=No+Image'} 
                    alt={selectedProduct.name}
                    className="product-modal-image"
                  />
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="image-indicators">
                    {selectedProduct.images.map((_, index) => (
                      <button
                        key={index}
                        className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-details-section">
                <span className="modal-badge">{selectedProduct.category}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-price">{selectedProduct.price}</p>
                <p className="modal-description">{selectedProduct.description}</p>

                <div className="modal-size-selector">
                  <label className="modal-size-label">Select Size: <span className="required-star">*</span></label>
                  <div className="modal-size-options">
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`modal-size-btn ${selectedSize === size ? 'active' : ''} ${sizeError ? 'error-shake' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="size-error-message"> Please select a size before adding to cart</p>
                  )}
                </div>

                <button className="modal-add-to-cart" onClick={handleAddToCart}>
                  <HiShoppingCart size={22} />
                  <span>Add to Cart - {selectedProduct.price}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddToCartNotification 
        show={showNotification}
        onClose={() => setShowNotification(false)}
        productName={addedProductName}
      />
    </div>
  )
}

export default Products
