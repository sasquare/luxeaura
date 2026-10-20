import { Link } from 'react-router-dom'
import { JOY_WHATSAPP } from '../constants'

export default function Footer() {
  const waLink = `https://wa.me/${JOY_WHATSAPP}?text=${encodeURIComponent('Hello LuxeAura Enterprises!')}`

  return (
    <footer style={{ background: '#0B0B0B', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37', fontSize: '1.25rem' }} className="font-bold mb-1">
              LuxeAura Enterprises
            </p>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(212,175,55,0.45)' }}>
              Luxury · Quality · Elegance
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Premium oil-based and alcohol-based fragrances, curated and delivered across Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>Quick Links</p>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Catalog' },
                { to: '/wholesale', label: 'Wholesale' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/shipping', label: 'Shipping & Delivery' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-xs transition-colors hover:text-yellow-300" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>Contact Us</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+2348037516796" className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>+234 803 751 6796</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:joy@luxeauraent.com" className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>joy@luxeauraent.com</a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Festac, Lagos, Nigeria</span>
              </li>
              <li>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:opacity-90"
                  style={{ background: '#25D366', color: '#fff' }}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.857L.054 23.5l5.832-1.53A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.502-5.184-1.381l-.371-.22-3.862 1.013 1.03-3.773-.241-.386A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery & Payment */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#D4AF37' }}>Delivery & Payment</p>
            <ul className="space-y-2 mb-4">
              {[
                'Lagos: 1–2 business days',
                'Other states: 3–5 business days',
                'Nationwide delivery available',
                'Free pickup (Festac, Lagos)',
              ].map(t => (
                <li key={t} className="flex items-start gap-1.5">
                  <span style={{ color: '#D4AF37' }} className="text-xs">✦</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>We accept:</p>
            <div className="flex flex-wrap gap-1.5">
              {['Bank Transfer', 'Visa', 'Verve', 'Mastercard'].map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.8)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(212,175,55,0.1)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} LuxeAura Enterprises · Joy Oriabure · All rights reserved
          </p>
          <div className="flex gap-4">
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
              { to: '/returns', label: 'Returns' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="text-xs transition-colors hover:text-yellow-300"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
