export default function SuccessMessage({ message = 'Order placed successfully!', onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(11,11,11,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)' }}
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: '#0B0B0B' }}
        >
          Order Received ✦
        </h2>
        <p className="text-sm mb-6" style={{ color: '#7a6a3a' }}>{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0B0B0B, #1A1A1A)' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
