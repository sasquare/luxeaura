import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/',           label: 'Catalog' },
    { to: '/wholesale',  label: 'Wholesale' },
    { to: '/admin',      label: 'Admin' },
  ]

  return (
    <nav style={{ background: '#0B0B0B' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)', color: '#0B0B0B' }}
            >
              LE
            </div>
            <div className="hidden sm:block">
              <span
                style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37', letterSpacing: '0.08em' }}
                className="text-xl font-semibold block leading-tight"
              >
                LuxeAura Enterprises
              </span>
              <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: 'rgba(212,175,55,0.6)' }}>
                Luxury · Quality · Elegance
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: pathname === l.to ? '#D4AF37' : 'rgba(255,255,255,0.8)',
                  background: pathname === l.to ? 'rgba(212,175,55,0.12)' : 'transparent',
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-white"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t" style={{ borderColor: 'rgba(212,175,55,0.2)', background: '#111111' }}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-medium transition-colors"
              style={{ color: pathname === l.to ? '#D4AF37' : 'rgba(255,255,255,0.8)' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
