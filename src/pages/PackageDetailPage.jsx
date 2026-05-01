import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar, Footer, Breadcrumb } from '../components/Nav'
import { getPackage, COORD_FEE } from '../data/packages'

export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pkg = getPackage(id)
  const [travellers, setTravellers] = useState(1)

  // Filter hospitals to only those matching the test selection, if coming from TestSelectorPage.
  const matchingHosps = (() => {
    const fromUrl = searchParams.get('hosps')
    const fromSession = sessionStorage.getItem('hch_matching_hosps')
    const raw = fromUrl || fromSession || ''
    return raw ? raw.split(',').filter(Boolean) : null
  })()

  const visibleHospitals = matchingHosps
    ? (pkg?.hospitals ?? []).filter(h => h.id && matchingHosps.includes(h.id))
    : pkg?.hospitals ?? []

  if (!pkg) return <div style={{ padding: 40, textAlign: 'center' }}>Package not found.</div>

  const screeningTotal = pkg.price * travellers
  const total = screeningTotal + COORD_FEE
  const saved = pkg.usEquivalent * travellers - total

  return (
    <div className="site-shell">
      <TopBar />

      <div className="page-header">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Start planning', href: '/shop' },
          { label: `${pkg.destination} — ${capitalize(pkg.tier)}` },
        ]} />
        <h1>{pkg.destination} {capitalize(pkg.tier)} Health Check</h1>
        <div className="subtitle">{pkg.city} · {pkg.hospitals[0]?.name}</div>
      </div>

      <div className="two-col">
        <div className="main-col">
          {/* Hero image */}
          <div style={{ height: 160, background: pkg.bgColor, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, marginBottom: 16 }}>
            {pkg.emoji}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {pkg.tags.map(t => <span key={t} className="tag tag-green">{t}</span>)}
          </div>

          {/* Rating */}
          <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
            <span style={{ color: '#BA7517' }}>★</span> {pkg.rating} · {pkg.reviewCount} verified reviews
          </div>

          <h4 style={{ marginBottom: 10 }}>What's included</h4>
          <div style={{ borderRadius: 8, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.1)', marginBottom: 20 }}>
            {pkg.includes.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', borderBottom: i < pkg.includes.length - 1 ? '0.5px solid rgba(0,0,0,0.08)' : 'none', fontSize: 13, color: '#333' }}>
                <CheckIcon />
                {item}
              </div>
            ))}
          </div>

          <h4 style={{ marginBottom: 6 }}>Partner hospitals</h4>
          {matchingHosps && (
            <div className="inset" style={{ fontSize: 11, marginBottom: 10 }}>
              Showing hospitals that offer all your selected add-on tests.{' '}
              <button onClick={() => { sessionStorage.removeItem('hch_matching_hosps'); navigate(0) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hch-green-600)', fontSize: 11, padding: 0, textDecoration: 'underline' }}>Show all</button>
            </div>
          )}
          {visibleHospitals.length === 0 && (
            <div style={{ fontSize: 13, color: '#888', padding: '12px 0' }}>
              No hospitals at this location match your selected tests.
            </div>
          )}
          {visibleHospitals.map((h, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, borderRadius: 10 }}>
              <div className="card-body">
                <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{h.name}</div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{h.location} · {h.accreditation}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>★ {h.rating}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#0d5c4a' }}>From ${h.price}</div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, background: '#f5f5f3', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#555' }}>
            <span style={{ fontWeight: 500, color: '#111' }}>Results turnaround: </span>
            All results emailed within 48 hours with a plain-English summary. If anything needs follow-up, a US-based teleconsult is included free of charge.
          </div>
        </div>

        {/* Booking box */}
        <div className="side-col">
          <div className="booking-box">
            <div className="bb-price">${pkg.price}</div>
            <div className="bb-note">per person · screening only</div>

            <div className="bb-field">
              <div className="bb-row">
                <div className="bb-cell">
                  <div className="bb-label">Check-in</div>
                  <div className="bb-val">Add date</div>
                </div>
                <div className="bb-cell">
                  <div className="bb-label">Check-out</div>
                  <div className="bb-val">Add date</div>
                </div>
              </div>
              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.1)' }}>
                <div className="bb-cell-full">
                  <div className="bb-label">Travellers</div>
                  <select
                    value={travellers}
                    onChange={e => setTravellers(Number(e.target.value))}
                    style={{ background: 'none', border: 'none', fontSize: 13, width: '100%', outline: 'none', cursor: 'pointer' }}
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 10 }}
              onClick={() => navigate('/confirmation/HCH-2025-0614')}
            >
              Reserve screening slot
            </button>
            <div style={{ fontSize: 11, color: '#888', textAlign: 'center', marginTop: 6 }}>
              No charge until confirmed · Free cancellation 30 days before
            </div>

            <div className="bb-breakdown">
              <div className="bb-line">
                <span>Screening × {travellers} person{travellers > 1 ? 's' : ''}</span>
                <span>${screeningTotal}</span>
              </div>
              <div className="bb-line"><span>Coordination fee</span><span>${COORD_FEE}</span></div>
              <div className="bb-line"><span>Results + summary</span><span>Included</span></div>
              <div className="bb-total"><span>Total</span><span>${total}</span></div>
            </div>

            <div className="bb-save">
              You save ~${saved.toLocaleString()} vs US out-of-pocket
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function CheckIcon() {
  return (
    <div style={{ width: 16, height: 16, background: '#E1F5EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 3L3 5L7 1" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
