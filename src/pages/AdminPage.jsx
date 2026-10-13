import { useState, useEffect } from 'react'
import { auth, db, isFirebaseReady } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { CATEGORIES, SIZES, BASE_TYPES, LONGEVITY_OPTIONS } from '../constants'

// ─── helpers ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#C9927C', borderTopColor: 'transparent' }} />
    </div>
  )
}

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [err,   setErr]     = useState('')
  const [busy,  setBusy]    = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!isFirebaseReady || !auth) { setErr('Firebase not configured.'); return }
    setBusy(true)
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      onLogin()
    } catch {
      setErr('Invalid email or password.')
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #5C1A2B, #3D0A14)' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
          LuxeAura Admin
        </h1>
        {err && <p className="text-sm text-red-600 mb-4 text-center">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }}
            placeholder="Admin email" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} required
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }}
            placeholder="Password" />
          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}>
            {busy ? 'Signing in…' : 'Sign In ✦'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Product form ─────────────────────────────────────────────────────────────
const EMPTY = {
  name: '', category: CATEGORIES[0], price: '', baseType: BASE_TYPES[0],
  sizes: [], scentNotes: '', longevity: '', imageUrl: '', description: '', featured: false,
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)

  const toggle = field => setForm(f => ({ ...f, [field]: !f[field] }))
  const toggleSize = (sz) => setForm(f => ({
    ...f,
    sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz],
  }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...form, price: form.price ? Number(form.price) : null })
    setSaving(false)
  }

  const label = 'block text-xs font-medium mb-1'
  const input = 'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2'
  const iStyle = { borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} style={{ color: '#5C1A2B' }}>Product Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
            className={input} style={iStyle} placeholder="e.g. Rose Oud Elixir" />
        </div>
        <div>
          <label className={label} style={{ color: '#5C1A2B' }}>Price (₦)</label>
          <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            className={input} style={iStyle} placeholder="e.g. 15000" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label} style={{ color: '#5C1A2B' }}>Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className={input} style={iStyle}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label} style={{ color: '#5C1A2B' }}>Base Type</label>
          <select value={form.baseType} onChange={e => setForm(f => ({ ...f, baseType: e.target.value }))}
            className={input} style={iStyle}>
            {BASE_TYPES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={label} style={{ color: '#5C1A2B' }}>Sizes Available</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {SIZES.map(sz => (
            <button type="button" key={sz}
              onClick={() => toggleSize(sz)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={form.sizes.includes(sz)
                ? { background: '#5C1A2B', color: '#fff' }
                : { background: '#FEF3EE', color: '#5C1A2B', border: '1px solid #e8d5c8' }
              }>
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={label} style={{ color: '#5C1A2B' }}>Longevity</label>
        <select value={form.longevity} onChange={e => setForm(f => ({ ...f, longevity: e.target.value }))}
          className={input} style={iStyle}>
          <option value="">— Select —</option>
          {LONGEVITY_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>

      <div>
        <label className={label} style={{ color: '#5C1A2B' }}>Scent Notes</label>
        <input value={form.scentNotes} onChange={e => setForm(f => ({ ...f, scentNotes: e.target.value }))}
          className={input} style={iStyle} placeholder="e.g. Rose, Oud, Amber, Sandalwood" />
      </div>

      <div>
        <label className={label} style={{ color: '#5C1A2B' }}>Image URL (from ImgBB)</label>
        <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
          className={input} style={iStyle} placeholder="https://i.ibb.co/..." />
      </div>

      <div>
        <label className={label} style={{ color: '#5C1A2B' }}>Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
          className={input} style={iStyle} placeholder="Brief description of this fragrance…" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => toggle('featured')}
          className="w-10 h-6 rounded-full transition-colors relative"
          style={{ background: form.featured ? '#5C1A2B' : '#e8d5c8' }}
        >
          <div
            className="absolute w-4 h-4 top-1 rounded-full bg-white shadow transition-all"
            style={{ left: form.featured ? '22px' : '4px' }}
          />
        </div>
        <span className="text-sm font-medium" style={{ color: '#5C1A2B' }}>Mark as Joy's Pick (featured)</span>
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}>
          {saving ? 'Saving…' : 'Save Product ✦'}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: '#FEF3EE', color: '#5C1A2B', border: '1px solid #e8d5c8' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Main admin panel ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [user,     setUser]     = useState(null)
  const [authReady,setAuthReady]= useState(false)
  const [tab,      setTab]      = useState('products')
  const [products, setProducts] = useState([])
  const [orders,   setOrders]   = useState([])
  const [requests, setRequests] = useState([])
  const [editProd, setEditProd] = useState(null)
  const [addMode,  setAddMode]  = useState(false)
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '' })
  const [blogPosts,setBlogPosts]= useState([])
  const [blogSaving,setBlogSaving]= useState(false)

  useEffect(() => {
    if (!isFirebaseReady || !auth) { setAuthReady(true); return }
    return onAuthStateChanged(auth, u => { setUser(u); setAuthReady(true) })
  }, [])

  useEffect(() => {
    if (!user || !isFirebaseReady || !db) return
    const subs = [
      onSnapshot(query(collection(db, 'products'),  orderBy('createdAt', 'desc')), s => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'orders'),    orderBy('createdAt', 'desc')), s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'perfume_requests'), orderBy('createdAt', 'desc')), s => setRequests(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc')), s => setBlogPosts(s.docs.map(d => ({ id: d.id, ...d.data() })))),
    ]
    return () => subs.forEach(u => u())
  }, [user])

  if (!authReady) return <Spinner />
  if (!user) return <LoginForm onLogin={() => {}} />

  const saveProduct = async (data) => {
    if (!isFirebaseReady || !db) return
    if (editProd?.id && editProd.id !== 'new') {
      await updateDoc(doc(db, 'products', editProd.id), { ...data, updatedAt: serverTimestamp() })
    } else {
      await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() })
    }
    setEditProd(null)
    setAddMode(false)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?') || !isFirebaseReady || !db) return
    await deleteDoc(doc(db, 'products', id))
  }

  const markOrderStatus = async (id, status) => {
    if (!isFirebaseReady || !db) return
    await updateDoc(doc(db, 'orders', id), { status })
  }

  const saveBlogPost = async (e) => {
    e.preventDefault()
    if (!isFirebaseReady || !db) return
    setBlogSaving(true)
    await addDoc(collection(db, 'blog_posts'), { ...blogForm, createdAt: serverTimestamp() })
    setBlogForm({ title: '', excerpt: '' })
    setBlogSaving(false)
  }

  const statusColor = { pending: '#C9927C', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e' }

  const tabBtn = (t, label) => (
    <button key={t} onClick={() => setTab(t)}
      className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
      style={tab === t ? { background: '#5C1A2B', color: '#fff' } : { color: '#5C1A2B' }}>
      {label}
    </button>
  )

  return (
    <div style={{ background: '#FDF6EC', minHeight: '100vh' }}>
      {/* Admin nav */}
      <div className="sticky top-0 z-50 shadow" style={{ background: '#3D0A14' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-base" style={{ fontFamily: "'Playfair Display', serif", color: '#C9927C' }}>
            LuxeAura Admin
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 hidden sm:block">{user.email}</span>
            <button
              onClick={() => auth && signOut(auth)}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(201,146,124,0.15)', color: '#C9927C' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 inline-flex" style={{ border: '1px solid #e8d5c8' }}>
          {tabBtn('products', `Products (${products.length})`)}
          {tabBtn('orders',   `Orders (${orders.length})`)}
          {tabBtn('requests', `Requests (${requests.length})`)}
          {tabBtn('blog',     'Blog')}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>Products</h2>
              {!addMode && !editProd && (
                <button onClick={() => setAddMode(true)}
                  className="px-4 py-2 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}>
                  + Add Product
                </button>
              )}
            </div>

            {(addMode || editProd) && (
              <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: '1px solid #e8d5c8' }}>
                <h3 className="font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                  {editProd ? 'Edit Product' : 'Add New Product'}
                </h3>
                <ProductForm
                  initial={editProd || null}
                  onSave={saveProduct}
                  onCancel={() => { setEditProd(null); setAddMode(false) }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e8d5c8' }}>
                  <div className="h-32" style={{ background: '#FEF3EE' }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🌸</div>
                    }
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                      {p.name} {p.featured && <span style={{ color: '#C9927C' }}>✦</span>}
                    </p>
                    <p className="text-xs mb-3" style={{ color: '#9a6a5a' }}>{p.category} · {p.price ? `₦${Number(p.price).toLocaleString()}` : 'No price'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditProd(p); setAddMode(false) }}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: '#FEF3EE', color: '#5C1A2B', border: '1px solid #e8d5c8' }}>
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>Orders</h2>
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8d5c8' }}>
                  <div className="flex flex-wrap gap-3 justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#5C1A2B' }}>{o.name}</p>
                      <p className="text-xs" style={{ color: '#9a6a5a' }}>{o.phone} · {o.productName} · {o.size} × {o.qty}</p>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ background: (statusColor[o.status] || '#9a9a9a') + '20', color: statusColor[o.status] || '#9a9a9a' }}>
                      {o.status}
                    </span>
                  </div>
                  {o.total && <p className="text-xs mb-3" style={{ color: '#5C1A2B' }}>Total: ₦{Number(o.total).toLocaleString()}</p>}
                  <div className="flex flex-wrap gap-2">
                    {['confirmed', 'shipped', 'delivered'].map(s => (
                      <button key={s} onClick={() => markOrderStatus(o.id, s)}
                        className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                        style={o.status === s
                          ? { background: '#5C1A2B', color: '#fff' }
                          : { background: '#FEF3EE', color: '#5C1A2B', border: '1px solid #e8d5c8' }
                        }>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-center py-12" style={{ color: '#9a6a5a' }}>No orders yet.</p>}
            </div>
          </div>
        )}

        {/* Requests tab */}
        {tab === 'requests' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>Perfume Requests</h2>
            <div className="space-y-4">
              {requests.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8d5c8' }}>
                  <div className="flex justify-between flex-wrap gap-2 mb-2">
                    <p className="font-semibold text-sm" style={{ color: '#5C1A2B' }}>{r.name}</p>
                    <p className="text-xs" style={{ color: '#C9927C' }}>{r.phone}</p>
                  </div>
                  <p className="text-sm mb-2" style={{ color: '#7a4a3a' }}>{r.description}</p>
                  {(r.minPrice || r.maxPrice) && (
                    <p className="text-xs" style={{ color: '#9a6a5a' }}>Budget: ₦{r.minPrice || '?'} – ₦{r.maxPrice || '?'}</p>
                  )}
                </div>
              ))}
              {requests.length === 0 && <p className="text-sm text-center py-12" style={{ color: '#9a6a5a' }}>No requests yet.</p>}
            </div>
          </div>
        )}

        {/* Blog tab */}
        {tab === 'blog' && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>Blog Posts</h2>

            {/* New post form */}
            <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: '1px solid #e8d5c8' }}>
              <h3 className="font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>New Post</h3>
              <form onSubmit={saveBlogPost} className="space-y-3">
                <input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }}
                  placeholder="Post title *" />
                <textarea value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} required rows={6}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#e8d5c8', '--tw-ring-color': '#C9927C' }}
                  placeholder="Write your post (max 200 words)…" />
                <p className="text-xs" style={{ color: '#9a6a5a' }}>
                  Words: {blogForm.excerpt.trim().split(/\s+/).filter(Boolean).length} / 200
                </p>
                <button type="submit" disabled={blogSaving}
                  className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #5C1A2B, #8B2E3A)' }}>
                  {blogSaving ? 'Publishing…' : 'Publish Post ✦'}
                </button>
              </form>
            </div>

            {/* Existing posts */}
            <div className="space-y-4">
              {blogPosts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #e8d5c8' }}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#5C1A2B' }}>
                        {p.title}
                      </p>
                      <p className="text-xs line-clamp-2" style={{ color: '#9a6a5a' }}>{p.excerpt}</p>
                    </div>
                    <button
                      onClick={() => confirm('Delete this post?') && deleteDoc(doc(db, 'blog_posts', p.id))}
                      className="text-xs px-3 py-1 rounded-lg flex-shrink-0"
                      style={{ background: '#fff0f0', color: '#dc2626', border: '1px solid #fecaca' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && <p className="text-sm text-center py-8" style={{ color: '#9a6a5a' }}>No posts yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
