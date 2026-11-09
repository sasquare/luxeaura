import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/#catalog',  label: 'Shop' },
    { to: '/wholesale', label: 'Wholesale' },
    { to: '/about',     label: 'About' },
    { to: '/contact',   label: 'Contact' },
  ]

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to.replace('/#catalog', ''))

  return (
    <nav style={{ background: '#0B0B0B' }} className="sticky top-0 z-50" role="navigation">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between" style={{ height: '68px' }}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs tracking-widest"
              style={{ background: '#D4AF37', color: '#0B0B0B' }}
            >
              LA
            </div>
            <div>
              <span
                className="block font-semibold leading-tight tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37', fontSize: '17px' }}
              >
                LuxeAura
              </span>
              <span
                className="block uppercase tracking-[0.2em]"
                style={{ fontSize: '8px', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.22em' }}
              >
                Enterprises
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => {
              const active = l.to === '/' ? pathname === '/' : pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{ color: active ? '#D4AF37' : 'rgba(255,255,255,0.72)', fontSize: '13px' }}
                >
                  {l.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-px"
                      style={{ background: '#D4AF37' }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden"
          style={{ background: '#111111', borderTop: '1px solid rgba(212,175,55,0.12)' }}
        >
          {links.map(l => {
            const active = l.to === '/' ? pathname === '/' : pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 text-sm font-medium transition-colors"
                style={{
                  color: active ? '#D4AF37' : 'rgba(255,255,255,0.72)',
                  fontSize: '13px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
