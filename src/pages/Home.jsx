import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight, HiMail } from 'react-icons/hi'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { BiLink } from 'react-icons/bi'
import { settingsAPI, publicProductsAPI } from '../services/api'
import ProductCard from '../components/ProductCard'
import './HomePage.css'

const MARQUEE_WORDS = ['Your Everyday Wingman', 'Cash on delivery', 'New drops']
const LATEST_COUNT = 4

const SOCIALS = [
  { href: 'https://www.instagram.com/ivywear.eg', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://www.tiktok.com/@ivywear.eg', label: 'TikTok', Icon: FaTiktok },
  { href: 'https://linktr.ee/ivyeg', label: 'All links', Icon: BiLink }
]

function Home() {
  const [storeEmail, setStoreEmail] = useState('')
  const [latest, setLatest] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    settingsAPI.getStore()
      .then(res => { if (res?.data?.email) setStoreEmail(res.data.email) })
      .catch(() => {})

    publicProductsAPI.getAll()
      .then(data => {
        const inStock = Array.isArray(data) ? data.filter(p => p.inStock) : []
        inStock.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setLatest(inStock.slice(0, LATEST_COUNT))
      })
      .catch(() => setLatest([]))
      .finally(() => setLoadingProducts(false))
  }, [])

  const marqueeRun = MARQUEE_WORDS.map(word => (
    <span key={word} className="hm-marquee-item">{word}<span className="hm-marquee-dot" aria-hidden="true" /></span>
  ))

  return (
    <div className="hm">
      <section className="hm-hero">
        <div className="hm-hero-inner container">
          <img src="/IMGs/IVY-03.png" alt="IVY" className="hm-hero-logo" width="160" height="160" fetchpriority="high" />
          <h1 className="display hm-hero-title">
            Your everyday <span>wingman</span>
          </h1>
          <p className="hm-hero-sub">Premium sporty menswear, made to move with you from morning to late.</p>
          <div className="hm-hero-actions">
            <Link to="/products" className="btn btn--primary">
              Shop the collection <HiArrowRight size={18} />
            </Link>
            <Link to="/track-orders" className="btn btn--ghost">Track an order</Link>
          </div>
        </div>
      </section>

      <div className="hm-marquee" aria-label={MARQUEE_WORDS.join(', ')}>
        <div className="hm-marquee-track" aria-hidden="true">
          {marqueeRun}
          {marqueeRun}
          {marqueeRun}
          {marqueeRun}
        </div>
      </div>

      <section className="hm-latest container" aria-labelledby="latest-title">
        <div className="hm-section-head">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 id="latest-title" className="display hm-section-title">Latest drop</h2>
          </div>
          <Link to="/products" className="hm-link">View all <HiArrowRight size={16} /></Link>
        </div>

        {loadingProducts ? (
          <div className="pcard-grid" aria-busy="true">
            {Array.from({ length: LATEST_COUNT }, (_, i) => <div key={i} className="hm-skel" />)}
          </div>
        ) : latest.length > 0 ? (
          <div className="pcard-grid">
            {latest.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="hm-empty">
            <p className="display hm-empty-title">New drop coming soon</p>
            <p className="hm-muted">Follow <a href="https://www.instagram.com/ivywear.eg" target="_blank" rel="noopener noreferrer">@ivywear.eg</a> to be first to know.</p>
          </div>
        )}
      </section>

      <section className="hm-contact">
        <div className="hm-contact-inner container">
          <div>
            <p className="eyebrow">Questions?</p>
            <h2 className="display hm-section-title">We're here to help</h2>
            <p className="hm-muted hm-contact-text">
              Sizing, orders or anything else — message us and we'll get back to you fast.
            </p>
          </div>
          <div className="hm-contact-side">
            <Link to="/contact" className="btn btn--primary">
              Send us a message <HiArrowRight size={18} />
            </Link>
            {storeEmail && (
              <a href={`mailto:${storeEmail}`} className="hm-contact-email">
                <HiMail size={18} /> {storeEmail}
              </a>
            )}
            <div className="hm-socials">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hm-social">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
