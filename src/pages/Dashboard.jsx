import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const { data: p } = await supabase.from('products').select('*')
    const { data: t } = await supabase.from('transactions').select('*')

    setProducts(p || [])
    setTransactions(t || [])

    // dummy chart (biar ga undefined)
    const grouped = {}
    t?.forEach(item => {
      const date = item.created_at.slice(0, 10)
      grouped[date] = (grouped[date] || 0) + 1
    })

    const chart = Object.keys(grouped).map(k => ({
      date: k,
      total: grouped[k]
    }))

    setChartData(chart)
  }

  return (
    <div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card title="Produk" value={products.length} />
        <Card title="Transaksi" value={transactions.length} />
        <Card title="Stock" value={products.reduce((a, b) => a + b.stock, 0)} />
      </div>

      {/* CHART */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded">
        <h3 className="mb-4">Transaksi per Hari</h3>

        <BarChart width={500} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </div>

    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  )
}