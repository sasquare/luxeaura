import { Link } from 'react-router-dom'
import { JOY_WHATSAPP } from '../constants'

export default function ProductCard({ product }) {
  const {
    id, name, category, price, imageUrl,
    sizes = [], scentNotes = '', longevity,
    featured,
  } = product

  const waText = encodeURIComponent(
    `Hello LuxeAura! I'm interested in *${name}* (${category}).\nPlease send me more details.`
  )
  const waLink = `https://wa.me/${JOY_WHATSAPP}?text=${waText}`

  const preview = scentNotes
    ? scentNotes.length > 50 ? scentNotes.slice(0, 50) + '…' : scentNotes
    : null

  return (
    <div
      className="group relative bg-white flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 2px 16px rgba(11,11,11,0.07)', borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* Image — taller, no border glow */}
      <div className="relative overflow-hidden" style={{ height: '240px', background: '#F7F3EA' }}>
        {imageUrl
          ? <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: 'linear-gradient(145deg, #F0EBE0, #F7F3EA)' }}>
              <svg className="w-14 h-14 opacity-20" viewBox="0 0 24 24" fill="none" stroke="#8a7a40" strokeWidth="1">
                <path d="M12 2C8 2 6 5 6 8c0 4 2 6 4 8l2 2 2-2c2-2 4-4 4-8 0-3-2-6-6-6z" />
              </svg>
              <span className="text-xs opacity-30" style={{ color: '#8a7a40' }}>No image</span>
            </div>
        }

        {/* Category chip — top left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(11,11,11,0.72)', color: 'rgba(212,175,55,0.9)', backdropFilter: 'blur(6px)' }}>
          {category}
        </span>

        {/* Curated badge — top right, only featured */}
        {featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#D4AF37', color: '#0B0B0B' }}>
            ✦ Curated Pick
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-base leading-snug mb-1 line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
          {name}
        </h3>

        {preview && (
          <p className="text-xs mb-1.5 line-clamp-2 leading-relaxed" style={{ color: '#7a6a3a' }}>
            {preview}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3">
          {longevity && (
            <span className="text-xs" style={{ color: '#8a7a40' }}>⏱ {longevity}</span>
          )}
          {sizes.length > 0 && (
            <span className="text-xs" style={{ color: '#7a6a3a' }}>
              {sizes.slice(0, 2).join(' · ')}{sizes.length > 2 ? ' +' + (sizes.length - 2) : ''}
            </span>
          )}
        </div>

        <div className="mt-auto">
          {price && (
            <p className="text-xl font-bold mb-3"
              style={{ color: '#0B0B0B', fontFamily: "'Playfair Display', serif" }}>
              ₦{Number(price).toLocaleString()}
            </p>
          )}

          <Link to={`/product/${id}`}
            className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 mb-2"
            style={{ background: '#0B0B0B' }}>
            Order Now ✦
          </Link>

          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="block w-full text-center text-xs py-2 rounded-lg transition-all hover:bg-green-50"
            style={{ color: '#1AAD5A', border: '1px solid rgba(26,173,90,0.2)' }}>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
