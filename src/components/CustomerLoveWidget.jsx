import { useState, useEffect } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'

const DEMO_REVIEWS = [
  { id: 'dr1', author: 'Amaka O.', rating: 5, comment: 'Absolutely divine! The Rose Oud lasted all day and so many compliments.' },
  { id: 'dr2', author: 'Tunde B.', rating: 5, comment: 'Premium quality, fast delivery. LuxeAura is my go-to fragrance store now.' },
  { id: 'dr3', author: 'Chisom E.', rating: 4, comment: 'Beautiful packaging and the scent is exactly as described. Love it!' },
]

export default function CustomerLoveWidget() {
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isFirebaseReady || !db) return
    const q = query(
      collection(db, 'reviews'),
      where('rating', '>=', 4),
      orderBy('rating', 'desc'),
      limit(20)
    )
    return onSnapshot(q, snap => {
      if (!snap.empty) setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 4000)
    return () => clearInterval(t)
  }, [reviews.length])

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  const r = reviews[current] || reviews[0]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e8d5c8', background: '#FDF6EC' }}>
      {/* Header */}
      <div className="px-5 py-3" style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: '#C9927C' }}>Customer Love ✦</p>
      </div>

      <div className="p-4">
        {/* Stats */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, #C9927C, #a07060)', color: '#fff', fontFamily: "'Playfair Display', serif" }}
          >
            {avg}
          </div>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-3.5 h-3.5" fill="#C9927C" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs" style={{ color: '#9a6a5a' }}>{reviews.length}+ happy customers</p>
          </div>
        </div>

        {/* Rotating review */}
        {r && (
          <div className="rounded-xl p-3 mb-3 min-h-[80px]" style={{ background: '#FEF3EE', border: '1px solid #e8d5c8' }}>
            <p className="text-xs italic leading-relaxed mb-2" style={{ color: '#7a4a3a' }}>
              "{r.comment}"
            </p>
            <p className="text-xs font-medium" style={{ color: '#C9927C' }}>— {r.author || 'Customer'}</p>
          </div>
        )}

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {reviews.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                background: i === current ? '#C9927C' : '#e8d5c8',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
