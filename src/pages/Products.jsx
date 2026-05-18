import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Products() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '',
    price_buy: '',
    price_sell: '',
    stock: ''
  })

  const getData = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  useEffect(() => {
    getData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('products').insert([form])

    if (error) return toast.error(error.message)

    toast.success('Produk ditambahkan')
    setForm({ name: '', price_buy: '', price_sell: '', stock: '' })
    getData()
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Produk</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 mb-6">
        <input placeholder="Nama" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded" />

        <input placeholder="Harga Beli" value={form.price_buy}
          onChange={e => setForm({ ...form, price_buy: e.target.value })}
          className="p-2 border rounded" />

        <input placeholder="Harga Jual" value={form.price_sell}
          onChange={e => setForm({ ...form, price_sell: e.target.value })}
          className="p-2 border rounded" />

        <input placeholder="Stock" value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          className="p-2 border rounded" />

        <button className="col-span-4 bg-blue-600 text-white p-2 rounded">
          Tambah Produk
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full bg-white dark:bg-gray-800 rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Nama</th>
            <th className="p-2">Harga Beli</th>
            <th className="p-2">Harga Jual</th>
            <th className="p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price_buy}</td>
              <td className="p-2">{p.price_sell}</td>
              <td className="p-2">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}