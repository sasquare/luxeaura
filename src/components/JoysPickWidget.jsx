import { Link } from 'react-router-dom'

export default function JoysPickWidget({ products = [] }) {
  const pick = products.find(p => p.featured)
  if (!pick) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #C9927C', background: '#FDF6EC' }}
    >
      {/* Header */}
      <div className="px-5 py-3" style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C9927C' }}>
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
          style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}
        >
          {pick.name}
        </h4>
        {pick.scentNotes && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#9a6a5a' }}>{pick.scentNotes}</p>
        )}
        {pick.price && (
          <p className="text-base font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
            ₦{Number(pick.price).toLocaleString()}
          </p>
        )}
        <Link
          to={`/product/${pick.id}`}
          className="block w-full text-center py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}
        >
          Order Now ✦
        </Link>
      </div>
    </div>
  )
}
