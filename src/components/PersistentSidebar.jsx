import { useState } from 'react'

export function PersistentSidebar({ country, clinicName, packageName, price, priceNote }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const chain = [country, clinicName, packageName].filter(Boolean).join(' → ')

  return (
    <div className="booking-box" style={{ position: 'sticky', top: 66 }}>
      {/* Mobile-only drag handle — toggles the bottom drawer open/closed */}
      <button
        className="drawer-handle"
        onClick={() => setDrawerOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center', padding: '8px 0 4px', flexDirection: 'column', gap: 6,
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)' }} />
        <div style={{ fontSize: 11, color: '#888' }}>
          {drawerOpen ? 'Hide booking summary ▾' : (chain ? `${chain} ▴` : 'Your booking ▴')}
        </div>
      </button>

      <div className={`drawer-body ${drawerOpen ? 'open' : ''}`}>
        <div className="section-label" style={{ marginBottom: 10 }}>Your booking</div>

        <SidebarRow label="Destination" value={country || 'Not selected yet'} />
        <SidebarRow label="Clinic" value={clinicName || 'Not selected yet'} />
        <SidebarRow label="Package" value={packageName || 'Not selected yet'} />

        <div className="bb-breakdown">
          <div className="bb-total">
            <span>Estimated total</span>
            <span style={{ color: 'var(--hch-gold-dark)', fontWeight: 600 }}>{price ? `$${price}` : '—'}</span>
          </div>
          {priceNote && <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{priceNote}</div>}
        </div>
      </div>
    </div>
  )
}

function SidebarRow({ label, value }) {
  const empty = value === 'Not selected yet'
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: empty ? '#aaa' : '#111', fontStyle: empty ? 'italic' : 'normal' }}>
        {value}
      </div>
    </div>
  )
}
