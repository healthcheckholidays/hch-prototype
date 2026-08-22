export default function CorporatePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px',
        background: '#fff',
      }}
    >
      <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--hch-green-800, #145247)', fontSize: '2rem', marginBottom: '12px' }}>
        Health Check Holidays
      </h1>
      <p style={{ maxWidth: 480, color: '#444', lineHeight: 1.6, marginBottom: '24px' }}>
        We combine world-class health screenings with travel across Asia.
        Our platform is currently in development and not yet open for bookings.
      </p>
      <p style={{ color: '#444' }}>
        For enquiries, contact{' '}
        <a href="mailto:info@go-hch.com" style={{ color: 'var(--hch-green-800, #145247)', fontWeight: 600 }}>
          info@go-hch.com
        </a>
      </p>
      <p style={{ maxWidth: 480, color: '#888', fontSize: '0.85rem', marginTop: '32px' }}>
        Nothing on this site constitutes a booking, offer, or medical advice.
      </p>
    </div>
  )
}
