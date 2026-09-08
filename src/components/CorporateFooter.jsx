import { NavLink } from 'react-router-dom'

export default function CorporateFooter() {
  return (
    <footer
      style={{
        padding: '24px 48px',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
          © 2026 Health Check Holidays Ltd. Nothing on this site constitutes a booking, offer, or
          medical advice.
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <NavLink to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            Privacy
          </NavLink>
          <NavLink to="/terms" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
            Terms
          </NavLink>
        </div>
      </div>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
        Health Check Holidays Ltd, registered in England &amp; Wales, company no. 17079237.
        Registered office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
      </span>
    </footer>
  )
}
