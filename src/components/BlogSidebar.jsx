import { useState, useEffect } from 'react'
import { db, isFirebaseReady } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const DEMO_POSTS = [
  {
    id: 'd1',
    title: 'The Art of Layering Fragrances',
    excerpt: 'Discover how combining woody base notes with floral top notes creates a signature scent that lasts all day and leaves a lasting impression.',
    createdAt: { toDate: () => new Date('2024-11-15') },
  },
  {
    id: 'd2',
    title: 'Oriental & Exotic: A Guide',
    excerpt: 'From oud to amber, learn what makes oriental fragrances timeless favourites for date nights and special occasions.',
    createdAt: { toDate: () => new Date('2024-10-20') },
  },
]

function trimWords(text, max) {
  const words = text.trim().split(/\s+/)
  return words.length <= max ? text : words.slice(0, max).join(' ') + '…'
}

export default function BlogSidebar() {
  const [posts, setPosts]       = useState(DEMO_POSTS)
  const [active, setActive]     = useState(null)

  useEffect(() => {
    if (!isFirebaseReady || !db) return
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'), limit(5))
    return onSnapshot(q, snap => {
      if (!snap.empty) setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FDF6EC', border: '1px solid #e8d5c8' }}>
      {/* Header */}
      <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
        <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#C9927C' }}>Joy's</p>
        <h3
          className="text-base font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Fragrance Journal
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {posts.map(post => {
          const isOpen = active === post.id
          const date = post.createdAt?.toDate?.()
            ? post.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : ''

          return (
            <div
              key={post.id}
              className="rounded-xl overflow-hidden cursor-pointer transition-all"
              style={{ border: '1px solid #e8d5c8' }}
            >
              <button
                onClick={() => setActive(isOpen ? null : post.id)}
                className="w-full text-left px-4 py-3 flex items-start justify-between gap-2"
                style={{ background: isOpen ? '#FEF3EE' : 'white' }}
              >
                <div>
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}
                  >
                    {post.title}
                  </p>
                  {date && <p className="text-xs mt-0.5" style={{ color: '#C9927C' }}>{date}</p>}
                </div>
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform"
                  style={{ color: '#C9927C', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && post.excerpt && (
                <div className="px-4 pb-4" style={{ background: '#FEF3EE' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#7a4a3a' }}>
                    {trimWords(post.excerpt, 200)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
