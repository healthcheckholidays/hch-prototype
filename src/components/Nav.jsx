import { NavLink } from 'react-router-dom'

export function TopBar() {
  return (
    <nav className="top-bar">
      <NavLink to="/" className="logo">
        Health Check <span>Holidays</span>
      </NavLink>
      <div className="top-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Home</NavLink>
        <NavLink to="/destinations" className={({ isActive }) => isActive ? 'active' : ''}>Destinations</NavLink>
        <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'active' : ''}>How it works</NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Start planning</NavLink>
        <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>My account</NavLink>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span className="footer-logo">Health Check Holidays</span>
      <div>
        <a href="#">Accessibility</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>
    </footer>
  )
}

export function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span>›</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        </span>
      ))}
    </div>
  )
}
