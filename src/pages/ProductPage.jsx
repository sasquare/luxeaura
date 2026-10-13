import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db, isFirebaseReady } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import OrderForm from '../components/OrderForm'
import ReviewSection from '../components/ReviewSection'

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
          <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
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
          <p className="text-sm mb-6" style={{ color: '#7a6a3a' }}>This fragrance may have moved or been removed.</p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors hover:opacity-75"
          style={{ color: '#D4AF37' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: image */}
          <div>
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ height: '400px', background: 'linear-gradient(135deg, #F0EBE0, #F7F3EA)' }}
            >
              {product.imageUrl
                ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-20 h-20 opacity-20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1">
                      <path d="M12 2C8 2 6 5 6 8c0 4 2 6 4 8l2 2 2-2c2-2 4-4 4-8 0-3-2-6-6-6z" />
                    </svg>
                  </div>
                )
              }
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F0EBE0', color: '#0B0B0B', border: '1px solid #e2d9c0' }}>
                  {product.category}
                </span>
              )}
              {product.baseType && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F0EBE0', color: '#0B0B0B', border: '1px solid #e2d9c0' }}>
                  {product.baseType}
                </span>
              )}
              {product.longevity && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#F0EBE0', color: '#0B0B0B', border: '1px solid #e2d9c0' }}>
                  🕐 {product.longevity}
                </span>
              )}
            </div>
          </div>

          {/* Right: details + order form */}
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}
            >
              {product.name}
            </h1>

            {product.price && (
              <p className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>
                ₦{Number(product.price).toLocaleString()}
              </p>
            )}

            {product.scentNotes && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#D4AF37' }}>Scent Notes</p>
                <p className="text-sm" style={{ color: '#4a4a2a' }}>{product.scentNotes}</p>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#D4AF37' }}>About</p>
                <p className="text-sm leading-relaxed" style={{ color: '#4a4a2a' }}>{product.description}</p>
              </div>
            )}

            {/* Order form */}
            <div className="rounded-2xl p-6 bg-white shadow-sm" style={{ border: '1px solid #e2d9c0' }}>
              <h2 className="font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
                Place Your Order
              </h2>
              <OrderForm product={product} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 rounded-2xl p-6 bg-white" style={{ border: '1px solid #e2d9c0' }}>
          <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            Reviews
          </h2>
          <ReviewSection productId={id} />
        </div>
      </div>
    </div>
  )
}
