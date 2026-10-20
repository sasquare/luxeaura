import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { JOY_WHATSAPP } from '../constants'

export default function AboutPage() {
  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A00)' }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#D4AF37' }}>Our Story</p>
        <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          About LuxeAura Enterprises
        </h1>
        <p className="text-white/70 max-w-xl mx-auto text-sm leading-relaxed">
          Luxury · Quality · Elegance — three words that define everything we do
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Who we are */}
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            Who We Are
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#4a4a2a' }}>
            LuxeAura Enterprises is a premium fragrance boutique founded by Joy Oriabure, based in Festac, Lagos. We specialise in curating and delivering luxury oil-based and alcohol-based fragrances — from brand-inspired classics to custom bespoke blends.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#4a4a2a' }}>
            Whether you're looking for your everyday signature scent, a gift for a loved one, or bulk wholesale fragrances for your business, LuxeAura has you covered with unmatched quality and personal service.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '✦', title: 'Luxury', desc: 'Every fragrance we carry is held to the highest standard of quality and presentation.' },
              { icon: '⬥', title: 'Quality', desc: 'We source only premium fragrance oils and ingredients that are safe, long-lasting and authentic.' },
              { icon: '◇', title: 'Elegance', desc: 'From packaging to delivery, every interaction with LuxeAura is designed to feel premium.' },
            ].map(v => (
              <div key={v.title} className="rounded-2xl p-6 text-center" style={{ background: '#0B0B0B', border: '1px solid rgba(212,175,55,0.2)' }}>
                <p className="text-2xl mb-3" style={{ color: '#D4AF37' }}>{v.icon}</p>
                <h3 className="font-bold mb-2 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Authenticity */}
        <section className="rounded-2xl p-8" style={{ background: '#0B0B0B', border: '1px solid rgba(212,175,55,0.2)' }}>
          <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Product Authenticity
          </h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            All LuxeAura fragrances are carefully sourced from trusted suppliers. Our oil-based perfumes are crafted using high-concentration fragrance oils that deliver superior longevity compared to standard cologne.
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Our brand-inspired fragrances are not counterfeit products — they are independently crafted scent interpretations inspired by popular designer profiles, clearly labelled as such.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Every order is quality-checked before dispatch. If you are ever unsatisfied with your purchase, we offer a straightforward returns process.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
            Ready to Find Your Signature Scent?
          </h2>
          <p className="text-sm mb-6" style={{ color: '#4a4a2a' }}>Browse our catalog or chat with Joy directly on WhatsApp.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/"
              className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}>
              Shop Now ✦
            </a>
            <a href={`https://wa.me/${JOY_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: '#25D366' }}>
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
