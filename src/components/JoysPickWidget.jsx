import { Link } from 'react-router-dom'

export default function JoysPickWidget({ products = [] }) {
  const pick = products.find(p => p.featured)
  if (!pick) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #D4AF37', background: '#F7F3EA' }}
    >
      {/* Header */}
      <div className="px-5 py-3" style={{ background: 'linear-gradient(135deg, #0B0B0B, #111111)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#D4AF37' }}>
          ✦ Joy's Pick
        </p>
      </div>

      {/* Product */}
      <div className="p-4">
        {pick.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3" style={{ height: '140px' }}>
            <img src={pick.imageUrl} alt={pick.name} className="w-full h-full object-cover" />
          </div>
        )}
        <h4
          className="font-semibold text-sm leading-snug mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}
        >
          {pick.name}
        </h4>
        {pick.scentNotes && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#7a6a3a' }}>{pick.scentNotes}</p>
        )}
        {pick.price && (
          <p className="text-base font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            ₦{Number(pick.price).toLocaleString()}
          </p>
        )}
        <Link
          to={`/product/${pick.id}`}
          className="block w-full text-center py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
        >
          Order Now ✦
        </Link>
      </div>
    </div>
  )
}
