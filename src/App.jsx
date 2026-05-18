import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Kasir from './pages/Kasir'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 10 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/kasir">Kasir</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/kasir" element={<Kasir />} />
      </Routes>
    </BrowserRouter>
  )
}