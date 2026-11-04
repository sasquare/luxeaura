import { useState } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { SIZES, BASE_TYPES, DELIVERY_ZONES, JOY_WHATSAPP } from '../constants'
import SuccessMessage from './SuccessMessage'
import { openPaystack } from './PaystackPayment'

const PAYSTACK_ENABLED = !!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

export default function OrderForm({ product }) {
  const [form, setForm] = useState({
    name: '', phone: '', address: '',
    size: product?.sizes?.[0] || SIZES[0],
    base: BASE_TYPES[0],
    zone: DELIVERY_ZONES[0].label,
    qty: 1, notes: '',
  })
  const [saving, setSaving]   = useState(false)
  const [paying, setPaying]   = useState(false)
  const [done, setDone]       = useState(false)
  const [payMethod, setPayMethod] = useState(PAYSTACK_ENABLED ? 'paystack' : 'whatsapp')

  const zone  = DELIVERY_ZONES.find(z => z.label === form.zone) || DELIVERY_ZONES[0]
  const total = product?.price ? (Number(product.price) * form.qty) + zone.fee : null

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const buildOrder = (extra = {}) => ({
    ...form,
    qty: Number(form.qty),
    productId: product?.id || null,
    productName: product?.name || '',
    productPrice: product?.price || null,
    deliveryFee: zone.fee,
    total,
    createdAt: serverTimestamp(),
    ...extra,
  })

  const sendWhatsApp = (order) => {
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
      (total ? `Total: ₦${total.toLocaleString()}\n` : '') +
      (order.paymentRef ? `Payment Ref: ${order.paymentRef} ✅ PAID` : `Payment: Pending`)
    )
    window.open(`https://wa.me/${JOY_WHATSAPP}?text=${txt}`, '_blank')
  }

  const handleWhatsApp = async (e) => {
    e.preventDefault()
    setSaving(true)
    const order = buildOrder({ status: 'pending', paymentMethod: 'whatsapp' })
    if (isFirebaseReady && db) await addDoc(collection(db, 'orders'), order)
    sendWhatsApp(order)
    setSaving(false)
    setDone(true)
  }

  const handlePaystack = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill in your name, phone and address first.')
      return
    }
    setPaying(true)
    await openPaystack({
      email: `${form.phone.replace(/\D/g, '')}@luxeaura.order`,
      amount: total,
      name: form.name,
      phone: form.phone,
      metadata: {
        'Product': product?.name || '',
        'Size': form.size,
        'Quantity': form.qty,
        'Zone': form.zone,
        'Address': form.address,
      },
      onSuccess: async (response) => {
        const order = buildOrder({
          status: 'paid',
          paymentMethod: 'paystack',
          paymentRef: response.reference,
          paidAt: serverTimestamp(),
        })
        if (isFirebaseReady && db) await addDoc(collection(db, 'orders'), order)
        sendWhatsApp(order)
        setPaying(false)
        setDone(true)
      },
      onClose: () => setPaying(false),
    })
  }

  const submit = payMethod === 'paystack' ? handlePaystack : handleWhatsApp

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

      {/* Payment method selector */}
      <div className="rounded-xl p-4 space-y-3" style={{ background: '#F0EBE0', border: '1px solid #e2d9c0' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0B0B0B' }}>How would you like to pay?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PAYSTACK_ENABLED && (
            <button type="button" onClick={() => setPayMethod('paystack')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2"
              style={payMethod === 'paystack'
                ? { background: '#0B0B0B', color: '#D4AF37', borderColor: '#D4AF37' }
                : { background: 'white', color: '#0B0B0B', borderColor: '#e2d9c0' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay Online (Card / Transfer)
            </button>
          )}
          <button type="button" onClick={() => setPayMethod('whatsapp')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2"
            style={payMethod === 'whatsapp'
              ? { background: '#0B0B0B', color: '#D4AF37', borderColor: '#D4AF37' }
              : { background: 'white', color: '#0B0B0B', borderColor: '#e2d9c0' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            Order via WhatsApp
          </button>
        </div>
        {payMethod === 'whatsapp' && (
          <p className="text-xs" style={{ color: '#7a6a3a' }}>Joy will send payment details after you place the order.</p>
        )}
        {payMethod === 'paystack' && (
          <p className="text-xs" style={{ color: '#7a6a3a' }}>Pay securely with card, bank transfer or USSD. Powered by Paystack.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || paying}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background: payMethod === 'paystack' ? 'linear-gradient(135deg, #0F5132, #1a7a4a)' : 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
      >
        {paying ? 'Opening payment…' : saving ? 'Sending…' : payMethod === 'paystack' ? `Pay ₦${total?.toLocaleString()} Now ✦` : 'Place Order via WhatsApp ✦'}
      </button>
    </form>
  )
}
