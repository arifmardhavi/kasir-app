import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Card from '../components/Card'
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
    total: 0,
    profit: 0
  })

  const [chartData, setChartData] = useState([])

  const getData = async () => {
    const { data } = await supabase
      .from('transaction_items')
      .select('*')

    let total = 0
    let profit = 0

    const grouped = {}

    data.forEach(item => {
      total += item.qty * item.price_sell
      profit += item.qty * (item.price_sell - item.price_buy)

      const date = item.created_at?.slice(0, 10)

      if (!grouped[date]) grouped[date] = 0
      grouped[date] += item.qty * item.price_sell
    })

    setStats({ total, profit })

    setChartData(
      Object.keys(grouped).map(date => ({
        date,
        total: grouped[date]
      }))
    )
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Penjualan" value={formatRupiah(stats.total)} />
        <Card title="Profit" value={formatRupiah(stats.profit)} />
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="mb-4 font-semibold text-red-500">Grafik Penjualan</h3>

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
    </div>
  )
}