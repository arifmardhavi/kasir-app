import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const { data: p } = await supabase.from('products').select('*')
    const { data: t } = await supabase.from('transactions').select('*')

    setProducts(p || [])
    setTransactions(t || [])
  }

  const totalProduk = products.length
  const totalStock = products.reduce((a, b) => a + b.stock, 0)

  return (
    <div>

      {/* QUICK ACTION */}
      <div className="flex gap-3 mb-6">
        <a href="/kasir" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Transaksi
        </a>
        <a href="/products" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded">
          Kelola Produk
        </a>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Total Produk" value={totalProduk} />
        <Card title="Total Stock" value={totalStock} />
        <Card title="Total Transaksi" value={transactions.length} />
      </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}