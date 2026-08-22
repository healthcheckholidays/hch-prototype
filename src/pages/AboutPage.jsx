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
          About us
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            marginBottom: '24px',
          }}
        >
          A check-up that gives you something back.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8 }}>
          Preventive care in the US is priced like a luxury. We pair the same hospital-grade
          screenings with a trip to Japan — so your family leaves with results, and a holiday.
        </p>
      </section>

      <section style={{ ...sectionStyle, paddingTop: 0 }}>
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
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)',
            marginBottom: '24px',
            maxWidth: '18ch',
          }}
        >
          Same peace of mind. Half the price. A holiday included.
        </h2>
        <CostTicket />
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8, marginTop: '28px' }}>
          A comprehensive health screening for a family of four in San Francisco can run upwards
          of <strong style={{ color: '#FAA805' }}>$50,000</strong>. The same family can fly to
          Japan, stay in beautiful hotels, complete equivalent — often more thorough —
          screenings, and still come home with a shared holiday behind them. All for around{' '}
          <strong style={{ color: '#FAA805' }}>$25,000</strong>. Half the cost. A memory instead
          of a bill.
        </p>
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

      <section style={{ background: 'rgba(0,0,0,0.18)' }}>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#fff',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              maxWidth: '22ch',
              margin: '0 auto',
            }}
          >
            Your next check-up could come with a boarding pass.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginTop: '14px' }}>
            Booking is opening soon — reach out and we'll sketch an itinerary around your
            family's needs.
          </p>
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
              marginTop: '26px',
            }}
          >
            Get in touch →
          </a>
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingTop: '64px', paddingBottom: '80px' }}>
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
