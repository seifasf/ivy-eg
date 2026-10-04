import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SizeGuideContent } from '../components/SizeGuide'
import './SizeGuidePage.css'

function SizeGuidePage() {
  useEffect(() => {
    document.title = 'Size Guide · IVY'
    window.scrollTo(0, 0)
    return () => { document.title = 'IVY - Your Everyday Wingman' }
  }, [])

  return (
    <div className="sgp container">
      <header className="sgp-head">
        <p className="eyebrow">Size guide</p>
        <h1 className="display sgp-title">Find your fit</h1>
        <p className="sgp-lead">
          IVY sizes go by your waist. Measure once, match it to the chart and you're set.
        </p>
      </header>

      <SizeGuideContent />

      <p className="sgp-foot">
        Underwear can't be exchanged for a different size after delivery, so please check your
        measurement first. <Link to="/returns">Read the returns &amp; exchanges policy</Link>
      </p>

      <div className="sgp-actions">
        <Link to="/products" className="btn btn--primary">Shop now</Link>
      </div>
    </div>
  )
}

export default SizeGuidePage
