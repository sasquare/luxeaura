import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const {
    id, name, category, price, imageUrl,
    sizes = [], featured,
  } = product

  return (
    <div
      className="group flex flex-col bg-white transition-shadow duration-300"
      style={{
        borderRadius: '6px',
        border: '1px solid #EAE7E0',
        boxShadow: hovered ? '0 4px 20px rgba(11,11,11,0.1)' : '0 1px 4px rgba(11,11,11,0.05)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: '230px', background: '#F7F3EA' }}
      >
        {imageUrl
          ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full transition-transform duration-500 group-hover:scale-103"
              style={{ objectFit: 'contain', objectPosition: 'center' }}
            />
          )
          : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 opacity-15" viewBox="0 0 24 24" fill="none" stroke="#8a7a40" strokeWidth="1">
                <path d="M12 2C8 2 6 5 6 8c0 4 2 6 4 8l2 2 2-2c2-2 4-4 4-8 0-3-2-6-6-6z" />
              </svg>
            </div>
          )
        }

        {/* Category chip */}
        <span
          className="absolute top-2.5 left-2.5 uppercase tracking-widest font-medium"
          style={{
            fontSize: '9px',
            color: 'rgba(212,175,55,0.9)',
            background: 'rgba(11,11,11,0.7)',
            backdropFilter: 'blur(4px)',
            padding: '3px 7px',
            borderRadius: '2px',
            letterSpacing: '0.12em',
          }}
        >
          {category}
        </span>

        {/* Curated badge */}
        {featured && (
          <span
            className="absolute top-2.5 right-2.5 uppercase tracking-wider font-semibold"
            style={{
              fontSize: '8px',
              background: '#D4AF37',
              color: '#0B0B0B',
              padding: '3px 7px',
              borderRadius: '2px',
              letterSpacing: '0.1em',
            }}
          >
            Curated
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1" style={{ padding: '14px' }}>
        <h3
          className="font-medium leading-snug mb-1 line-clamp-2"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            color: '#0B0B0B',
            fontWeight: 500,
          }}
        >
          {name}
        </h3>

        {sizes.length > 0 && (
          <p
            className="mb-2"
            style={{ fontSize: '11px', color: '#777777' }}
          >
            {sizes.slice(0, 3).join(' · ')}
          </p>
        )}

        <div className="mt-auto">
          {price && (
            <p
              className="mb-3 font-semibold"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '16px',
                color: '#0B0B0B',
              }}
            >
              ₦{Number(price).toLocaleString()}
            </p>
          )}

          <Link
            to={`/product/${id}`}
            className="block w-full text-center font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              fontSize: '12px',
              height: '38px',
              lineHeight: '38px',
              borderRadius: '4px',
              background: hovered ? '#D4AF37' : '#0B0B0B',
              color: hovered ? '#0B0B0B' : '#D4AF37',
              letterSpacing: '0.1em',
            }}
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  )
}
