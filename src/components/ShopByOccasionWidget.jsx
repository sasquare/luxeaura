import { OCCASIONS } from '../constants'

const ICONS = {
  'Office':     '💼',
  'Date Night': '🌹',
  'Party':      '🎉',
  'Business':   '🤝',
  'Vacation':   '✈️',
}

export default function ShopByOccasionWidget({ activeOccasion, onSelect }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e8d5c8', background: '#FDF6EC' }}>
      {/* Header */}
      <div className="px-5 py-3" style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: '#C9927C' }}>Shop by Occasion</p>
      </div>

      <div className="p-4 space-y-2">
        {OCCASIONS.map(occ => {
          const isActive = activeOccasion === occ
          return (
            <button
              key={occ}
              onClick={() => onSelect(isActive ? null : occ)}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' : 'white',
                color: isActive ? '#fff' : '#5C1A2B',
                border: isActive ? 'none' : '1px solid #e8d5c8',
              }}
            >
              <span>{ICONS[occ]}</span>
              {occ}
              {isActive && (
                <svg className="w-3.5 h-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )
        })}

        {activeOccasion && (
          <button
            onClick={() => onSelect(null)}
            className="w-full text-center text-xs py-1.5 transition-colors"
            style={{ color: '#9a6a5a' }}
          >
            ✕ Clear filter
          </button>
        )}
      </div>
    </div>
  )
}
