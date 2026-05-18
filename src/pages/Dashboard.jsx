import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/format'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPenjualan: 0,
    totalProfit: 0
  })

  const [chartData, setChartData] = useState([])

  const getData = async () => {
    const { data } = await supabase
      .from('transaction_items')
      .select('*')

    let total = 0
    let profit = 0

    data.forEach(item => {
      total += item.qty * item.price_sell
      profit += item.qty * (item.price_sell - item.price_buy)
    })

    setStats({
      totalPenjualan: total,
      totalProfit: profit
    })

    // 📊 chart sederhana per transaksi
    const grouped = {}

    data.forEach(item => {
      const key = item.created_at?.slice(0, 10) || 'today'

      if (!grouped[key]) {
        grouped[key] = 0
      }

      grouped[key] += item.qty * item.price_sell
    })

    const chart = Object.keys(grouped).map(date => ({
      date,
      total: grouped[date]
    }))

    setChartData(chart)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Total Penjualan: {formatRupiah(stats.totalPenjualan)}</p>
      <p>Total Profit: {formatRupiah(stats.totalProfit)}</p>

      <h3>Grafik Penjualan</h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}