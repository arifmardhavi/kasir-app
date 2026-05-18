import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()

  const menus = [
    { name: 'Dashboard', path: '/' },
    { name: 'Kasir', path: '/kasir' },
    { name: 'Produk', path: '/products' },
    { name: 'History', path: '/history' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-5">

      <h1 className="text-xl font-bold mb-6">Kasir App</h1>

      <div className="space-y-2">
        {menus.map(menu => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`block p-2 rounded-lg transition
              ${pathname === menu.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {menu.name}
          </Link>
        ))}
      </div>

    </div>
  )
}