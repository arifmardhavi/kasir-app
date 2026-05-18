import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function History() {
  const [data, setData] = useState([])

  const getData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select(`
        id,
        created_at,
        transaction_items (
          qty,
          price_sell,
          products (name)
        )
      `)
      .order('created_at', { ascending: false })

    setData(data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Riwayat Transaksi</h2>

      {data.map(trx => (
        <div key={trx.id} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
          <b>{new Date(trx.created_at).toLocaleString()}</b>

          {trx.transaction_items.map((item, i) => (
            <div key={i}>
              {item.products.name} - {item.qty} pcs
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}