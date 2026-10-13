import { useState, useEffect } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [form, setForm]       = useState({ author: '', rating: 5, comment: '' })
  const [saving, setSaving]   = useState(false)
  const [done, setDone]       = useState(false)

  useEffect(() => {
    if (!isFirebaseReady || !db) return
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, snap => setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [productId])

  const submit = async (e) => {
    e.preventDefault()
    if (!isFirebaseReady || !db) { setDone(true); return }
    setSaving(true)
    await addDoc(collection(db, 'reviews'), {
      ...form,
      rating: Number(form.rating),
      productId,
      createdAt: serverTimestamp(),
    })
    setForm({ author: '', rating: 5, comment: '' })
    setSaving(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div>
      {/* Summary */}
      {avg && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            {avg}
          </span>
          <div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4" fill={s <= Math.round(Number(avg)) ? '#D4AF37' : '#e0c8c0'} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs" style={{ color: '#7a6a3a' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 && (
        <div className="space-y-4 mb-8">
          {reviews.slice(0, 5).map(r => (
            <div key={r.id} className="rounded-xl p-4" style={{ background: '#F0EBE0', border: '1px solid #e2d9c0' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: '#0B0B0B' }}>{r.author || 'Anonymous'}</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3 h-3" fill={s <= r.rating ? '#D4AF37' : '#e0c8c0'} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm" style={{ color: '#4a4a2a' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write review */}
      <div className="rounded-2xl p-6" style={{ background: '#F7F3EA', border: '1px solid #e2d9c0' }}>
        <h4 className="font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
          Leave a Review
        </h4>
        {done && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#d4edda', color: '#155724' }}>
            Thank you for your review! ✦
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <input
            value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e2d9c0', '--tw-ring-color': '#D4AF37' }}
            placeholder="Your name"
          />
          <select
            value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: '#e2d9c0' }}
          >
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
          </select>
          <textarea
            value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} required rows={3}
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e2d9c0', '--tw-ring-color': '#D4AF37' }}
            placeholder="Share your experience…"
          />
          <button
            type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
          >
            {saving ? 'Submitting…' : 'Submit Review ✦'}
          </button>
        </form>
      </div>
    </div>
  )
}
