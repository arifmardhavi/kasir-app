import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function rupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(n || 0)
}

export default function Dashboard() {
  const [summary, setSummary] = useState({
    revenue: 0,
    cogs: 0,
    profit: 0,
    margin: 0
  })

  const [chart, setChart] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    // ambil semua item transaksi
    const { data: items } = await supabase
      .from('transaction_items')
      .select(`
        qty,
        price_buy,
        price_sell,
        created_at,
        products(name)
      `)

    if (!items) return

    let revenue = 0
    let cogs = 0

    const perDay = {}
    const productMap = {}

    items.forEach(i => {
      const totalSell = i.qty * i.price_sell
      const totalBuy = i.qty * i.price_buy

      revenue += totalSell
      cogs += totalBuy

      // 📊 grouping per hari
      const date = i.created_at?.slice(0, 10)
      if (!perDay[date]) {
        perDay[date] = { date, revenue: 0, profit: 0 }
      }

      perDay[date].revenue += totalSell
      perDay[date].profit += (totalSell - totalBuy)

      // 🏆 top produk
      const name = i.products?.name || 'Unknown'
      if (!productMap[name]) {
        productMap[name] = { name, profit: 0, qty: 0 }
      }

      productMap[name].profit += (totalSell - totalBuy)
      productMap[name].qty += i.qty
    })

    const profit = revenue - cogs
    const margin = revenue ? (profit / revenue) * 100 : 0

    setSummary({ revenue, cogs, profit, margin })

    setChart(Object.values(perDay))

    setTopProducts(
      Object.values(productMap)
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5)
    )
  }

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Revenue" value={rupiah(summary.revenue)} />
        <Card title="COGS" value={rupiah(summary.cogs)} />
        <Card title="Profit" value={rupiah(summary.profit)} />
        <Card title="Margin" value={`${summary.margin.toFixed(2)}%`} />
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
        <h3 className="mb-4 font-semibold">Profit per Hari</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chart}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TOP PRODUCT */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
        <h3 className="mb-4 font-semibold">Top Produk (by Profit)</h3>

        {topProducts.map(p => (
          <div key={p.name} className="flex justify-between border-b py-2">
            <span>{p.name}</span>
            <span>{rupiah(p.profit)}</span>
          </div>
        ))}
      </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-lg font-bold">{value}</h2>
    </div>
  )
}