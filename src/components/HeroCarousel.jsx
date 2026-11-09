import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    title: 'The Art of Fine Fragrance',
    subtitle: 'Discover exceptional fragrances that leave a lasting impression.',
    cta: 'Explore Collection', ctaLink: '/#catalog',
    bg: 'linear-gradient(135deg, #0B0B0B 0%, #1a1200 60%, #2a1a00 100%)',
  },
  {
    id: 'f2',
    title: 'Signature Collections',
    subtitle: 'Curated blends for every mood and occasion.',
    cta: 'Shop Now', ctaLink: '/#catalog',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #0a1a10 100%)',
  },
  {
    id: 'f3',
    title: 'Wholesale & Retail',
    subtitle: 'Premium fragrances at scale — for retailers and bulk buyers.',
    cta: 'View Wholesale', ctaLink: '/wholesale',
    bg: 'linear-gradient(135deg, #0B0B0B 0%, #111111 100%)',
  },
]

export default function HeroCarousel() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  useEffect(() => {
    if (!isFirebaseReady || !db) return

    const heroQ = query(
      collection(db, 'hero_slides'),
      where('active', '==', true),
      orderBy('order', 'asc'),
      limit(6)
    )

    const prodQ = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(8)
    )

    let heroSlides = []
    let prodSlides = []

    const merge = () => {
      if (heroSlides.length > 0) {
        setSlides(heroSlides)
      } else if (prodSlides.length > 0) {
        setSlides(prodSlides)
      } else {
        setSlides(FALLBACK_SLIDES)
      }
    }

    const unsubHero = onSnapshot(heroQ, snap => {
      heroSlides = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      merge()
    })

    const unsubProd = onSnapshot(prodQ, snap => {
      prodSlides = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.imageUrl)
        .map(p => ({
          id: p.id,
          title: p.name,
          subtitle: p.scentNotes || p.category || '',
          price: p.price,
          cta: 'Order Now',
          ctaLink: `/product/${p.id}`,
          imageUrl: p.imageUrl,
        }))
      merge()
    })

    return () => { unsubHero(); unsubProd() }
  }, [])

  const advance = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setTimeout(advance, 5500)
    return () => clearTimeout(t)
  }, [paused, current, advance, slides.length])

  const go   = (i) => setCurrent(i)
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 'clamp(220px, 30vw, 380px)',
        maxHeight: '420px',
        borderRadius: '0',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === current
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
          >
            {/* Background */}
            {slide.imageUrl
              ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title || 'LuxeAura'}
                  className="w-full h-full"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              )
              : (
                <div className="w-full h-full" style={{ background: slide.bg }} />
              )
            }

            {/* Gradient overlay — left-side text contrast only */}
            <div
              className="absolute inset-0"
              style={{
                background: slide.imageUrl
                  ? 'linear-gradient(to right, rgba(11,11,11,0.78) 0%, rgba(11,11,11,0.4) 50%, rgba(11,11,11,0.05) 100%)'
                  : 'rgba(0,0,0,0.12)',
              }}
            />

            {/* Text — left-aligned desktop, bottom-left mobile */}
            <div
              className="absolute inset-0 flex flex-col justify-end sm:justify-center"
              style={{ padding: 'clamp(20px, 4vw, 64px)', paddingBottom: 'clamp(28px, 5vw, 48px)' }}
            >
              <p
                className="uppercase tracking-widest font-medium mb-2"
                style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}
              >
                LuxeAura Enterprises
              </p>

              <h2
                className="font-bold text-white leading-tight mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(22px, 3.5vw, 42px)',
                  maxWidth: '520px',
                  lineHeight: 1.15,
                }}
              >
                {slide.title}
              </h2>

              {slide.subtitle && (
                <p
                  className="mb-4 max-w-sm"
                  style={{
                    fontSize: 'clamp(12px, 1.4vw, 15px)',
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.5,
                  }}
                >
                  {slide.subtitle.length > 80 ? slide.subtitle.slice(0, 80) + '…' : slide.subtitle}
                </p>
              )}

              {slide.price && (
                <p
                  className="font-bold mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(16px, 2vw, 22px)',
                    color: '#D4AF37',
                  }}
                >
                  ₦{Number(slide.price).toLocaleString()}
                </p>
              )}

              <Link
                to={slide.ctaLink || '/#catalog'}
                className="inline-flex items-center uppercase tracking-wider font-semibold transition-all duration-200 hover:opacity-85 self-start"
                style={{
                  fontSize: '11px',
                  height: 'clamp(36px, 5vw, 44px)',
                  padding: '0 clamp(16px, 2.5vw, 28px)',
                  background: '#D4AF37',
                  color: '#0B0B0B',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                }}
              >
                {slide.cta || 'Explore'}
              </Link>
            </div>
          </div>
        )
      })}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
