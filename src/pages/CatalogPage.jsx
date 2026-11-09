import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { CATEGORIES, OCCASION_CATEGORIES } from '../constants'
import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import ProductCard from '../components/ProductCard'
import BlogSidebar from '../components/BlogSidebar'
import WholesaleBanner from '../components/WholesaleBanner'
import JoysPickWidget from '../components/JoysPickWidget'
import CustomerLoveWidget from '../components/CustomerLoveWidget'
import ShopByOccasionWidget from '../components/ShopByOccasionWidget'
import FindYourScentWidget from '../components/FindYourScentWidget'
import PerfumeRequestForm from '../components/PerfumeRequestForm'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

const DEMO_PRODUCTS = [
  { id: 'demo1', name: 'Rose Oud Elixir',    category: 'Woody & Oud',       price: 15000, imageUrl: null, sizes: ['30ml','50ml','100ml'], scentNotes: 'Rose petals, Oud, Amber, Sandalwood', longevity: '8+ hrs',  featured: true  },
  { id: 'demo2', name: 'Midnight Jasmine',   category: 'Floral',            price: 12000, imageUrl: null, sizes: ['15ml','30ml','50ml'],  scentNotes: 'Jasmine, White Musk, Vanilla',         longevity: '6–8 hrs', featured: false },
  { id: 'demo3', name: 'Citrus Burst',       category: 'Fresh & Citrus',    price: 9500,  imageUrl: null, sizes: ['30ml','50ml'],         scentNotes: 'Bergamot, Lemon, Green Tea, Cedar',    longevity: '4–6 hrs', featured: true  },
  { id: 'demo4', name: 'Oriental Mystique',  category: 'Oriental & Exotic', price: 18000, imageUrl: null, sizes: ['50ml','100ml'],        scentNotes: 'Patchouli, Amber, Incense, Vanilla',   longevity: '8+ hrs',  featured: false },
]

const SHOP_CATEGORIES = [
  {
    id: 'mens',
    label: "Men's Fragrances",
    description: 'Bold, sophisticated scents for the modern man',
    filter: 'Woody & Oud',
    gradient: 'linear-gradient(145deg, #0B0B0B 0%, #1c1600 100%)',
    accent: '#D4AF37',
  },
  {
    id: 'womens',
    label: "Women's Fragrances",
    description: 'Elegant florals and oriental blends',
    filter: 'Floral',
    gradient: 'linear-gradient(145deg, #0B0B0B 0%, #1a0a14 100%)',
    accent: '#D4AF37',
  },
  {
    id: 'unisex',
    label: 'Unisex Fragrances',
    description: 'Timeless, boundary-free scents',
    filter: 'Unisex',
    gradient: 'linear-gradient(145deg, #0B0B0B 0%, #0a1410 100%)',
    accent: '#D4AF37',
  },
]

const EXPERIENCE_PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Authentic Fragrances',
    desc: 'Every fragrance is carefully sourced and verified for quality and authenticity.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'Premium Quality',
    desc: 'Luxury oil-based and alcohol-based fragrances curated for every occasion.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Nationwide Delivery',
    desc: 'Fast, reliable delivery across Lagos and all Nigerian states.',
  },
]

function SectionHeader({ eyebrow, title, right }) {
  return (
    <div className="flex items-end justify-between mb-8 sm:mb-6">
      <div>
        {eyebrow && (
          <p className="uppercase tracking-widest font-medium mb-1.5" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}>
            {eyebrow}
          </p>
        )}
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3vw, 28px)', color: '#0B0B0B', fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </h2>
      </div>
      {right}
    </div>
  )
}

