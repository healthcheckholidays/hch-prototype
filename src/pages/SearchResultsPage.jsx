import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { TopBar, Footer } from '../components/Nav'
import { PackageCard } from '../components/PackageCard'
import { packages } from '../data/packages'

const TIERS = ['Essential', 'Comprehensive', 'Advanced']

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialDest = searchParams.get('dest') || ''
  const initialDates = searchParams.get('dates') || ''
  const initialTravellers = searchParams.get('travellers') || '1'

  const [dest, setDest] = useState(initialDest)
  const [dates, setDates] = useState(initialDates)
  const [travellers, setTravellers] = useState(initialTravellers)
  const [editingSearch, setEditingSearch] = useState(false)

  const [priceMax, setPriceMax] = useState(800)
  const [tierFilters, setTierFilters] = useState([])
  const [jciOnly, setJciOnly] = useState(false)
  const [durationFilter, setDurationFilter] = useState('')

  const hospsParam = searchParams.get('hosps') || sessionStorage.getItem('hch_matching_hosps') || ''
  const activeHosps = hospsParam ? hospsParam.split(',').filter(Boolean) : null

  function clearTestFilter() {
    sessionStorage.removeItem('hch_matching_hosps')
    sessionStorage.removeItem('hch_selected_tests')
    const next = new URLSearchParams(searchParams)
    next.delete('hosps')
    navigate(`/search?${next.toString()}`, { replace: true })
  }

  function toggleTier(tier) {
    setTierFilters(prev =>
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    )
  }

  const filtered = packages.filter(pkg => {
    if (dest && pkg.destination !== dest) return false
    if (pkg.price > priceMax) return false
    if (tierFilters.length > 0 && !tierFilters.includes(capitalize(pkg.tier))) return false
    if (jciOnly && !pkg.isJci) return false
    if (durationFilter === '2 hrs' && pkg.tier !== 'essential') return false
    if (durationFilter === 'Half-day' && pkg.tier !== 'comprehensive') return false
    if (durationFilter === 'Full day' && pkg.tier !== 'advanced') return false
    if (activeHosps && !pkg.hospitals.some(h => activeHosps.includes(h.id))) return false
    return true
  })

  const activePills = [
    dest && { label: dest, clear: () => setDest('') },
    tierFilters.map(t => ({ label: t, clear: () => toggleTier(t) })),
    jciOnly && { label: 'JCI accredited', clear: () => setJciOnly(false) },
    durationFilter && { label: durationFilter, clear: () => setDurationFilter('') },
    activeHosps && { label: `🔬 ${activeHosps.length} hospital${activeHosps.length !== 1 ? 's' : ''} matched`, clear: clearTestFilter },
  ].flat().filter(Boolean)

  const summaryParts = [
    dest || 'Anywhere in Asia',
    dates || 'Any dates',
    `${travellers} ${travellers === '1' ? 'person' : 'people'}`,
  ]

  return (
    <div className="site-shell">
      <TopBar />

      {/* Search summary bar */}
      <div style={{ background: 'var(--hch-green-800)', padding: '10px 24px 14px' }}>
        {editingSearch ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 6, background: '#fff', borderRadius: 12, padding: 6 }}>
            <SearchField label="Where">
              <select
                value={dest}
                onChange={e => setDest(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none', cursor: 'pointer' }}
              >
                <option value="">Anywhere in Asia</option>
                {['Japan','Singapore','South Korea','Thailand','Taiwan','Malaysia','Vietnam','Hong Kong'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </SearchField>
            <SearchField label="Travel dates">
              <input
                type="text"
                value={dates}
                onChange={e => setDates(e.target.value)}
                placeholder="Add dates"
                style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none' }}
              />
            </SearchField>
            <SearchField label="Travellers">
              <select
                value={travellers}
                onChange={e => setTravellers(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none' }}
              >
                <option value="1">1 person</option>
                <option value="2">2 people</option>
                <option value="3">3–4 people</option>
                <option value="5">Group (5+)</option>
              </select>
            </SearchField>
            <button className="btn btn-primary" style={{ borderRadius: 8, padding: '0 18px' }} onClick={() => setEditingSearch(false)}>
              Search
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>
              {summaryParts.join(' · ')}
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => setEditingSearch(true)}
            >
              Edit search
            </button>
          </div>
        )}
      </div>

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div style={{ display: 'flex', gap: 6, padding: '10px 24px', flexWrap: 'wrap', borderBottom: 'var(--border)' }}>
          {activePills.map((pill, i) => (
            <button
              key={i}
              onClick={pill.clear}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: 'var(--hch-green-50)',
                border: '0.5px solid var(--hch-green-300)',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 12,
                color: '#085041',
                cursor: 'pointer',
              }}
            >
              {pill.label} ×
            </button>
          ))}
          {activePills.length > 1 && (
            <button
              onClick={() => { setDest(''); setTierFilters([]); setJciOnly(false); setDurationFilter('') }}
              style={{ fontSize: 12, color: 'var(--hch-green-600)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div className="two-col">
        <div className="main-col">

          {/* Results count */}
          <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>
            {filtered.length} package{filtered.length !== 1 ? 's' : ''} found
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No packages match your search</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Try broadening your filters or choosing a different destination.</div>
              <button className="btn btn-primary" onClick={() => { setPriceMax(800); setTierFilters([]); setJciOnly(false); setDurationFilter(''); setDest('') }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Sidebar filters */}
        <div className="side-col">

          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Filter results</div>

          {/* Price range */}
          <div style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Max price</div>
            <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--hch-green-800)', marginBottom: 6 }}>${priceMax}</div>
            <input
              type="range"
              min={100}
              max={800}
              step={50}
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--hch-green-800)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginTop: 2 }}>
              <span>$100</span><span>$800</span>
            </div>
          </div>

          {/* Tier */}
          <div style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Package tier</div>
            {TIERS.map(tier => (
              <label key={tier} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={tierFilters.includes(tier)}
                  onChange={() => toggleTier(tier)}
                  style={{ accentColor: 'var(--hch-green-800)', width: 14, height: 14 }}
                />
                {tier}
              </label>
            ))}
          </div>

          {/* JCI toggle */}
          <div style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Accreditation</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={jciOnly}
                onChange={e => setJciOnly(e.target.checked)}
                style={{ accentColor: 'var(--hch-green-800)', width: 14, height: 14 }}
              />
              JCI accredited only
            </label>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 18 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>Duration</div>
            {['2 hrs', 'Half-day', 'Full day'].map(d => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="radio"
                  name="duration"
                  checked={durationFilter === d}
                  onChange={() => setDurationFilter(durationFilter === d ? '' : d)}
                  style={{ accentColor: 'var(--hch-green-800)', width: 14, height: 14 }}
                />
                {d}
              </label>
            ))}
          </div>

          {/* Add-on tests */}
          <div style={{ marginBottom: 18, paddingTop: 14, borderTop: 'var(--border)' }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Add-on tests</div>
            {activeHosps ? (
              <div style={{ background: 'var(--hch-green-50)', border: '0.5px solid var(--hch-green-300)', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#085041', marginBottom: 8 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>
                  🔬 {activeHosps.length} hospital{activeHosps.length !== 1 ? 's' : ''} matched
                </div>
                <div style={{ color: '#555', marginBottom: 6, fontSize: 11 }}>Packages filtered to hospitals offering your selected tests.</div>
                <button
                  onClick={clearTestFilter}
                  style={{ background: 'none', border: 'none', color: 'var(--hch-green-600)', fontSize: 11, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Clear test filter
                </button>
              </div>
            ) : (
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/test-selector')}
              >
                🔬 Choose add-on tests
              </button>
            )}
          </div>

          <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/shop')}>
            Browse all packages
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function SearchField({ label, children }) {
  return (
    <div style={{ padding: '4px 10px', borderRight: '0.5px solid #e0e0e0' }}>
      <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 2 }}>{label}</div>
      {children}
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
