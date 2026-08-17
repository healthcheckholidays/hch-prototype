import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function PackageCard({ pkg }) {
  const [wishlisted, setWishlisted] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      className="pkg-browse-card"
      onClick={() => navigate(`/shop/${pkg.id}`)}
    >
      <div className="card-thumb" style={{ background: pkg.bgColor }}>
        <span style={{ fontSize: 38 }}>{pkg.emoji}</span>

        {pkg.badge && (
          <span
            className="card-badge"
            style={pkg.badgeColor ? { background: pkg.badgeColor } : {}}
          >
            {pkg.badge}
          </span>
        )}

        <button
          className="wishlist-btn"
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{ color: wishlisted ? 'var(--hch-gold-dark)' : '#333' }}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>
          {pkg.destination} · {pkg.city}
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
          {pkg.destination} {capitalize(pkg.tier)} Check
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {pkg.isJci && <span className="tag tag-green">JCI accredited</span>}
          {pkg.isEnglish && <span className="tag tag-green">English support</span>}
          <span className="tag">{tierDuration(pkg.tier)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '0.5px solid rgba(0,0,0,0.08)', paddingTop: 8 }}>
          <div>
            <div className="card-price">
              ${pkg.price} <span className="card-price-note">/ person</span>
            </div>
            <div style={{ fontSize: 10, color: '#888' }}>vs ~${pkg.usEquivalent.toLocaleString()} in US</div>
          </div>
          <div className="card-rating">
            <span className="star">★</span> {pkg.rating} · {pkg.reviewCount} reviews
          </div>
        </div>
      </div>
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function tierDuration(tier) {
  if (tier === 'essential') return '2 hrs'
  if (tier === 'comprehensive') return 'Half-day'
  return 'Full day'
}
