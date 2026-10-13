import { useState, useEffect } from 'react'
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

const DEMO_PRODUCTS = [
  {
    id: 'demo1', name: 'Rose Oud Elixir', category: 'Woody & Oud', price: 15000,
    imageUrl: null, sizes: ['30ml', '50ml', '100ml'], scentNotes: 'Rose petals, Oud, Amber, Sandalwood',
    longevity: '8+ hrs', featured: true,
  },
  {
    id: 'demo2', name: 'Midnight Jasmine', category: 'Floral', price: 12000,
    imageUrl: null, sizes: ['15ml', '30ml', '50ml'], scentNotes: 'Jasmine, White Musk, Vanilla',
    longevity: '6–8 hrs', featured: false,
  },
  {
    id: 'demo3', name: 'Citrus Burst', category: 'Fresh & Citrus', price: 9500,
    imageUrl: null, sizes: ['30ml', '50ml'], scentNotes: 'Bergamot, Lemon, Green Tea, Cedar',
    longevity: '4–6 hrs', featured: false,
  },
  {
    id: 'demo4', name: 'Oriental Mystique', category: 'Oriental & Exotic', price: 18000,
    imageUrl: null, sizes: ['50ml', '100ml'], scentNotes: 'Patchouli, Amber, Incense, Vanilla',
    longevity: '8+ hrs', featured: false,
  },
]

export default function CatalogPage() {
  const [products, setProducts]           = useState(DEMO_PRODUCTS)
  const [loading, setLoading]             = useState(true)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeBase, setActiveBase]         = useState('ALL')
  const [activeOccasion, setActiveOccasion] = useState(null)

  useEffect(() => {
    if (!isFirebaseReady || !db) { setLoading(false); return }
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [])

  const handleCategory = (cat) => {
    setActiveCategory(cat)
    setActiveOccasion(null)
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

  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />
      <HeroCarousel />

      {/* Category + base filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {['ALL', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                activeCategory === cat && !activeOccasion
                  ? { background: '#0B0B0B', color: '#fff' }
                  : { background: '#F0EBE0', color: '#0B0B0B', border: '1px solid #e2d9c0' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Base filter */}
        <div className="flex gap-2">
          {['ALL', 'Oil Based', 'Alcohol Based'].map(b => (
            <button
              key={b}
              onClick={() => setActiveBase(b)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={
                activeBase === b
                  ? { background: '#D4AF37', color: '#fff' }
                  : { background: '#F0EBE0', color: '#4a4a2a', border: '1px solid #e2d9c0' }
              }
            >
              {b}
            </button>
          ))}
          {activeOccasion && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: '#F0EBE0', color: '#D4AF37', border: '1px solid #D4AF37' }}
            >
              ✦ {activeOccasion}
            </span>
          )}
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="xl:grid xl:grid-cols-[240px_1fr_280px] xl:gap-8">

          {/* LEFT: Blog sidebar (desktop only) */}
          <div className="hidden xl:block space-y-4">
            <BlogSidebar />
            <WholesaleBanner />
          </div>

          {/* CENTER: Product grid */}
          <div id="catalog">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl mb-2">🌿</p>
                <p className="font-medium" style={{ color: '#0B0B0B' }}>No fragrances found</p>
                <p className="text-sm mt-1" style={{ color: '#7a6a3a' }}>Try clearing your filters</p>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Mobile sidebar widgets */}
            <div className="xl:hidden mt-10 space-y-4">
              <JoysPickWidget products={products} />
              <CustomerLoveWidget />
              <ShopByOccasionWidget activeOccasion={activeOccasion} onSelect={handleOccasion} />
              <FindYourScentWidget />
              <BlogSidebar />
              <WholesaleBanner />
            </div>

            {/* Perfume request form — all screens */}
            <div className="mt-12">
              <PerfumeRequestForm />
            </div>
          </div>

          {/* RIGHT: Widgets (desktop only) */}
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

      {/* Footer */}
      <footer className="text-center py-10 border-t" style={{ borderColor: '#D4AF3730', background: '#0B0B0B' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }} className="text-xl font-semibold mb-1">
          LuxeAura Enterprises
        </p>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(212,175,55,0.5)' }}>
          Luxury · Quality · Elegance
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} LuxeAura Enterprises · Joy Oriabure · luxeauraent.com
        </p>
      </footer>
    </div>
  )
}
