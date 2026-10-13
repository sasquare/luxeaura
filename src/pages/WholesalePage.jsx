import { useState, useEffect } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { WHOLESALE_CATEGORIES, WHOLESALE_DOZEN_SIZES, WHOLESALE_BULK_SIZES, JOY_WHATSAPP, DELIVERY_ZONES } from '../constants'
import SuccessMessage from '../components/SuccessMessage'

const DEMO_W = [
  { id: 'w1', name: 'Floral Collection Dozen', category: 'Dozens', size: '30ml × 12 pcs', price: 85000, imageUrl: null },
  { id: 'w2', name: 'Oud Blend Bulk',          category: 'Bulk / Canister', size: '1 Litre',    price: 65000, imageUrl: null },
  { id: 'w3', name: 'Fresh & Citrus Dozen',    category: 'Dozens', size: '50ml × 12 pcs', price: 120000, imageUrl: null },
]

function OrderModal({ product, onClose }) {
  const [form, setForm]     = useState({ name: '', phone: '', zone: DELIVERY_ZONES[0].label, qty: 1, notes: '' })
  const [saving, setSaving] = useState(false)
  const [done, setDone]     = useState(false)

  const zone  = DELIVERY_ZONES.find(z => z.label === form.zone) || DELIVERY_ZONES[0]
  const total = product?.price ? (Number(product.price) * form.qty) + zone.fee : null

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    if (isFirebaseReady && db) {
      await addDoc(collection(db, 'orders'), {
        ...form, qty: Number(form.qty), productId: product.id, productName: product.name,
        type: 'wholesale', deliveryFee: zone.fee, total, status: 'pending', createdAt: serverTimestamp(),
      })
    }
    const txt = encodeURIComponent(
      `*Wholesale Order — LuxeAura*\nProduct: ${product.name}\nSize: ${product.size}\nQty: ${form.qty}\n` +
      `Customer: ${form.name}\nPhone: ${form.phone}\nZone: ${form.zone} (+₦${zone.fee.toLocaleString()})\n` +
      (form.notes ? `Notes: ${form.notes}\n` : '') +
      (total ? `Total: ₦${total.toLocaleString()}` : '')
    )
    window.open(`https://wa.me/${JOY_WHATSAPP}?text=${txt}`, '_blank')
    setSaving(false)
    setDone(true)
  }

  const f = 'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2'
  const fs = { borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }

  if (done) return <SuccessMessage message="Wholesale order sent! Joy will contact you on WhatsApp." onClose={onClose} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(61,10,20,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
            Order: {product.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
            className={f} style={fs} placeholder="Your name *" />
          <input name="phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
            className={f} style={fs} placeholder="Phone *" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className={f} style={fs}>
              {DELIVERY_ZONES.map(z => <option key={z.label} value={z.label}>{z.label}</option>)}
            </select>
            <input type="number" min="1" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
              className={f} style={fs} placeholder="Qty" />
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
            className={f} style={fs} placeholder="Notes (optional)" />
          {total !== null && (
            <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#FEF3EE', border: '1px solid #e8d5c8' }}>
              <span className="text-sm" style={{ color: '#5C1A2B' }}>Total</span>
              <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>₦{total.toLocaleString()}</span>
            </div>
          )}
          <button type="submit" disabled={saving}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}
          >
            {saving ? 'Sending…' : 'Place Wholesale Order ✦'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function WholesalePage() {
  const [products, setProducts]   = useState(DEMO_W)
  const [activeCategory, setActive] = useState('ALL')
  const [modal, setModal]         = useState(null)

  useEffect(() => {
    if (!isFirebaseReady || !db) return
    const q = query(collection(db, 'wholesale_products'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      if (!snap.empty) setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const filtered = products.filter(p =>
    activeCategory === 'ALL' || p.category === activeCategory
  )

  return (
    <div style={{ background: '#FDF6EC', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero banner */}
      <div className="py-14 px-4 text-center" style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: '#C9927C' }}>LuxeAura · For Retailers</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wholesale Store
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Premium fragrances in dozens and bulk canisters for resellers, beauty stores and event packages.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-opacity hover:opacity-75"
          style={{ color: '#C9927C' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Catalog
        </Link>

        {/* Category filter */}
        <div className="flex gap-2 mb-8">
          {['ALL', ...WHOLESALE_CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={activeCategory === cat
                ? { background: '#5C1A2B', color: '#fff' }
                : { background: '#FEF3EE', color: '#5C1A2B', border: '1px solid #e8d5c8' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #e8d5c8' }}>
              <div className="h-44" style={{ background: 'linear-gradient(135deg, #FEF3EE, #FDF6EC)' }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 opacity-20" viewBox="0 0 24 24" fill="none" stroke="#C9927C" strokeWidth="1.5">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                }
              </div>
              <div className="p-4">
                <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: '#FEF3EE', color: '#C9927C' }}>
                  {p.category}
                </span>
                <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                  {p.name}
                </h3>
                {p.size && <p className="text-xs mb-2" style={{ color: '#9a6a5a' }}>{p.size}</p>}
                {p.price && (
                  <p className="text-lg font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                    ₦{Number(p.price).toLocaleString()}
                  </p>
                )}
                <button
                  onClick={() => setModal(p)}
                  className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}
                >
                  Order Now ✦
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sizes reference */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: 'Dozens', sizes: WHOLESALE_DOZEN_SIZES },
            { title: 'Bulk / Canister', sizes: WHOLESALE_BULK_SIZES },
          ].map(section => (
            <div key={section.title} className="rounded-2xl p-5 bg-white" style={{ border: '1px solid #e8d5c8' }}>
              <h4 className="font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                {section.title}
              </h4>
              <ul className="space-y-1.5">
                {section.sizes.map(s => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: '#7a4a3a' }}>
                    <span style={{ color: '#C9927C' }}>✦</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {modal && <OrderModal product={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
