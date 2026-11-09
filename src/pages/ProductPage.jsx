import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db, isFirebaseReady } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import OrderForm from '../components/OrderForm'
import ReviewSection from '../components/ReviewSection'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseReady || !db) { setLoading(false); return }
    getDoc(doc(db, 'products', id)).then(snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() })
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-xl mx-auto text-center py-32 px-4">
          <p className="text-4xl mb-4">🌿</p>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            Product Not Found
          </h2>
          <p className="text-sm mb-6" style={{ color: '#777777' }}>This fragrance may have moved or been removed.</p>
          <Link to="/" className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white" style={{ background: '#0B0B0B', borderRadius: '4px' }}>
            Back to Catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-10" style={{ paddingTop: '32px', paddingBottom: '72px' }}>

        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2" style={{ fontSize: '12px', color: '#777777' }}>
          <Link to="/" className="hover:text-black transition-colors" style={{ color: '#777777' }}>Home</Link>
          <span>/</span>
          <Link to="/#catalog" className="hover:text-black transition-colors" style={{ color: '#777777' }}>Shop</Link>
          <span>/</span>
          <span style={{ color: '#0B0B0B' }}>{product.name}</span>
        </div>

        {/* Two-column: 55% image / 45% info */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 lg:gap-12">

          {/* Image column */}
          <div>
            <div
              className="overflow-hidden"
              style={{
                background: '#F7F3EA',
                borderRadius: '6px',
                border: '1px solid #EAE7E0',
                height: 'clamp(300px, 45vw, 520px)',
              }}
            >
              {product.imageUrl
                ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full"
                    style={{ objectFit: 'contain', objectPosition: 'center', padding: '12px' }}
                  />
                )
                : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 opacity-15" viewBox="0 0 24 24" fill="none" stroke="#8a7a40" strokeWidth="1">
                      <path d="M12 2C8 2 6 5 6 8c0 4 2 6 4 8l2 2 2-2c2-2 4-4 4-8 0-3-2-6-6-6z" />
                    </svg>
                  </div>
                )
              }
            </div>

            {/* Tags below image */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.category && (
                <span className="px-3 py-1 font-medium" style={{ fontSize: '11px', background: '#F7F3EA', color: '#0B0B0B', border: '1px solid #EAE7E0', borderRadius: '3px' }}>
                  {product.category}
                </span>
              )}
              {product.baseType && (
                <span className="px-3 py-1 font-medium" style={{ fontSize: '11px', background: '#F7F3EA', color: '#0B0B0B', border: '1px solid #EAE7E0', borderRadius: '3px' }}>
                  {product.baseType}
                </span>
              )}
              {product.longevity && (
                <span className="px-3 py-1 font-medium" style={{ fontSize: '11px', background: '#F7F3EA', color: '#0B0B0B', border: '1px solid #EAE7E0', borderRadius: '3px' }}>
                  ⏱ {product.longevity}
                </span>
              )}
            </div>
          </div>

          {/* Info column */}
          <div>
            {/* Category eyebrow */}
            {product.category && (
              <p className="uppercase tracking-widest font-medium mb-2" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.22em' }}>
                {product.category}
              </p>
            )}

            <h1
              className="font-bold leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px, 3vw, 34px)', color: '#0B0B0B' }}
            >
              {product.name}
            </h1>

            {product.price && (
              <p className="font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 2.5vw, 25px)', color: '#0B0B0B' }}>
                ₦{Number(product.price).toLocaleString()}
              </p>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: '#EAE7E0', marginBottom: '20px' }} />

            {product.scentNotes && (
              <div className="mb-4">
                <p className="uppercase tracking-wider font-medium mb-1" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.18em' }}>Scent Notes</p>
                <p style={{ fontSize: '14px', color: '#444444', lineHeight: 1.65 }}>{product.scentNotes}</p>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <p className="uppercase tracking-wider font-medium mb-1" style={{ fontSize: '10px', color: '#D4AF37', letterSpacing: '0.18em' }}>About</p>
                <p style={{ fontSize: '15px', color: '#444444', lineHeight: 1.7 }}>{product.description}</p>
              </div>
            )}

            {/* Order form */}
            <div className="rounded bg-white" style={{ border: '1px solid #EAE7E0', padding: '24px' }}>
              <p className="font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#0B0B0B' }}>
                Place Your Order
              </p>
              <OrderForm product={product} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 rounded bg-white" style={{ border: '1px solid #EAE7E0', padding: '32px' }}>
          <h2 className="font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#0B0B0B' }}>
            Customer Reviews
          </h2>
          <ReviewSection productId={id} />
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
