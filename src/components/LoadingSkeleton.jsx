import React from 'react'
import './LoadingSkeleton.css'

export const ProductSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-price" />
    </div>
  </div>
)

export const OrderSkeleton = () => (
  <div className="skeleton-order">
    <div className="skeleton-header">
      <div className="skeleton-line skeleton-order-id" />
      <div className="skeleton-line skeleton-status" />
    </div>
    <div className="skeleton-items">
      {[1, 2].map(i => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-item-image" />
          <div className="skeleton-item-content">
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-small" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const StatsSkeleton = () => (
  <div className="skeleton-stat">
    <div className="skeleton-icon" />
    <div className="skeleton-stat-content">
      <div className="skeleton-line skeleton-stat-label" />
      <div className="skeleton-line skeleton-stat-value" />
    </div>
  </div>
)

