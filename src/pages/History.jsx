import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function History() {
  const [transactions, setTransactions] = useState([])
  const [detail, setDetail] = useState(null)

  const getData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    setTransactions(data || [])
  }

  useEffect(() => {
    getData()
  }, [])

  const getDetail = async (id) => {
    const { data } = await supabase
      .from('transaction_items')
      .select('*, products(name)')
      .eq('transaction_id', id)

    setDetail(data)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">History</h2>

      <table className="w-full bg-white dark:bg-gray-800 rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Tanggal</th>
            <th className="p-2">ID</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-b">
              <td className="p-2">
                {new Date(t.created_at).toLocaleString()}
              </td>
              <td className="p-2">{t.id}</td>
              <td className="p-2">
                <button
                  onClick={() => getDetail(t.id)}
                  className="text-blue-500"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DETAIL */}
      {detail && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded">
          <h3 className="font-bold mb-2">Detail Transaksi</h3>

          {detail.map(d => (
            <div key={d.id} className="flex justify-between border-b py-1">
              <span>{d.products?.name}</span>
              <span>{d.qty} x {d.price_sell}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}