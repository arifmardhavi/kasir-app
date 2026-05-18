import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Kasir from './pages/Kasir'
import History from './pages/History'
import MainLayout from './layouts/MainLayout'

export default function App() {
  const [session, setSession] = useState(null)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // 🔥 DARK MODE FIX (langsung ke HTML)
  useEffect(() => {
    const root = document.documentElement

    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [dark])

  if (!session) return <Login />

  return (
    <BrowserRouter>
      <MainLayout dark={dark} setDark={setDark}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/kasir" element={<Kasir />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}