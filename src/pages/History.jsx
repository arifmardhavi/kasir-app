import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function History() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    setTransactions(data || [])
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">History Transaksi</h2>

      <table className="w-full bg-white dark:bg-gray-800 rounded">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Tanggal</th>
            <th className="p-2">ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-b">
              <td className="p-2">
                {new Date(t.created_at).toLocaleString()}
              </td>
              <td className="p-2">{t.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}