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
            Privacy Notice
          </h1>
          <p style={pStyle}>
            This notice explains what personal data Health Check Holidays Ltd collects, why, and
            what you can do about it. We are pre-launch and not open for bookings, so there is
            less here than there will be — but we would rather tell you precisely what happens
            now than write a notice for a business we are not yet running.
          </p>
          <p style={{ ...pStyle, marginBottom: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Effective 7 September 2026. Applies to go-hch.com and demo.go-hch.com.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Who we are</h2>
          <p style={pStyle}>
            Health Check Holidays Ltd is the data controller. We are registered in England &amp;
            Wales, company number 17079237, at 71-75 Shelton Street, Covent Garden, London, WC2H
            9JQ, United Kingdom.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            For anything in this notice, or to exercise any of the rights below, email{' '}
            <a href="mailto:dpo@go-hch.com" style={linkStyle}>dpo@go-hch.com</a>.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>What we collect, and why</h2>

          <p style={pStyle}>
            <strong style={{ color: '#fff' }}>Email you send us</strong>
            <br />
            If you write to info@, investors@ or dpo@go-hch.com, we receive whatever you put in
            that email — typically your name, your address and what you asked about. We use it to
            reply to you and, where you have asked to hear about the launch, to do that. Lawful
            basis: legitimate interests (responding to someone who contacted us), or taking steps
            at your request prior to entering a contract.
          </p>

          <p style={pStyle}>
            <strong style={{ color: '#fff' }}>Server and CDN logs</strong>
            <br />
            Our hosting (Amazon Web Services) records standard request data — IP address,
            timestamp, the page requested, user agent — as part of operating and securing the
            site. Lawful basis: legitimate interests (keeping the site available and defending
            against abuse).
          </p>

          <p style={pStyle}>
            <strong style={{ color: '#fff' }}>Google Fonts</strong>
            <br />
            Both sites currently load typefaces from Google's font service. Doing so necessarily
            discloses your IP address and browser details to Google, who act as an independent
            controller for that. We are moving to self-hosted fonts to remove this. Lawful basis:
            legitimate interests (presenting the site as designed) — and if you would rather not,
            a content blocker will stop it without breaking the site.
          </p>

          <p style={{ ...pStyle, marginBottom: 0 }}>
            <strong style={{ color: '#fff' }}>Nothing else</strong>
            <br />
            No cookies are set on either site. No analytics, no advertising pixels, no tag
            managers, no session recording, no fingerprinting. There is no cookie banner because
            there is nothing to consent to.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>The demo (demo.go-hch.com)</h2>
          <p style={pStyle}>
            The demo is a working preview of the product. It includes forms you can try —
            destination and package selection, a lead-capture step, a health questionnaire and a
            mock checkout.
          </p>
          <p style={pStyle}>
            <strong style={{ color: '#fff' }}>
              Nothing you enter into the demo is transmitted to us or stored anywhere.
            </strong>{' '}
            It exists only in your browser's memory for that session and is discarded when you
            close or reload the tab. The checkout is a visual simulation: it is not connected to
            Stripe or any payment processor, the card fields are pre-filled with a test card, and
            no card details are collected, sent or stored.
          </p>
          <p style={pStyle}>
            Even so, please don't enter real personal, medical or payment information into the
            demo. You don't need to in order to try it, and it is a preview rather than a
            finished, assured system.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            The demo is not a booking service and nothing in it constitutes medical advice.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Health information</h2>
          <p style={pStyle}>
            Information about your health is "special category" data and gets stricter protection
            under UK data protection law. We do not currently collect any, and the demo's health
            questionnaire does not send anything anywhere.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            When the platform launches and we do need health information to arrange screening, we
            will ask for your explicit consent first, tell you exactly who it is shared with, and
            update this notice before any of that begins. If you email us something about your
            health in the meantime, we will hold it only for as long as it takes to answer you.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Who else sees your data</h2>
          <p style={pStyle}>We use a small number of service providers:</p>
          <ul style={{ ...pStyle, paddingLeft: '20px' }}>
            <li><strong style={{ color: '#fff' }}>Amazon Web Services</strong> — hosting and content delivery.</li>
            <li><strong style={{ color: '#fff' }}>Gandi</strong> — our domain registrar and email provider, so they handle mail you send us.</li>
            <li><strong style={{ color: '#fff' }}>Google</strong> — font delivery only, as described above.</li>
          </ul>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            We do not sell personal data, share it with advertisers, or disclose it to anyone else
            except where we are legally required to.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>International transfers</h2>
          <p style={pStyle}>
            Our providers may process data outside the UK. Where that happens we rely on UK
            adequacy regulations or the International Data Transfer Addendum to the EU Standard
            Contractual Clauses. You can ask us for details of the safeguards that apply to any
            particular transfer.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            When the platform launches, arranging screening will involve sharing information with
            hospitals and travel partners in Asia. We will set out who, where, and on what basis
            before that starts.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>How long we keep things</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            Email correspondence: up to 24 months from our last exchange, then deleted, unless you
            have asked to stay on a launch list or we need it for a legal reason. Server logs: up
            to 90 days. Anything you asked us to delete: removed on request, subject to the
            exceptions below.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Your rights</h2>
          <p style={pStyle}>
            Under UK GDPR you can ask us to: give you a copy of your data; correct it if it is
            wrong; delete it; restrict what we do with it; provide it in a portable format; or
            stop processing it where we rely on legitimate interests. Where we rely on consent,
            you can withdraw it at any time without affecting what came before.
          </p>
          <p style={pStyle}>
            Email <a href="mailto:dpo@go-hch.com" style={linkStyle}>dpo@go-hch.com</a> and we will
            respond within one month. There is no charge.
          </p>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            We do not carry out automated decision-making or profiling that produces legal or
            similarly significant effects.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0 }}>
          <h2 style={h2Style}>Complaints</h2>
          <p style={{ ...pStyle, marginBottom: 0 }}>
            If you are unhappy with how we have handled your data, please tell us first so we can
            put it right. You also have the right to complain to the Information Commissioner's
            Office, the UK regulator, at{' '}
            <a href="https://ico.org.uk/make-a-complaint/" style={linkStyle} target="_blank" rel="noreferrer">
              ico.org.uk/make-a-complaint
            </a>{' '}
            or on 0303 123 1113.
          </p>
        </section>

        <section style={{ ...sectionStyle, paddingTop: 0, paddingBottom: '80px' }}>
          <h2 style={h2Style}>Changes</h2>
          <p style={pStyle}>
            We will update this notice as the platform develops, and materially before we start
            collecting health information or taking bookings. The effective date at the top tells
            you which version you are reading.
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
