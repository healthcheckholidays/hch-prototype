import CorporateHeader from '../components/CorporateHeader'
import CorporateFooter from '../components/CorporateFooter'

const sectionStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '64px 48px',
}

export default function PrivacyPage() {
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

      <div style={{ flex: 1 }}>
        <section style={sectionStyle}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              marginBottom: '24px',
            }}
          >
            Privacy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            We're pre-launch, so this notice is intentionally short. Here's exactly what is and
            isn't collected across our sites.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.3rem', marginBottom: '14px' }}>
            This site (go-hch.com)
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            This corporate page has no forms, no cookies beyond what's strictly needed to serve
            the page, and no analytics or tracking scripts. The "Contact Us" and "Investors"
            links simply open your own email client — we don't see or collect anything until you
            choose to send that email.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.3rem', marginBottom: '14px' }}>
            The demo (demo.go-hch.com)
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '14px' }}>
            The demo is a working preview of the product, so it includes forms you can try —
            destination and package selection, a lead-capture step, a health questionnaire, and a
            mock checkout. None of this is transmitted to us or stored anywhere: it exists only in
            your browser's memory for that session and is discarded the moment you close or reload
            the tab.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '14px' }}>
            The checkout step in the demo is a visual simulation only. It is not connected to
            Stripe or any real payment processor, and the card fields are pre-filled with a test
            card — no card details are collected, sent anywhere, or stored.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            Even so, please don't enter real personal, medical, or payment information into the
            demo — it isn't needed for you to try it out.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0, paddingBottom: '80px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.3rem', marginBottom: '14px' }}>
            Contact
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8 }}>
            Questions about this notice? Email{' '}
            <a href="mailto:info@go-hch.com" style={{ color: '#FAA805', fontWeight: 600 }}>
              info@go-hch.com
            </a>
            .
          </p>
        </section>
      </div>

      <CorporateFooter />
    </div>
  )
}
