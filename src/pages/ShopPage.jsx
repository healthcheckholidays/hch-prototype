import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TopBar, Footer } from '../components/Nav'
import { PackageCard } from '../components/PackageCard'
import { packages } from '../data/packages'

const FILTERS = [
  { id: 'all', label: 'All packages' },
  { id: 'essential', label: 'Essential' },
  { id: 'comprehensive', label: 'Comprehensive' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'jci', label: 'JCI accredited' },
  { id: 'english', label: 'English-speaking' },
  { id: 'budget', label: 'Under $300' },
]

const DESTINATIONS = [
  { value: 'all', label: 'Anywhere in Asia' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Taiwan', label: 'Taiwan' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Hong Kong', label: 'Hong Kong' },
]

export default function ShopPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState('all')
  const [destFilter, setDestFilter] = useState('all')
  const [sort, setSort] = useState('recommended')
  const [searchDates, setSearchDates] = useState('')
  const [searchTravellers, setSearchTravellers] = useState('1')

  const hospsParam = searchParams.get('hosps') || sessionStorage.getItem('hch_matching_hosps') || ''
  const activeHosps = hospsParam ? hospsParam.split(',').filter(Boolean) : null

  function clearTestFilter() {
    sessionStorage.removeItem('hch_matching_hosps')
    sessionStorage.removeItem('hch_selected_tests')
    const next = new URLSearchParams(searchParams)
    next.delete('hosps')
    setSearchParams(next)
  }

  const filtered = packages.filter(pkg => {
    const destMatch = destFilter === 'all' || pkg.destination === destFilter
    let tierMatch = true
    if (activeFilter === 'essential') tierMatch = pkg.tier === 'essential'
    else if (activeFilter === 'comprehensive') tierMatch = pkg.tier === 'comprehensive'
    else if (activeFilter === 'advanced') tierMatch = pkg.tier === 'advanced'
    else if (activeFilter === 'jci') tierMatch = pkg.isJci
    else if (activeFilter === 'english') tierMatch = pkg.isEnglish
    else if (activeFilter === 'budget') tierMatch = pkg.price < 300
    const hospMatch = !activeHosps || pkg.hospitals.some(h => activeHosps.includes(h.id))
    return destMatch && tierMatch && hospMatch
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="site-shell">
      <TopBar />

      {/* Search bar */}
      <div style={{ background: '#0d5c4a', padding: '0 24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 6, background: '#fff', borderRadius: 12, padding: 6 }}>
          <SearchField label="Where">
            <select
              value={destFilter}
              onChange={e => setDestFilter(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none', cursor: 'pointer' }}
            >
              {DESTINATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </SearchField>
          <SearchField label="Travel dates">
            <input
              type="text"
              placeholder="Add dates"
              value={searchDates}
              onChange={e => setSearchDates(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none' }}
            />
          </SearchField>
          <SearchField label="Travellers">
            <select
              value={searchTravellers}
              onChange={e => setSearchTravellers(e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', fontSize: 13, outline: 'none' }}
            >
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3–4 people</option>
              <option value="5">Group (5+)</option>
            </select>
          </SearchField>
          <button
            className="btn btn-primary"
            style={{ borderRadius: 8, padding: '0 18px' }}
            onClick={() => {
              const params = new URLSearchParams()
              if (destFilter !== 'all') params.set('dest', destFilter)
              if (searchDates) params.set('dates', searchDates)
              params.set('travellers', searchTravellers)
              navigate(`/search?${params.toString()}`)
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`chip ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
        <div style={{ width: '0.5px', background: 'rgba(0,0,0,0.1)', margin: '4px 2px' }} />
        {activeHosps ? (
          <button
            className="chip active"
            onClick={clearTestFilter}
            style={{ background: 'var(--hch-green-800)', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            🔬 {activeHosps.length} hospital{activeHosps.length !== 1 ? 's' : ''} matched ×
          </button>
        ) : (
          <button
            className="chip"
            onClick={() => navigate('/test-selector')}
          >
            🔬 Choose add-on tests
          </button>
        )}
      </div>

      {/* Results header */}
      <div style={{ padding: '12px 24px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: '#666' }}>
          Showing {sorted.length} package{sorted.length !== 1 ? 's' : ''}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ fontSize: 12, color: '#666', background: 'none', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 24px 32px' }}>
        {sorted.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        {sorted.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '40px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
            No packages match your filters. Try removing a filter above.
          </div>
        )}
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
