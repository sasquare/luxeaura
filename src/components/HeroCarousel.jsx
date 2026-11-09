import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    title: 'Luxury · Quality · Elegance',
    subtitle: 'Premium fragrances that define who you are',
    cta: 'Shop Now', ctaLink: '#catalog',
    bg: 'linear-gradient(135deg, #0B0B0B 0%, #1a1200 100%)',
  },
  {
    id: 'f2',
    title: 'Signature Collections',
    subtitle: 'Curated blends for every occasion',
    cta: 'Explore', ctaLink: '#catalog',
    bg: 'linear-gradient(135deg, #111111 0%, #0d2b1a 100%)',
  },
  {
    id: 'f3',
    title: 'Wholesale & Bulk',
    subtitle: 'Premium fragrances at scale for retailers',
    cta: 'View Wholesale', ctaLink: '/wholesale',
    bg: 'linear-gradient(135deg, #0F5132 0%, #0B0B0B 100%)',
  },
]

export default function HeroCarousel() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  useEffect(() => {
    if (!isFirebaseReady || !db) return

    // Try hero_slides collection first
    const heroQ = query(
      collection(db, 'hero_slides'),
      where('active', '==', true),
      orderBy('order', 'asc'),
      limit(6)
    )

    // Also watch products with images for catalog carousel
    const prodQ = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(8)
    )

    let heroSlides  = []
    let prodSlides  = []

    const merge = () => {
      // Hero slides take priority; fall back to product images
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
    const t = setTimeout(advance, 5000)
    return () => clearTimeout(t)
  }, [paused, current, advance, slides.length])

  const go   = (idx) => setCurrent(idx)
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  const s = slides[current] || slides[0]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(380px, 55vw, 560px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === current
        return (
          <div key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}>

            {/* Background */}
            {slide.imageUrl
              ? <img src={slide.imageUrl} alt={slide.title || 'LuxeAura'}
                  className="w-full h-full object-cover" />
              : <div className="w-full h-full" style={{ background: slide.bg }} />
            }

            {/* Dark overlay — deeper on image slides */}
            <div className="absolute inset-0"
              style={{ background: slide.imageUrl
                ? 'linear-gradient(to right, rgba(11,11,11,0.75) 0%, rgba(11,11,11,0.3) 60%, rgba(11,11,11,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))'
              }} />

            {/* Content — left-aligned on image slides, centered on gradient */}
            <div className={`absolute inset-0 flex flex-col justify-center px-8 sm:px-16 ${!slide.imageUrl ? 'items-center text-center' : 'items-start'}`}>
              <p className="text-xs uppercase tracking-[0.25em] mb-3 font-medium"
                style={{ color: '#D4AF37' }}>
                LuxeAura Enterprises
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-3 max-w-xl leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-white/75 text-base sm:text-lg mb-2 max-w-md line-clamp-2">
                  {slide.subtitle}
                </p>
              )}
              {slide.price && (
                <p className="text-2xl font-bold mb-5" style={{ color: '#D4AF37', fontFamily: "'Playfair Display', serif" }}>
                  ₦{Number(slide.price).toLocaleString()}
                </p>
              )}
              {!slide.price && <div className="mb-5" />}
              <Link to={slide.ctaLink || '#catalog'}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)', color: '#0B0B0B' }}>
                {slide.cta || 'Explore'} ✦
              </Link>
            </div>
          </div>
        )
      })}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.45)',
              }} />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute top-5 right-5 z-10 text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.6)' }}>
          {current + 1} / {slides.length}
        </div>
      )}
    </div>
  )
}
