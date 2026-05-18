import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error('Email dan password wajib diisi')
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      return toast.error(error.message)
    }

    toast.success('Login berhasil')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Kasir SaaS</h1>
          <p className="text-gray-500 text-sm">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:bg-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white font-semibold transition
              ${loading 
                ? 'bg-gray-400' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>

        </form>

      </div>
    </div>
  )
}