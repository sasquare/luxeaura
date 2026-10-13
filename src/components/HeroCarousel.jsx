import { useState, useEffect, useCallback } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    title: 'Luxury Fragrance Boutique',
    subtitle: 'Discover scents that tell your story',
    cta: 'Shop Now',
    bg: 'linear-gradient(135deg, #5C1A2B 0%, #3D0A14 60%, #8B2E3A 100%)',
  },
  {
    id: 'f2',
    title: 'Signature Collections',
    subtitle: 'Curated blends for every occasion',
    cta: 'Explore',
    bg: 'linear-gradient(135deg, #3D0A14 0%, #5C1A2B 50%, #C9927C33 100%)',
  },
  {
    id: 'f3',
    title: 'Wholesale & Bulk',
    subtitle: 'Premium fragrances at scale',
    cta: 'Wholesale',
    bg: 'linear-gradient(135deg, #8B2E3A 0%, #5C1A2B 60%, #3D0A14 100%)',
  },
]

export default function HeroCarousel() {
  const [slides, setSlides]   = useState(FALLBACK_SLIDES)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  useEffect(() => {
    if (!isFirebaseReady || !db) return
    const q = query(
      collection(db, 'hero_slides'),
      where('active', '==', true),
      orderBy('order', 'asc'),
      limit(5)
    )
    return onSnapshot(q, snap => {
      if (!snap.empty) {
        setSlides(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      }
    })
  }, [])

  const advance = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(advance, 5000)
    return () => clearTimeout(t)
  }, [paused, current, advance])

  const go = (idx) => { setCurrent(idx) }
  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '480px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const isActive = i === current
        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              background: s.imageUrl ? undefined : s.bg,
            }}
          >
            {s.imageUrl && (
              <img
                src={s.imageUrl}
                alt={s.title || 'LuxeAura'}
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: s.imageUrl
                  ? 'linear-gradient(to bottom, rgba(61,10,20,0.3) 0%, rgba(61,10,20,0.7) 100%)'
                  : undefined,
              }}
            />
            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p
                className="text-sm uppercase tracking-[0.2em] mb-3"
                style={{ color: '#C9927C', fontFamily: "'Inter', sans-serif" }}
              >
                LuxeAura · Premium Fragrances
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-white mb-4 max-w-2xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}
              >
                {s.title}
              </h1>
              {s.subtitle && (
                <p className="text-white/80 text-lg mb-8 max-w-xl">{s.subtitle}</p>
              )}
              <a
                href={s.ctaLink || '#catalog'}
                className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #C9927C, #a07060)', fontFamily: "'Inter', sans-serif" }}
              >
                {s.cta || 'Explore Collection'}
              </a>
            </div>
          </div>
        )
      })}

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
            aria-label="Next"
          >
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
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === current ? '28px' : '8px',
                height: '8px',
                background: i === current ? '#C9927C' : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
