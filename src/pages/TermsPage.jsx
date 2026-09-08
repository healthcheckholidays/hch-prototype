import CorporateHeader from '../components/CorporateHeader'
import CorporateFooter from '../components/CorporateFooter'

const sectionStyle = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '64px 48px',
}

const h2Style = {
  fontFamily: "'Playfair Display', serif",
  color: '#fff',
  fontSize: '1.3rem',
  marginBottom: '14px',
}

const pStyle = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.95rem',
  lineHeight: 1.8,
  marginBottom: '14px',
}

const linkStyle = { color: '#FAA805', fontWeight: 600 }

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p style={pStyle}>
            These terms govern your use of go-hch.com and demo.go-hch.com. By using either site
            you accept them. If you don't, please don't use the sites.
          </p>
          <p style={{ ...pStyle, marginBottom: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Effective 7 September 2026.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Who we are</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            These sites are operated by Health Check Holidays Ltd, registered in England &amp;
            Wales, company number 17079237, registered office 71-75 Shelton Street, Covent
            Garden, London, WC2H 9JQ, United Kingdom. Contact us at{' '}
            <a href="mailto:info@go-hch.com" style={linkStyle}>info@go-hch.com</a>.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>We are not open for business yet</h2>
          <p style={pStyle}>
            Health Check Holidays is in development. Nothing on these sites is an offer to sell, a
            booking, a confirmed price, or a contract, and nothing you do on them creates one. We
            are not currently able to arrange screening or travel for you.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Any prices, packages, destinations, hospitals or partners shown are illustrative and
            provisional. They may change entirely or disappear before launch. Cost comparisons on
            this site — including the figures on our About page — are estimates for illustration,
            vary by clinic, package and travel dates, and should not be relied on as quotations.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Nothing here is medical advice</h2>
          <p style={pStyle}>
            These sites describe a service concept. They do not provide medical advice, diagnosis
            or treatment, and nothing on them should be used to decide whether to seek, delay or
            avoid care.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Always speak to a qualified healthcare professional about your own health. Health
            screening has genuine limitations: it can miss things, and it can flag things that
            turn out to be nothing. If you are worried about symptoms, contact a doctor rather
            than waiting for a screening trip.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>The demo</h2>
          <p style={pStyle}>
            demo.go-hch.com is an unfinished preview. Its content is placeholder material, its
            checkout is a visual simulation not connected to any payment processor, and nothing
            you enter is transmitted to us or stored — as set out in our{' '}
            <a href="/privacy" style={linkStyle}>Privacy Notice</a>.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Please don't enter real personal, medical or payment information into it. Don't rely
            on anything it shows you, and don't treat it as a description of the finished
            product. We may change or withdraw it at any time without notice.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Acceptable use</h2>
          <p style={pStyle}>Please don't:</p>
          <ul style={{ ...pStyle, paddingLeft: '20px' }}>
            <li>use the sites for anything unlawful, or in a way that could damage or disrupt them;</li>
            <li>attempt to gain unauthorised access to any part of the sites, their infrastructure, or any account or data;</li>
            <li>introduce malicious code, or scrape at a volume that degrades the service for others;</li>
            <li>misrepresent yourself as connected with us, or use our name or branding without permission.</li>
          </ul>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            If you believe you have found a security vulnerability, we would genuinely like to
            hear from you — see{' '}
            <a href="/.well-known/security.txt" style={linkStyle}>our security contact</a>.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Our content</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            The content, design, branding and code of these sites belong to Health Check Holidays
            Ltd or our licensors, and are protected by copyright and trade mark law. You may view
            and print pages for your own use, and share links to them. You may not otherwise copy,
            adapt or republish material from the sites without our permission.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Availability</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            We provide these sites free of charge and on an "as is" basis. We don't promise they
            will be available uninterrupted or error-free, and we may change, suspend or withdraw
            any part of them at any time. We may also update these terms; the effective date above
            tells you which version applies.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Liability</h2>
          <p style={pStyle}>
            Nothing in these terms limits or excludes our liability for death or personal injury
            caused by our negligence, for fraud or fraudulent misrepresentation, or for anything
            else that cannot lawfully be limited or excluded. Your statutory rights as a consumer
            are not affected.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Subject to that, we are not liable for any loss arising from your use of, or reliance
            on, these sites or their content — including the demo — or from their unavailability.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Links to other sites</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Where we link to third-party sites we do so for convenience. We don't control them and
            aren't responsible for their content or their privacy practices.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Governing law</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            These terms are governed by the law of England and Wales, and the courts of England
            and Wales have jurisdiction. If you live elsewhere in the UK, you may bring
            proceedings in your own jurisdiction. This does not affect any mandatory consumer
            protections available to you where you live.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0, paddingBottom: '80px' }}>
          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            Questions about these terms:{' '}
            <a href="mailto:info@go-hch.com" style={linkStyle}>info@go-hch.com</a>. Questions
            about your data:{' '}
            <a href="mailto:dpo@go-hch.com" style={linkStyle}>dpo@go-hch.com</a>.
          </p>
          <p style={{ ...pStyle, marginBottom: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Health Check Holidays Ltd, registered in England &amp; Wales, company number 17079237.
            Registered office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United
            Kingdom.
          </p>
        </section>
      </div>

      <CorporateFooter />
    </div>
  )
}
