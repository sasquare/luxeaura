import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function ShippingPage() {
  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />

      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A00)' }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#D4AF37' }}>Getting Your Order</p>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Shipping & Delivery
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Delivery zones */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>Delivery Zones & Fees</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e2d9c0' }}>
            <div className="grid grid-cols-3 px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ background: '#0B0B0B', color: '#D4AF37' }}>
              <span>Zone</span><span className="text-center">Timeframe</span><span className="text-right">Fee</span>
            </div>
            {[
              { label: 'Lagos', time: '1–2 business days', fee: 1500 },
              { label: 'Abuja', time: '2–3 business days', fee: 3500 },
              { label: 'Port Harcourt', time: '2–3 business days', fee: 3500 },
              { label: 'Ibadan', time: '2–3 business days', fee: 2500 },
              { label: 'Other States', time: '3–5 business days', fee: 4500 },
              { label: 'Pick Up (Festac, Lagos)', time: 'Same day', fee: 0 },
            ].map((z, i) => (
              <div key={z.label} className="grid grid-cols-3 px-5 py-4 text-sm items-center"
                style={{ background: i % 2 === 0 ? 'white' : '#F7F3EA', borderBottom: '1px solid #e2d9c0' }}>
                <span style={{ color: '#0B0B0B' }} className="font-medium">{z.label}</span>
                <span className="text-center" style={{ color: '#4a4a2a' }}>{z.time}</span>
                <span className="text-right font-semibold" style={{ color: z.fee === 0 ? '#0F5132' : '#0B0B0B' }}>
                  {z.fee === 0 ? 'FREE' : `₦${z.fee.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Payment methods */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>Payment Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Bank Transfer', desc: 'Transfer directly to our account. Send proof of payment via WhatsApp to confirm your order.' },
              { title: 'Direct Bank Deposit', desc: 'Walk into any bank branch and deposit to our account. Share teller receipt on WhatsApp.' },
              { title: 'Visa Card', desc: 'Pay securely with your Visa debit or credit card.' },
              { title: 'Verve / Mastercard', desc: 'All major Nigerian debit cards accepted.' },
            ].map(p => (
              <div key={p.title} className="rounded-xl p-5" style={{ background: 'white', border: '1px solid #e2d9c0' }}>
                <p className="font-semibold text-sm mb-1.5" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
                  ✦ {p.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#4a4a2a' }}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl text-sm" style={{ background: '#0B0B0B', color: 'rgba(255,255,255,0.75)' }}>
            <strong style={{ color: '#D4AF37' }}>Bank Details:</strong> Contact Joy on WhatsApp (+234 803 751 6796) to receive our bank account details for transfer payments.
          </div>
        </section>

        {/* How to order */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>How to Order</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Browse & Select', desc: 'Find your fragrance in our catalog and click "Order Now".' },
              { step: '2', title: 'Fill Order Form', desc: 'Enter your name, phone, delivery address, size and quantity.' },
              { step: '3', title: 'Send via WhatsApp', desc: 'Your order details are sent directly to Joy on WhatsApp.' },
              { step: '4', title: 'Make Payment', desc: 'Joy confirms your order and shares payment details.' },
              { step: '5', title: 'We Deliver', desc: 'Your fragrance is packaged and dispatched to your door.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'white', border: '1px solid #e2d9c0' }}>
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: '#D4AF37', color: '#0B0B0B' }}>
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: '#0B0B0B' }}>{s.title}</p>
                  <p className="text-xs" style={{ color: '#4a4a2a' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
