import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function MainLayout({ children, dark, setDark }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-white transition-colors">

      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header dark={dark} setDark={setDark} />
        {children}
      </div>

    </div>
  )
}