export default function CatalogPage() {
  const [products, setProducts]             = useState(DEMO_PRODUCTS)
  const [loading, setLoading]               = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeBase, setActiveBase]         = useState('ALL')
  const [activeOccasion, setActiveOccasion] = useState(null)
  const catalogRef = useRef(null)

  useEffect(() => {
    if (!isFirebaseReady || !db) { setLoading(false); return }
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleCategorySelect = (filter) => {
    setActiveCategory(filter)
    setActiveOccasion(null)
    scrollToCatalog()
  }

  const handleOccasion = (occ) => {
    setActiveOccasion(occ)
    setActiveCategory('ALL')
  }

  const filtered = products.filter(p => {
    const occCats = activeOccasion ? OCCASION_CATEGORIES[activeOccasion] : null
    const catOk   = activeCategory === 'ALL' || p.category === activeCategory
    const baseOk  = activeBase === 'ALL' || p.baseType === activeBase
    const occOk   = !occCats || occCats.includes(p.category)
    return catOk && baseOk && occOk
  })

  const bestsellers  = products.filter(p => p.featured).slice(0, 4)
  const showBest     = bestsellers.length > 0 ? bestsellers : products.slice(0, 4)
  const newArrivals  = products.slice(0, 4)

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      <HeroCarousel />

      {/* ── SHOP BY CATEGORY ───────────────────────────────────── */}
      <section style={{ background: '#FFFFFF' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
          <SectionHeader eyebrow="Discover" title="Shop by Category" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {SHOP_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.filter)}
                className="relative overflow-hidden text-left group transition-transform duration-300 hover:-translate-y-0.5"
                style={{ borderRadius: '6px', height: 'clamp(140px, 18vw, 200px)' }}
              >
                <div className="absolute inset-0" style={{ background: cat.gradient }} />
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.08)' }} />

                {/* Decorative ring */}
                <div
                  className="absolute right-5 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-18 transition-opacity"
                  style={{
                    width: '80px', height: '80px',
                    borderRadius: '50%',
                    border: '1px solid #D4AF37',
                  }}
                />
                <div
                  className="absolute right-10 top-1/2 -translate-y-1/2 opacity-6 group-hover:opacity-12 transition-opacity"
                  style={{
                    width: '50px', height: '50px',
                    borderRadius: '50%',
                    border: '1px solid #D4AF37',
                  }}
                />

                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-7">
                  <p className="font-bold leading-tight mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(16px, 2vw, 20px)', color: '#FFFFFF' }}>
                    {cat.label}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{cat.description}</p>
                  <p className="mt-3 font-semibold uppercase tracking-wider" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.15em' }}>
                    Shop Now →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ────────────────────────────────────────── */}
      <section style={{ background: '#F7F3EA' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
          <SectionHeader
            eyebrow="Our Selection"
            title={bestsellers.length > 0 ? 'Bestsellers' : 'Featured Fragrances'}
            right={
              <button
                onClick={scrollToCatalog}
                className="text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 flex-shrink-0 mb-1"
                style={{ color: '#0B0B0B', letterSpacing: '0.12em', fontSize: '11px' }}
              >
                View All →
              </button>
            }
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-[18px]">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded bg-white animate-pulse" style={{ height: '320px', border: '1px solid #EAE7E0' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-[18px]">
              {showBest.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── THE LUXEAURA EXPERIENCE ─────────────────────────────── */}
      <section style={{ background: '#FFFFFF', borderTop: '1px solid #EAE7E0', borderBottom: '1px solid #EAE7E0' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(36px,5vw,64px)', paddingBottom: 'clamp(36px,5vw,64px)' }}>
          <div className="text-center mb-10">
            <p className="uppercase tracking-widest font-medium mb-2" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}>Why LuxeAura</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px,2.8vw,26px)', color: '#0B0B0B', fontWeight: 700 }}>
              The LuxeAura Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {EXPERIENCE_PILLARS.map((p, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#F7F3EA', color: '#0B0B0B' }}
                >
                  {p.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#0B0B0B' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#777777', lineHeight: 1.65, maxWidth: '220px', margin: '0 auto' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section style={{ background: '#F7F3EA' }}>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
            <SectionHeader
              eyebrow="Just In"
              title="New Arrivals"
              right={
                <button
                  onClick={scrollToCatalog}
                  className="text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 flex-shrink-0 mb-1"
                  style={{ color: '#0B0B0B', letterSpacing: '0.12em', fontSize: '11px' }}
                >
                  View All →
                </button>
              }
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-[18px]">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHOLESALE CTA ───────────────────────────────────────── */}
      <section style={{ background: '#0B0B0B' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(48px,7vw,80px)', paddingBottom: 'clamp(48px,7vw,80px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left: text */}
            <div>
              <p className="uppercase tracking-widest font-medium mb-4" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}>
                Bulk Purchases
              </p>
              <h2 className="font-bold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px,3.5vw,38px)', color: '#FFFFFF' }}>
                Wholesale Fragrance<br />Enquiries
              </h2>
              <p className="mb-8 max-w-md" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Partner with LuxeAura for premium fragrances at competitive wholesale rates. Available for retailers, vendors and bulk buyers across Nigeria.
              </p>
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 font-semibold uppercase tracking-wider transition-all hover:opacity-85"
                style={{
                  fontSize: '11px',
                  height: '44px',
                  padding: '0 28px',
                  background: '#D4AF37',
                  color: '#0B0B0B',
                  borderRadius: '3px',
                  letterSpacing: '0.12em',
                }}
              >
                Explore Wholesale
              </Link>
            </div>

            {/* Right: decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative" style={{ width: '300px', height: '300px' }}>
                <div className="absolute inset-0 rounded-full opacity-5" style={{ border: '1px solid #D4AF37' }} />
                <div className="absolute inset-6 rounded-full opacity-8" style={{ border: '1px solid #D4AF37' }} />
                <div className="absolute inset-12 rounded-full opacity-12" style={{ border: '1px solid #D4AF37' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '72px', color: 'rgba(212,175,55,0.08)', fontWeight: 700, lineHeight: 1, userSelect: 'none' }}>LA</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p style={{ fontSize: '11px', color: 'rgba(212,175,55,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>LuxeAura</p>
                    <div className="mt-2 mx-auto" style={{ width: '32px', height: '1px', background: 'rgba(212,175,55,0.3)' }} />
                    <p className="mt-2" style={{ fontSize: '10px', color: 'rgba(212,175,55,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Wholesale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL CATALOG ────────────────────────────────────────── */}
      <div ref={catalogRef} id="catalog" style={{ background: '#FFFFFF' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: 'clamp(40px,6vw,72px)', paddingBottom: 'clamp(40px,6vw,80px)' }}>

          {/* Catalog header */}
          <div className="mb-6">
            <p className="uppercase tracking-widest font-medium mb-1.5" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}>Complete Collection</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px,3vw,28px)', color: '#0B0B0B', fontWeight: 700 }}>
              All Fragrances
            </h2>
          </div>

          {/* Filters */}
          <div className="pb-6 space-y-3" style={{ borderBottom: '1px solid #EAE7E0', marginBottom: '24px' }}>
            <div className="flex flex-wrap gap-2">
              {['ALL', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setActiveOccasion(null) }}
                  className="px-3 py-1.5 font-medium transition-all duration-150"
                  style={{
                    fontSize: '11px',
                    borderRadius: '3px',
                    background: activeCategory === cat && !activeOccasion ? '#0B0B0B' : '#F7F3EA',
                    color:      activeCategory === cat && !activeOccasion ? '#FFFFFF'  : '#0B0B0B',
                    border:     activeCategory === cat && !activeOccasion ? '1px solid #0B0B0B' : '1px solid #EAE7E0',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'Oil Based', 'Alcohol Based'].map(b => (
                <button
                  key={b}
                  onClick={() => setActiveBase(b)}
                  className="px-3 py-1.5 font-medium transition-all duration-150"
                  style={{
                    fontSize: '11px',
                    borderRadius: '3px',
                    background: activeBase === b ? '#D4AF37' : '#F7F3EA',
                    color:      activeBase === b ? '#0B0B0B' : '#777777',
                    border:     activeBase === b ? '1px solid #D4AF37' : '1px solid #EAE7E0',
                  }}
                >
                  {b}
                </button>
              ))}
              {activeOccasion && (
                <span className="px-3 py-1.5 font-medium" style={{ fontSize: '11px', borderRadius: '3px', background: '#F7F3EA', color: '#D4AF37', border: '1px solid #D4AF37' }}>
                  ✦ {activeOccasion}
                  <button onClick={() => setActiveOccasion(null)} className="ml-1.5 opacity-60 hover:opacity-100">×</button>
                </span>
              )}
            </div>
          </div>

          {/* Desktop 3-col layout: left sidebar / grid / right widgets */}
          <div className="xl:grid xl:grid-cols-[220px_1fr_260px] xl:gap-8">

            {/* Left sidebar */}
            <div className="hidden xl:block space-y-4">
              <BlogSidebar />
              <WholesaleBanner />
            </div>

            {/* Product grid */}
            <div>
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-2xl mb-2">🌿</p>
                  <p className="font-medium mb-1" style={{ color: '#0B0B0B' }}>No fragrances found</p>
                  <p className="text-sm" style={{ color: '#777777' }}>Try clearing your filters</p>
                </div>
              )}

              {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-[18px] 2xl:gap-[22px]">
                  {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}

              {/* Mobile widgets */}
              <div className="xl:hidden mt-10 space-y-4">
                <JoysPickWidget products={products} />
                <CustomerLoveWidget />
                <ShopByOccasionWidget activeOccasion={activeOccasion} onSelect={handleOccasion} />
                <FindYourScentWidget />
                <BlogSidebar />
                <WholesaleBanner />
              </div>

              <div className="mt-12">
                <PerfumeRequestForm />
              </div>
            </div>

            {/* Right widgets */}
            <div className="hidden xl:block">
              <div className="sticky top-24 space-y-4">
                <JoysPickWidget products={products} />
                <CustomerLoveWidget />
                <ShopByOccasionWidget activeOccasion={activeOccasion} onSelect={handleOccasion} />
                <FindYourScentWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
