import CorporateHeader from '../components/CorporateHeader'
import CorporateFooter from '../components/CorporateFooter'
import CostTicket from '../components/CostTicket'

const sectionStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '64px 48px',
}

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0e3a32 0%, #145247 60%, #0e3a32 100%)',
        color: '#fff',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <CorporateHeader />

      <section style={sectionStyle}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            marginBottom: '24px',
          }}
        >
          About Health Check Holidays
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          We're focused on one thing: curated health checks, bundled with a holiday, for the
          whole family — at a fraction of the cost of screenings closer to home.
        </p>
      </section>

      <section style={{ ...sectionStyle, maxWidth: 800, paddingTop: 0 }}>
        <div
          style={{
            color: '#FAA805',
            letterSpacing: '2px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          The math
        </div>
        <CostTicket />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '14px' }}>
          Figures are illustrative estimates for comparison purposes and will vary by clinic,
          package, and travel dates.
        </p>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '1.4rem',
            marginBottom: '16px',
          }}
        >
          Supported by
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7 }}>
          We're building relationships with clinical and travel partners across Asia. Details of
          our partners and backers will be published here as agreements are finalised.
        </p>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 0 }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '1.4rem',
            marginBottom: '16px',
          }}
        >
          Company details
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.9 }}>
          Health Check Holidays Ltd
          <br />
          Registered in England &amp; Wales, Company No. 17079237
          <br />
          Registered office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom
        </p>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 0, paddingBottom: '80px' }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '1.4rem',
            marginBottom: '16px',
          }}
        >
          Investors
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
          If you'd like to learn more about Health Check Holidays as an investment opportunity,
          we'd love to hear from you.
        </p>
        <a
          href="mailto:investors@go-hch.com"
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
          Contact our investor relations team
        </a>
      </section>

      <CorporateFooter />
    </div>
  )
}
