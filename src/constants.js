export const CATEGORIES = [
  'Brand Inspired',
  'Custom Blend',
  'Floral',
  'Woody & Oud',
  'Fresh & Citrus',
  'Oriental & Exotic',
  'Musk & Aquatic',
  'Unisex',
]

export const SIZES = [
  '15ml', '20ml', '30ml', '50ml',
  '100ml', '150ml', '200ml', '250ml', '300ml',
]

export const BASE_TYPES = ['Oil Based', 'Alcohol Based']

export const DELIVERY_ZONES = [
  { label: 'Lagos',                     fee: 1500 },
  { label: 'Abuja',                     fee: 3500 },
  { label: 'Port Harcourt',             fee: 3500 },
  { label: 'Ibadan',                    fee: 2500 },
  { label: 'Other States (Nationwide)', fee: 4500 },
  { label: 'Pick Up — No Delivery Fee', fee: 0    },
]

// Joy's WhatsApp number (digits only, no +)
export const JOY_WHATSAPP = '2348037516796'

// Wholesale
export const WHOLESALE_CATEGORIES = ['Dozens', 'Bulk / Canister']

export const WHOLESALE_DOZEN_SIZES = [
  '15ml × 12 pcs',
  '20ml × 12 pcs',
  '30ml × 12 pcs',
  '50ml × 12 pcs',
  '100ml × 12 pcs',
]

export const WHOLESALE_BULK_SIZES = [
  '250ml',
  '500ml (½ Litre)',
  '1 Litre',
  '2 Litres',
  '5 Litres',
]

// Blog
export const BLOG_MAX_WORDS = 200

// Product longevity options (optional field)
export const LONGEVITY_OPTIONS = [
  { value: '2–3 hrs', label: '2–3 hrs · Light' },
  { value: '4–6 hrs', label: '4–6 hrs · Moderate' },
  { value: '6–8 hrs', label: '6–8 hrs · Long Lasting' },
  { value: '8+ hrs',  label: '8+ hrs · Very Long Lasting' },
]

// Shop by Occasion
export const OCCASIONS = ['Office', 'Date Night', 'Party', 'Business', 'Vacation']

export const OCCASION_CATEGORIES = {
  'Office':     ['Fresh & Citrus', 'Musk & Aquatic', 'Unisex'],
  'Date Night': ['Oriental & Exotic', 'Woody & Oud', 'Floral'],
  'Party':      ['Floral', 'Brand Inspired', 'Oriental & Exotic'],
  'Business':   ['Musk & Aquatic', 'Fresh & Citrus', 'Woody & Oud'],
  'Vacation':   ['Fresh & Citrus', 'Floral', 'Custom Blend'],
}
