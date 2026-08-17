export function PersistentSidebar({ country, clinicName, packageName, price, priceNote }) {
  return (
    <div className="booking-box" style={{ position: 'sticky', top: 66 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>Your booking</div>

      <SidebarRow label="Destination" value={country || 'Not selected yet'} />
      <SidebarRow label="Clinic" value={clinicName || 'Not selected yet'} />
      <SidebarRow label="Package" value={packageName || 'Not selected yet'} />

      <div className="bb-breakdown">
        <div className="bb-total">
          <span>Estimated total</span>
          <span style={{ color: 'var(--hch-green-800)' }}>{price ? `$${price}` : '—'}</span>
        </div>
        {priceNote && <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{priceNote}</div>}
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
