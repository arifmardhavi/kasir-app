import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Kasir() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)

  const getProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  const handleSave = async () => {
    // insert transaksi
    const { data: trx } = await supabase
      .from('transactions')
      .insert({})
      .select()
      .single()

    // insert item
    await supabase.from('transaction_items').insert({
      transaction_id: trx.id,
      product_id: selected.id,
      qty: qty,
      price_buy: selected.price_buy,
      price_sell: selected.price_sell
    })

    alert('Transaksi berhasil')
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div>
      <h2>Kasir</h2>

      <select onChange={e => {
        const product = products.find(p => p.id === e.target.value)
        setSelected(product)
      }}>
        <option>Pilih Produk</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input type="number" value={qty} onChange={e => setQty(e.target.value)} />

      <button onClick={handleSave}>Simpan</button>
    </div>
  )
}