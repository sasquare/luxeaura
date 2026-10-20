import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

const CONTENT = {
  returns: {
    title: 'Returns & Refunds',
    subtitle: 'Your satisfaction is our priority',
    sections: [
      {
        heading: 'Return Policy',
        body: `We want you to love your LuxeAura fragrance. If you are not satisfied with your purchase, we offer returns within 7 days of delivery, subject to the conditions below.`,
      },
      {
        heading: 'Eligible for Return',
        body: `• Product arrived damaged or leaking\n• Wrong item delivered\n• Product significantly different from description\n\nNote: Opened fragrances cannot be returned for hygiene reasons unless the product is defective.`,
      },
      {
        heading: 'How to Return',
        body: `1. Contact Joy on WhatsApp (+234 803 751 6796) within 7 days of receiving your order.\n2. Send photos of the item and packaging.\n3. We will arrange collection or a return address.\n4. Refund or replacement will be processed within 3–5 business days of receiving the return.`,
      },
      {
        heading: 'Refund Method',
        body: `Refunds are processed via bank transfer to the account you provide. We do not refund delivery fees unless the error was on our part.`,
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we handle your information',
    sections: [
      {
        heading: 'Information We Collect',
        body: `When you place an order or submit a contact form, we collect your name, phone number, email address and delivery address. This information is used solely to process and deliver your order.`,
      },
      {
        heading: 'How We Use Your Information',
        body: `• To process and fulfil your orders\n• To contact you regarding your order status\n• To respond to enquiries\n\nWe do not sell, rent or share your personal information with third parties for marketing purposes.`,
      },
      {
        heading: 'Data Storage',
        body: `Your order data is stored securely in our database. WhatsApp messages are subject to WhatsApp's own privacy policy. We retain order records for up to 2 years for business purposes.`,
      },
      {
        heading: 'Your Rights',
        body: `You may request deletion of your personal data at any time by contacting us on WhatsApp or via email at joy@luxeauraent.com.`,
      },
      {
        heading: 'Cookies',
        body: `Our website does not use tracking cookies beyond what is necessary for the site to function. We do not use advertising cookies.`,
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Please read before using our site',
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: `By using luxeauraent.com, you agree to these Terms & Conditions. If you do not agree, please do not use our website.`,
      },
      {
        heading: 'Products & Pricing',
        body: `All prices are displayed in Nigerian Naira (₦). Prices may change without notice. We reserve the right to cancel orders where pricing errors have occurred.`,
      },
      {
        heading: 'Orders',
        body: `An order is confirmed only after payment is received and acknowledged by LuxeAura Enterprises. Placing an order does not guarantee stock availability.`,
      },
      {
        heading: 'Brand-Inspired Fragrances',
        body: `Our brand-inspired fragrances are independently crafted scent interpretations and are not affiliated with, endorsed by, or products of any designer brand. They are clearly labelled as "Brand Inspired."`,
      },
      {
        heading: 'Limitation of Liability',
        body: `LuxeAura Enterprises is not liable for any indirect or consequential loss arising from the use of our products beyond the purchase price paid.`,
      },
      {
        heading: 'Contact',
        body: `For any questions about these terms, contact us at joy@luxeauraent.com or WhatsApp +234 803 751 6796.`,
      },
    ],
  },
}

export default function LegalPage() {
  const { type } = useParams()
  const page = CONTENT[type] || CONTENT.terms

  return (
    <div style={{ background: '#F7F3EA', minHeight: '100vh' }}>
      <Navbar />

      <div className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A00)' }}>
        <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#D4AF37' }}>LuxeAura Enterprises</p>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          {page.title}
        </h1>
        <p className="text-white/60 mt-2 text-sm">{page.subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {page.sections.map(s => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}>
              {s.heading}
            </h2>
            <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid #e2d9c0' }}>
              {s.body.split('\n').map((line, i) => (
                <p key={i} className={`text-sm leading-relaxed ${i > 0 ? 'mt-2' : ''}`} style={{ color: '#4a4a2a' }}>{line}</p>
              ))}
            </div>
          </section>
        ))}
        <p className="text-xs text-center" style={{ color: '#9a9a6a' }}>
          Last updated: October 2026 · LuxeAura Enterprises, Festac, Lagos
        </p>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
