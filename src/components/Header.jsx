export default function Header({ dark, setDark }) {
  return (
    <div className="flex justify-between items-center mb-6 relative z-50">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex gap-3">
        <button
          onClick={() => {
                console.log('CLICKED')
                setDark(!dark)
            }}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 cursor-pointer"
        >
            {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.reload()
          }}
          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  )
}