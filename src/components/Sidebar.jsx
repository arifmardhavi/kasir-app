import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()

  const menu = [
    { name: 'Dashboard', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Kasir', path: '/kasir' },
    { name: 'History', path: '/history' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 p-5">
      <h1 className="text-2xl font-bold mb-8">🚀 Kasir SaaS</h1>

      <nav className="flex flex-col gap-2">
        {menu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-2 rounded-lg transition 
              ${pathname === item.path 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}