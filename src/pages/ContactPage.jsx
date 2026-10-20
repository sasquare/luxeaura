import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { JOY_WHATSAPP } from '../constants'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const txt = encodeURIComponent(
      `*Message via LuxeAura Website*\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/${JOY_WHATSAPP}?text=${txt}`, '_blank')
    setSent(true)
  }

  const field = 'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white'
  const fs = { borderColor: '#e2d9c0', '--tw-ring-color': '#D4AF37', color: '#0B0B0B' }

  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />

      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A00)' }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#D4AF37' }}>Get In Touch</p>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact Us
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
              Reach Joy Directly
            </h2>

            <div className="space-y-5">
              {[
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                  label: 'Phone', value: '+234 803 751 6796', href: 'tel:+2348037516796',
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  label: 'Email', value: 'joy@luxeauraent.com', href: 'mailto:joy@luxeauraent.com',
                },
                {
                  icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#D4AF37" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                  label: 'Location', value: 'Festac, Lagos, Nigeria', href: null,
                },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#F0EBE0', border: '1px solid #e2d9c0' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#0B0B0B' }}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#D4AF37' }}>{c.label}</p>
                    {c.href
                      ? <a href={c.href} className="text-sm font-medium" style={{ color: '#0B0B0B' }}>{c.value}</a>
                      : <p className="text-sm font-medium" style={{ color: '#0B0B0B' }}>{c.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${JOY_WHATSAPP}?text=${encodeURIComponent('Hello LuxeAura! I would like to make an enquiry.')}`}
              target="_blank" rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.857L.054 23.5l5.832-1.53A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.502-5.184-1.381l-.371-.22-3.862 1.013 1.03-3.773-.241-.386A9.943 9.943 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              <div>
                <p className="text-sm font-bold text-white">Chat on WhatsApp</p>
                <p className="text-xs text-white/80">+234 803 751 6796 — usually replies within minutes</p>
              </div>
            </a>

            {/* Hours */}
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#F0EBE0', border: '1px solid #e2d9c0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#D4AF37' }}>Business Hours</p>
              <p className="text-sm" style={{ color: '#0B0B0B' }}>Monday – Saturday: 8:00 AM – 8:00 PM</p>
              <p className="text-sm" style={{ color: '#0B0B0B' }}>Sunday: 12:00 PM – 6:00 PM</p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
              Send a Message
            </h2>
            {sent ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: '#0B0B0B' }}>
                <p className="text-3xl mb-3">✦</p>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>Your message has been sent to Joy via WhatsApp. She'll be in touch shortly.</p>
                <button onClick={() => setSent(false)} className="text-sm" style={{ color: '#D4AF37' }}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Full Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className={field} style={fs} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={field} style={fs} placeholder="08xx xxx xxxx" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={field} style={fs} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#0B0B0B' }}>Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className={field} style={fs} placeholder="How can we help you?" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}>
                  Send Message via WhatsApp ✦
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
