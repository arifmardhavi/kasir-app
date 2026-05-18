import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0)

  const getData = async () => {
    const { data } = await supabase
      .from('transaction_items')
      .select('qty, price_sell, price_buy')

    let total = 0
    let profit = 0

    data.forEach(item => {
      total += item.qty * item.price_sell
      profit += item.qty * (item.price_sell - item.price_buy)
    })

    setTotalSales(total)
    console.log('Profit:', profit)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Penjualan: {totalSales}</p>
    </div>
  )
}