import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiCheck, HiX } from 'react-icons/hi'
import './ReturnsPolicy.css'

function ReturnsPolicy() {
  useEffect(() => {
    document.title = 'Returns & Exchanges · IVY'
    window.scrollTo(0, 0)
    return () => { document.title = 'IVY - Your Everyday Wingman' }
  }, [])

  return (
    <div className="pol container">
      <header className="pol-head">
        <p className="eyebrow">Policy</p>
        <h1 className="display pol-title">Returns &amp; exchanges</h1>
        <p className="pol-lead">
          IVY makes underwear. For hygiene reasons, items can't be returned or exchanged once
          they're delivered, except in the two cases below.
        </p>
      </header>

      <div className="pol-grid">
        <section className="pol-card">
          <h2 className="pol-card-title">Refunds</h2>
          <ul className="pol-list">
            <li className="is-no"><HiX size={18} aria-hidden="true" /> No refunds for change of mind, fit or style</li>
            <li className="is-yes"><HiCheck size={18} aria-hidden="true" /> Refund only if the item arrives with a manufacturing defect</li>
          </ul>
        </section>

        <section className="pol-card">
          <h2 className="pol-card-title">Exchanges</h2>
          <ul className="pol-list">
            <li className="is-no"><HiX size={18} aria-hidden="true" /> No exchanges for a different size, color or product you'd prefer</li>
            <li className="is-yes"><HiCheck size={18} aria-hidden="true" /> Exchange only if you received a different size or color than you ordered</li>
          </ul>
        </section>
      </div>

      <section className="pol-section">
        <h2 className="pol-section-title">How to report a problem</h2>
        <ol className="pol-steps">
          <li>Contact us as soon as you receive your order. Include your order number.</li>
          <li>For a defect, send clear photos of the defect. For a wrong size or color, send a photo of the item and its label.</li>
          <li>Items sent back for a wrong size or color must be unworn, unwashed and in their original packaging.</li>
          <li>We'll review your request and reply with the next steps.</li>
        </ol>
        <p className="pol-tip">Please double-check your size and color before placing your order.</p>
      </section>

      <div className="pol-actions">
        <Link to="/contact" className="btn btn--primary">Contact us</Link>
        <Link to="/track-orders" className="btn btn--ghost">Find my order</Link>
      </div>
    </div>
  )
}

export default ReturnsPolicy
