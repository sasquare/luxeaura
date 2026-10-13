import { useState } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { JOY_WHATSAPP } from '../constants'

export default function PerfumeRequestForm() {
  const [form, setForm]   = useState({ name: '', phone: '', description: '', minPrice: '', maxPrice: '' })
  const [saving, setSaving] = useState(false)
  const [done, setDone]     = useState(false)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)

    if (isFirebaseReady && db) {
      await addDoc(collection(db, 'perfume_requests'), { ...form, createdAt: serverTimestamp() })
    }

    const priceRange = form.minPrice || form.maxPrice
      ? `₦${form.minPrice || '?'} – ₦${form.maxPrice || '?'}`
      : 'Not specified'

    const txt = encodeURIComponent(
      `*Perfume Request — LuxeAura*\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Looking for: ${form.description}\n` +
      `Budget: ${priceRange}`
    )
    window.open(`https://wa.me/${JOY_WHATSAPP}?text=${txt}`, '_blank')
    setSaving(false)
    setDone(true)
  }

  const fieldCls = 'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2'
  const fieldStyle = { borderColor: '#e2d9c0', color: '#0B0B0B', '--tw-ring-color': '#D4AF37' }

  return (
    <div id="perfume-request-form" className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e2d9c0' }}>
      {/* Header */}
      <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #0B0B0B, #111111)' }}>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#D4AF37' }}>Can't find it?</p>
        <h3
          className="text-xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Request a Fragrance
        </h3>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Tell us what you're looking for and Joy will source or blend it for you.
        </p>
      </div>

      <div className="p-6 bg-white">
        {done ? (
          <div className="text-center py-8">
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
            >
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
              Request Sent! ✦
            </h4>
            <p className="text-sm mb-4" style={{ color: '#7a6a3a' }}>Joy will be in touch on WhatsApp shortly.</p>
            <button
              onClick={() => setDone(false)}
              className="text-sm font-medium"
              style={{ color: '#D4AF37' }}
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Your Name *</label>
                <input name="name" value={form.name} onChange={update} required
                  className={fieldCls} style={fieldStyle} placeholder="Full name" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Phone *</label>
                <input name="phone" value={form.phone} onChange={update} required
                  className={fieldCls} style={fieldStyle} placeholder="08xx xxx xxxx" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>
                Describe your ideal fragrance *
              </label>
              <textarea
                name="description" value={form.description} onChange={update} required rows={4}
                className={fieldCls} style={fieldStyle}
                placeholder="E.g. 'Something like Tom Ford Oud Wood but lighter and more floral, for office wear…'"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#0B0B0B' }}>
                Budget range (optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#7a6a3a' }}>Min (₦)</label>
                  <input name="minPrice" type="number" min="0" value={form.minPrice} onChange={update}
                    className={fieldCls} style={fieldStyle} placeholder="e.g. 5000" />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#7a6a3a' }}>Max (₦)</label>
                  <input name="maxPrice" type="number" min="0" value={form.maxPrice} onChange={update}
                    className={fieldCls} style={fieldStyle} placeholder="e.g. 20000" />
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
            >
              {saving ? 'Sending…' : 'Send Request via WhatsApp ✦'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
