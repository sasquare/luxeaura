export default function FindYourScentWidget() {
  const scroll = () => {
    const el = document.getElementById('perfume-request-form')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'linear-gradient(135deg, #111111, #0B0B0B)',
        border: '1px solid rgba(212,175,55,0.25)',
      }}
    >
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>Bespoke Fragrance</p>
      <h3
        className="font-bold text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', lineHeight: 1.3 }}
      >
        Find Your Signature Scent
      </h3>
      <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
        Can't find exactly what you're looking for? Tell Joy what you have in mind and she'll curate a fragrance just for you.
      </p>
      <button
        onClick={scroll}
        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)', color: '#fff' }}
      >
        Describe My Ideal Scent ✦
      </button>
    </div>
  )
}
