import { supabase } from '../lib/supabase'

export default function Header({ dark, setDark }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex gap-3">
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
        >
          🌙
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}