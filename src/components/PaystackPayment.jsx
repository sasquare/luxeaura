import { useEffect } from 'react'

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

function loadPaystackScript() {
  return new Promise((resolve) => {
    if (window.PaystackPop) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

export async function openPaystack({ email, amount, name, phone, metadata, onSuccess, onClose }) {
  await loadPaystackScript()

  if (!PAYSTACK_PUBLIC_KEY) {
    alert('Payment not configured yet. Please contact Joy to complete your order via WhatsApp.')
    onClose()
    return
  }

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email || `${phone}@luxeauraent.com`,
    amount: amount * 100, // Paystack uses kobo
    currency: 'NGN',
    ref: `LA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
        { display_name: 'Phone', variable_name: 'phone', value: phone },
        ...Object.entries(metadata || {}).map(([k, v]) => ({
          display_name: k, variable_name: k.toLowerCase().replace(/\s/g, '_'), value: String(v),
        })),
      ],
    },
    callback: (response) => onSuccess(response),
    onClose: onClose,
  })

  handler.openIframe()
}
