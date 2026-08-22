import { NavLink } from 'react-router-dom'

export default function CorporateHeader() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#FAA805' : 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  })

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 48px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <NavLink to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>
          Health Check <span style={{ color: '#FAA805' }}>Holidays</span>
        </span>
      </NavLink>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
        <NavLink to="/" end style={linkStyle}>Home</NavLink>
        <NavLink to="/about" style={linkStyle}>About</NavLink>
        <a
          href="https://demo.go-hch.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.75)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
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
        <a
          href="mailto:info@go-hch.com"
          style={{
            background: '#FAA805',
            color: '#145247',
            fontWeight: 600,
            padding: '10px 22px',
            borderRadius: 999,
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}
        >
          Contact Us
        </a>
      </nav>
    </header>
  )
}
