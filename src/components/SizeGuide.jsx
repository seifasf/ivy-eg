import React, { useEffect, useRef, useState } from 'react'
import { HiX } from 'react-icons/hi'
import { SIZE_CHART, TOLERANCE_CM, recommendSize } from '../utils/sizeChart'
import './SizeGuide.css'

// The 3D render: tilts toward the pointer for depth, with the measuring line marked on top
function MeasureVisual() {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const box = ref.current.getBoundingClientRect()
    const px = (e.clientX - box.left) / box.width - 0.5
    const py = (e.clientY - box.top) / box.height - 0.5
    setTilt({ x: py * -8, y: px * 10 })
  }

  return (
    <div
      className="sg-visual"
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="sg-stage" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <picture>
          <source srcSet="/IMGs/size-guide-3d.webp" type="image/webp" />
          <img
            src="/IMGs/size-guide-3d.jpg"
            alt="Mannequin wearing IVY boxer briefs with a measuring tape around the waist, just above the waistband"
            width="1200"
            height="900"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="sg-annot" aria-hidden="true">
          <svg className="sg-leader" viewBox="0 0 100 75" preserveAspectRatio="none">
            <line x1="43.5" y1="21.45" x2="62" y2="10.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="sg-marker">
            <span className="sg-ring" />
            <span className="sg-pin" />
          </span>
          <span className="sg-tag">
            <strong>Waist</strong>
            Measure here
          </span>
        </div>
      </div>
    </div>
  )
}

export function SizeGuideContent({ availableSizes, onSelectSize }) {
  const [unit, setUnit] = useState('cm')
  const [waist, setWaist] = useState('')
  const result = waist ? recommendSize(parseFloat(waist), unit) : null
  const canSelect = result && onSelectSize && (!availableSizes || availableSizes.includes(result.size))

  return (
    <div className="sg">
      <MeasureVisual />

      <div className="sg-body">
        <ol className="sg-steps">
          <li>Stand relaxed and breathe out normally.</li>
          <li>Wrap a soft measuring tape around your waist, where the waistband sits.</li>
          <li>Keep the tape level and snug, not tight, then read the number.</li>
        </ol>

        <div className="sg-table-head">
          <h3 className="sg-label">Size chart · waist</h3>
          <div className="sg-units" role="tablist" aria-label="Units">
            {['cm', 'inch'].map(u => (
              <button
                key={u}
                type="button"
                role="tab"
                aria-selected={unit === u}
                className={unit === u ? 'is-active' : ''}
                onClick={() => { setUnit(u); setWaist('') }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Waist ({unit === 'cm' ? 'cm' : 'inch'})</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map(row => (
              <tr key={row.size} className={result?.size === row.size ? 'is-match' : ''}>
                <th scope="row"><span className="sg-size">{row.size}</span>{row.label}</th>
                <td>{unit === 'cm' ? row.cm : `${row.inch}"`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sg-note">Please allow ±{TOLERANCE_CM} {unit === 'cm' ? 'cm' : 'cm (about 0.4")'} measurement difference.</p>

        <div className="sg-finder">
          <label className="sg-label" htmlFor="sg-waist">Find your size</label>
          <div className="sg-finder-row">
            <div className="sg-input">
              <input
                id="sg-waist"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.1"
                placeholder={unit === 'cm' ? 'e.g. 90' : 'e.g. 35'}
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
              <span>{unit}</span>
            </div>
            {result && (
              <p className="sg-result" aria-live="polite">
                Your size: <strong>{result.label} ({result.size})</strong>
              </p>
            )}
          </div>
          {result?.note && <p className="sg-note">{result.note}</p>}
          {canSelect && (
            <button type="button" className="btn btn--primary btn--block sg-select" onClick={() => onSelectSize(result.size)}>
              Select size {result.size}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SizeGuide({ open, onClose, availableSizes, onSelectSize }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="sg-overlay" onClick={onClose}>
      <div
        className="sg-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sg-dialog-head">
          <h2 id="sg-title" className="display sg-title">Find your fit</h2>
          <button type="button" ref={closeRef} className="sg-close" onClick={onClose} aria-label="Close size guide">
            <HiX size={20} />
          </button>
        </div>
        <SizeGuideContent
          availableSizes={availableSizes}
          onSelectSize={onSelectSize && ((size) => { onSelectSize(size); onClose() })}
        />
      </div>
    </div>
  )
}

export default SizeGuide
