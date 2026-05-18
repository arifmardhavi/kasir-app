import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Products from './pages/Products'
import Kasir from './pages/Kasir'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/kasir" element={<Kasir />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}