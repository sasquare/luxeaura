import { Link } from 'react-router-dom'

export default function WholesaleBanner() {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4"
      style={{
        background: 'linear-gradient(135deg, #FEF3EE, #FDF6EC)',
        border: '1px solid #C9927C',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#C9927C" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#C9927C' }}>For Retailers</p>
        <h3
          className="font-bold text-sm mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}
        >
          Wholesale Store
        </h3>
        <p className="text-xs mb-3" style={{ color: '#7a4a3a' }}>
          Dozens, bulk canisters &amp; custom blends for resellers and beauty stores.
        </p>
        <Link
          to="/wholesale"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5"
          style={{ color: '#5C1A2B' }}
        >
          View Wholesale Prices
          <svg className="w-3.5 h-3.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="#C9927C" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
