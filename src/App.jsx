import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Kasir from './pages/Kasir'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // 🔒 kalau belum login → tampil login
  if (!session) {
    return <Login />
  }

  // ✅ kalau sudah login → tampil app + navbar
  return (
    <BrowserRouter>
      <nav style={{
        display: 'flex',
        gap: '20px',
        padding: '10px',
        background: '#222',
        color: '#fff'
      }}>
        <Link to="/" style={{ color: 'white' }}>Dashboard</Link>
        <Link to="/products" style={{ color: 'white' }}>Products</Link>
        <Link to="/kasir" style={{ color: 'white' }}>Kasir</Link>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/kasir" element={<Kasir />} />
      </Routes>
    </BrowserRouter>
  )
}