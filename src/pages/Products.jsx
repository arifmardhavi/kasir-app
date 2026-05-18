import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Products() {
  const [products, setProducts] = useState([])

  const getData = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Produk</h2>

      <table className="w-full bg-white dark:bg-gray-800 rounded">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nama</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Harga Jual</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">{p.price_sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}