import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalStock: 0,
    totalTerjual: 0,
    totalPenjualan: 0,
    totalProfit: 0
  })

  const getData = async () => {
    // ambil products
    const { data: products } = await supabase
      .from('products')
      .select('*')

    // ambil transaksi
    const { data: items } = await supabase
      .from('transaction_items')
      .select('*')

    let totalStock = 0
    products.forEach(p => totalStock += p.stock)

    let totalTerjual = 0
    let totalPenjualan = 0
    let totalProfit = 0

    items.forEach(item => {
      totalTerjual += item.qty
      totalPenjualan += item.qty * item.price_sell
      totalProfit += item.qty * (item.price_sell - item.price_buy)
    })

    setStats({
      totalProduk: products.length,
      totalStock,
      totalTerjual,
      totalPenjualan,
      totalProfit
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Total Produk: {stats.totalProduk}</p>
      <p>Total Stock: {stats.totalStock}</p>
      <p>Total Terjual: {stats.totalTerjual}</p>
      <p>Total Penjualan: {stats.totalPenjualan}</p>
      <p>Total Profit: {stats.totalProfit}</p>
    </div>
  )
}