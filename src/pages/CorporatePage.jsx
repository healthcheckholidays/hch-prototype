import CorporateHeader from '../components/CorporateHeader'

export default function CorporatePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0e3a32 0%, #145247 60%, #0e3a32 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <CorporateHeader />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 48px 48px' }}>
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              color: '#FAA805',
              letterSpacing: '2px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Health Screening + Holiday, Combined
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              lineHeight: 1.15,
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            World-class health checks.
            <br />
            Unforgettable travel.
            <br />
            <span style={{ color: '#FAA805' }}>Coming soon.</span>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: 480,
              marginBottom: '32px',
            }}
          >
            We're building a platform that pairs JCI-accredited hospital screenings across Asia
            with the holiday your family has always dreamed of. Currently in development — not
            yet open for bookings.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a
              href="mailto:info@go-hch.com"
              style={{
                background: '#FAA805',
                color: '#145247',
                fontWeight: 600,
                padding: '14px 32px',
                borderRadius: 999,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Contact Us
            </a>
            <a
              href="https://demo.go-hch.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '13px 28px',
                borderRadius: 999,
              }}
            >
              See our demo
              <span
                style={{
                  background: 'rgba(250,168,5,0.15)',
                  color: '#FAA805',
                  border: '1px solid rgba(250,168,5,0.4)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                In development
              </span>
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '14px' }}>
            The demo is a work-in-progress preview of the product — not a live booking site.
          </p>
        </div>
      </main>

      <footer style={{ padding: '24px 48px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
        Nothing on this site constitutes a booking, offer, or medical advice.
      </footer>
    </div>
  )
}
