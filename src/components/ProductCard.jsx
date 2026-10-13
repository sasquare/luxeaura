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
    ? scentNotes.length > 45 ? scentNotes.slice(0, 45) + '…' : scentNotes
    : null

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
      style={
        featured
          ? { boxShadow: '0 0 0 2px #D4AF37, 0 8px 32px rgba(212,175,55,0.15)' }
          : { boxShadow: '0 2px 12px rgba(11,11,11,0.08)' }
      }
    >
      {/* Rose-gold stripe on featured */}
      {featured && (
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #D4AF37, #b8962e, #D4AF37)' }} />
      )}

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F7F3EA]" style={{ height: '200px' }}>
        {imageUrl
          ? <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          : <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F0EBE0, #F7F3EA)' }}
            >
              <svg className="w-12 h-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <path d="M12 2C8 2 6 5 6 8c0 4 2 6 4 8l2 2 2-2c2-2 4-4 4-8 0-3-2-6-6-6z" />
              </svg>
            </div>
        }

        {/* Category chip */}
        <span
          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(11,11,11,0.75)', color: '#D4AF37', backdropFilter: 'blur(4px)' }}
        >
          {category}
        </span>

        {/* Featured badge */}
        {featured && (
          <span
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: '#D4AF37', color: '#fff' }}
          >
            ✦ Curated Pick
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-semibold text-base leading-tight mb-1 line-clamp-2"
          style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}
        >
          {name}
        </h3>

        {preview && (
          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#7a6a3a' }}>
            {preview}
          </p>
        )}

        {longevity && (
          <p className="text-xs mb-2" style={{ color: '#8a7a40' }}>
            🕐 {longevity}
          </p>
        )}

        {sizes.length > 0 && (
          <p className="text-xs mb-3" style={{ color: '#7a6a3a' }}>
            {sizes.slice(0, 3).join(' · ')}{sizes.length > 3 ? ' …' : ''}
          </p>
        )}

        {/* Price */}
        <div className="mt-auto">
          {price && (
            <p
              className="text-lg font-bold mb-3"
              style={{ color: '#0B0B0B', fontFamily: "'Playfair Display', serif" }}
            >
              ₦{Number(price).toLocaleString()}
            </p>
          )}

          {/* Primary CTA */}
          <Link
            to={`/product/${id}`}
            className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 mb-2"
            style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
          >
            Order Now ✦
          </Link>

          {/* WhatsApp subtle link */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center text-xs py-1.5 rounded-xl transition-colors"
            style={{ color: '#1AAD5A', border: '1px solid rgba(26,173,90,0.25)' }}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
