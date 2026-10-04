import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiExclamation, HiRefresh } from 'react-icons/hi'
import { dashboardAPI, getImageUrl } from '../../services/api'
import { formatEGP, handleImageError } from '../../utils/product'
import './Analytics.css'

const RANGES = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: '365', label: '12 months' },
  { id: 'all', label: 'All time' }
]

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const percent = (value) => `${Number(value || 0).toLocaleString('en-EG', { maximumFractionDigits: 1 })}%`

const formatBucket = (date, granularity) => {
  const [y, m, d] = date.split('-').map(Number)
  const value = new Date(y, m - 1, d || 1)
  return granularity === 'month'
    ? value.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
    : value.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function Kpi({ label, value, note, tone }) {
  return (
    <div className={`an-kpi ${tone ? `an-kpi--${tone}` : ''}`}>
      <p className="an-kpi-label">{label}</p>
      <p className="an-kpi-value">{value}</p>
      {note && <p className="an-kpi-note">{note}</p>}
    </div>
  )
}

function SalesChart({ timeline, granularity }) {
  const [active, setActive] = useState(null)
  if (!timeline.length) return <p className="an-empty">No orders in this period yet.</p>

  const max = Math.max(...timeline.map(p => Math.max(p.revenue, p.profit, 0)), 1)
  const min = Math.min(...timeline.map(p => p.profit), 0)
  const span = max - min
  const zeroY = (max / span) * 100
  const y = (v) => ((max - v) / span) * 100
  const step = 100 / timeline.length
  const focus = active !== null ? timeline[active] : null
  const totals = timeline.reduce((t, p) => ({ revenue: t.revenue + p.revenue, orders: t.orders + p.orders }), { revenue: 0, orders: 0 })
  const labelEvery = Math.ceil(timeline.length / 6)

  return (
    <div className="an-chart">
      <div className="an-chart-readout" aria-live="polite">
        {focus ? (
          <>
            <strong>{formatBucket(focus.date, granularity)}</strong>
            <span>Revenue {formatEGP(focus.revenue)}</span>
            <span className={focus.profit < 0 ? 'is-loss' : 'is-profit'}>Profit {formatEGP(focus.profit)}</span>
            <span>{plural(focus.orders, 'order')}</span>
          </>
        ) : (
          <>
            <strong>Period total</strong>
            <span>Revenue {formatEGP(totals.revenue)}</span>
            <span>{plural(totals.orders, 'order')}</span>
            <span className="an-muted">Hover a bar for details</span>
          </>
        )}
      </div>

      <div className="an-chart-plot" onMouseLeave={() => setActive(null)}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Revenue and profit over time">
          <line x1="0" x2="100" y1={zeroY} y2={zeroY} className="an-axis" vectorEffect="non-scaling-stroke" />
          {timeline.map((p, i) => (
            <g key={p.date}>
              <rect
                x={i * step + step * 0.15}
                width={step * 0.7}
                y={y(Math.max(p.revenue, 0))}
                height={Math.max(zeroY - y(Math.max(p.revenue, 0)), p.revenue > 0 ? 0.6 : 0)}
                className={`an-bar ${active === i ? 'is-active' : ''}`}
              />
              <rect
                x={i * step + step * 0.3}
                width={step * 0.4}
                y={p.profit >= 0 ? y(p.profit) : zeroY}
                height={Math.abs(y(p.profit) - zeroY)}
                className={`an-bar-profit ${p.profit < 0 ? 'is-loss' : ''}`}
              />
              <rect
                x={i * step}
                width={step}
                y="0"
                height="100"
                fill="transparent"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="an-chart-axis" aria-hidden="true">
        {timeline.map((p, i) => (
          <span key={p.date} style={{ width: `${step}%` }}>
            {i % labelEvery === 0 ? formatBucket(p.date, granularity) : ''}
          </span>
        ))}
      </div>

      <div className="an-legend">
        <span><i className="an-swatch an-swatch--revenue" /> Revenue</span>
        <span><i className="an-swatch an-swatch--profit" /> Profit</span>
      </div>
    </div>
  )
}

function Analytics() {
  const [range, setRange] = useState('30')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async (selected = range) => {
    setLoading(true)
    setError('')
    try {
      setData(await dashboardAPI.getAnalytics(selected))
    } catch (err) {
      setError(err.status === 404
        ? 'Analytics need the latest backend. Deploy the backend on Render, then refresh.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(range)
  }, [range])

  const t = data?.totals
  const maxSizeUnits = Math.max(...(data?.sizes || []).map(s => s.units), 1)

  return (
    <div className="an">
      <div className="admin-page-header an-header">
        <div>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">Revenue, costs and profit. Cancelled orders are excluded.</p>
        </div>
        <div className="an-controls">
          <div className="an-ranges" role="tablist" aria-label="Period">
            {RANGES.map(r => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={range === r.id}
                className={range === r.id ? 'is-active' : ''}
                onClick={() => setRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button type="button" className="an-refresh" onClick={() => load()} disabled={loading} aria-label="Refresh">
            <HiRefresh size={18} className={loading ? 'is-spinning' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!data && loading && (
        <div className="an-kpis">
          {Array.from({ length: 8 }, (_, i) => <div key={i} className="an-kpi an-kpi--loading" />)}
        </div>
      )}

      {data && (
        <div className={loading ? 'an-stale' : ''}>
          {data.missingCost.length > 0 && (
            <div className="an-warning">
              <HiExclamation size={20} />
              <p>
                {data.missingCost.length === 1 ? '1 product has' : `${data.missingCost.length} products have`} no cost
                price ({data.missingCost.slice(0, 3).map(p => p.title).join(', ')}
                {data.missingCost.length > 3 ? '…' : ''}), so profit looks higher than it really is.{' '}
                <Link to="/admin/products">Add costs in Products</Link>
              </p>
            </div>
          )}

          <div className="an-kpis">
            <Kpi label="Revenue" value={formatEGP(t.revenue)} note="Order totals incl. delivery" />
            <Kpi label="Net sales" value={formatEGP(t.netSales)} note={`After ${formatEGP(t.discounts)} discounts, excl. delivery`} />
            <Kpi label="Cost of goods" value={formatEGP(t.cost)} note="What the sold pieces cost you" />
            <Kpi
              label="Gross profit"
              value={formatEGP(t.profit)}
              note={`${percent(t.margin)} margin`}
              tone={t.profit < 0 ? 'loss' : 'profit'}
            />
            <Kpi label="Orders" value={t.orders.toLocaleString()} note={`${data.cancelled.orders} cancelled`} />
            <Kpi label="Avg. order value" value={formatEGP(t.avgOrderValue)} />
            <Kpi label="Pieces sold" value={t.units.toLocaleString()} />
            <Kpi label="Delivery fees collected" value={formatEGP(t.shipping)} />
          </div>

          <div className="an-split">
            <div className="an-card">
              <p className="an-card-label">Collected · delivered</p>
              <p className="an-card-value">{formatEGP(data.delivered.revenue)}</p>
              <p className="an-card-note">
                {plural(data.delivered.orders, 'order')} · profit{' '}
                <span className={data.delivered.profit < 0 ? 'is-loss' : 'is-profit'}>{formatEGP(data.delivered.profit)}</span>
              </p>
            </div>
            <div className="an-card">
              <p className="an-card-label">In progress · pending to shipped</p>
              <p className="an-card-value">{formatEGP(data.open.revenue)}</p>
              <p className="an-card-note">
                {plural(data.open.orders, 'order')} · expected profit{' '}
                <span className={data.open.profit < 0 ? 'is-loss' : 'is-profit'}>{formatEGP(data.open.profit)}</span>
              </p>
            </div>
            <div className="an-card">
              <p className="an-card-label">Cancelled</p>
              <p className="an-card-value an-muted">{formatEGP(data.cancelled.value)}</p>
              <p className="an-card-note">{plural(data.cancelled.orders, 'order')}, stock returned</p>
            </div>
          </div>

          <section className="an-section">
            <h2 className="an-section-title">Sales over time</h2>
            <SalesChart timeline={data.timeline} granularity={data.granularity} />
          </section>

          <div className="an-two">
            <section className="an-section">
              <h2 className="an-section-title">Top products</h2>
              {data.topProducts.length === 0 ? (
                <p className="an-empty">No sales in this period.</p>
              ) : (
                <div className="an-table-wrap">
                  <table className="an-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map(p => (
                        <tr key={p.productId}>
                          <td>
                            <div className="an-product">
                              <img src={getImageUrl(p.mainImage)} alt="" loading="lazy" onError={handleImageError} />
                              <span>{p.title}</span>
                            </div>
                          </td>
                          <td>{p.units}</td>
                          <td>{formatEGP(p.revenue)}</td>
                          <td className={p.profit < 0 ? 'is-loss' : 'is-profit'}>
                            {formatEGP(p.profit)}
                            {p.revenue > 0 && <small> {percent((p.profit / p.revenue) * 100)}</small>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="an-section">
              <h2 className="an-section-title">Pieces sold by size</h2>
              {data.sizes.length === 0 ? (
                <p className="an-empty">No sized items sold in this period.</p>
              ) : (
                <ul className="an-sizes">
                  {data.sizes.map(s => (
                    <li key={s.size}>
                      <span className="an-size-name">{s.size}</span>
                      <span className="an-size-track">
                        <span style={{ width: `${(s.units / maxSizeUnits) * 100}%` }} />
                      </span>
                      <span className="an-size-units">{s.units}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="an-two">
            <section className="an-section">
              <h2 className="an-section-title">Inventory value</h2>
              <div className="an-inventory">
                <div><p>Pieces in stock</p><strong>{data.inventory.units.toLocaleString()}</strong></div>
                <div><p>Value at cost</p><strong>{formatEGP(data.inventory.costValue)}</strong></div>
                <div><p>Value at selling price</p><strong>{formatEGP(data.inventory.retailValue)}</strong></div>
                <div><p>Profit if all sells</p><strong className="is-profit">{formatEGP(data.inventory.potentialProfit)}</strong></div>
              </div>
            </section>

            <section className="an-section">
              <h2 className="an-section-title">Low stock</h2>
              {data.lowStock.length === 0 ? (
                <p className="an-empty">Every size has more than 3 pieces.</p>
              ) : (
                <ul className="an-low">
                  {data.lowStock.map(item => (
                    <li key={`${item.productId}-${item.size}`}>
                      <span>{item.title}{item.size && <em> · {item.size}</em>}</span>
                      <span className={item.stock === 0 ? 'is-loss' : 'an-warn'}>
                        {item.stock === 0 ? 'Sold out' : `${item.stock} left`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {data.unitsWithoutCost > 0 && (
            <p className="an-footnote">
              {data.unitsWithoutCost} sold {data.unitsWithoutCost === 1 ? 'piece has' : 'pieces have'} no cost
              recorded, so they count as pure profit.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Analytics
