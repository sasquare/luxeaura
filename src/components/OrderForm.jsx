import { useState } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { SIZES, BASE_TYPES, DELIVERY_ZONES, JOY_WHATSAPP } from '../constants'
import SuccessMessage from './SuccessMessage'

export default function OrderForm({ product }) {
  const [form, setForm] = useState({
    name: '', phone: '', address: '',
    size: SIZES[0], base: BASE_TYPES[0],
    zone: DELIVERY_ZONES[0].label,
    qty: 1, notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [done, setDone]     = useState(false)

  const zone = DELIVERY_ZONES.find(z => z.label === form.zone) || DELIVERY_ZONES[0]
  const total = product?.price ? (Number(product.price) * form.qty) + zone.fee : null

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const order = {
      ...form,
      qty: Number(form.qty),
      productId: product?.id || null,
      productName: product?.name || '',
      productPrice: product?.price || null,
      deliveryFee: zone.fee,
      total,
      status: 'pending',
      createdAt: serverTimestamp(),
    }

    if (isFirebaseReady && db) {
      await addDoc(collection(db, 'orders'), order)
    }

    // Redirect to WhatsApp as well
    const txt = encodeURIComponent(
      `*New Order — LuxeAura*\n` +
      `Product: ${product?.name}\n` +
      `Size: ${form.size} | Base: ${form.base}\n` +
      `Qty: ${form.qty}\n` +
      `Customer: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Zone: ${form.zone} (+₦${zone.fee.toLocaleString()})\n` +
      `Address: ${form.address}\n` +
      (form.notes ? `Notes: ${form.notes}\n` : '') +
      (total ? `Total: ₦${total.toLocaleString()}` : '')
    )
    window.open(`https://wa.me/${JOY_WHATSAPP}?text=${txt}`, '_blank')
    setSaving(false)
    setDone(true)
  }

  if (done) return (
    <SuccessMessage
      message="Your order has been sent to LuxeAura! Joy will reach out shortly on WhatsApp."
      onClose={() => setDone(false)}
    />
  )

  const field = 'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2'
  const fieldStyle = { borderColor: '#e2d9c0', color: '#0B0B0B', '--tw-ring-color': '#D4AF37' }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Full Name *</label>
          <input name="name" value={form.name} onChange={update} required
            className={field} style={fieldStyle} placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Phone *</label>
          <input name="phone" value={form.phone} onChange={update} required
            className={field} style={fieldStyle} placeholder="08xx xxx xxxx" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Size</label>
          <select name="size" value={form.size} onChange={update} className={field} style={fieldStyle}>
            {SIZES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Base</label>
          <select name="base" value={form.base} onChange={update} className={field} style={fieldStyle}>
            {BASE_TYPES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Qty</label>
          <input name="qty" type="number" min="1" max="50" value={form.qty} onChange={update}
            className={field} style={fieldStyle} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Delivery Zone</label>
        <select name="zone" value={form.zone} onChange={update} className={field} style={fieldStyle}>
          {DELIVERY_ZONES.map(z => (
            <option key={z.label} value={z.label}>
              {z.label}{z.fee > 0 ? ` — ₦${z.fee.toLocaleString()}` : ' — Free'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Delivery Address *</label>
        <textarea name="address" value={form.address} onChange={update} required rows={2}
          className={field} style={fieldStyle} placeholder="Street, area, city…" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={update} rows={2}
          className={field} style={fieldStyle} placeholder="Gift wrap, custom message, etc." />
      </div>

      {total !== null && (
        <div
          className="flex justify-between items-center rounded-xl px-4 py-3"
          style={{ background: '#F0EBE0', border: '1px solid #e2d9c0' }}
        >
          <span className="text-sm font-medium" style={{ color: '#0B0B0B' }}>Total (incl. delivery)</span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}
          >
            ₦{total.toLocaleString()}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
      >
        {saving ? 'Sending…' : 'Place Order via WhatsApp ✦'}
      </button>
    </form>
  )
}
