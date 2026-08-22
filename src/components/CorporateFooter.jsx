import { NavLink } from 'react-router-dom'

export default function CorporateFooter() {
  return (
    <footer
      style={{
        padding: '24px 48px',
        borderTop: '1px solid rgba(255,255,255,0.12)',
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
      <NavLink to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
        Privacy
      </NavLink>
    </footer>
  )
}
