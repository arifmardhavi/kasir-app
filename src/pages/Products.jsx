import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Products() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [buy, setBuy] = useState('')
  const [sell, setSell] = useState('')
  const [stock, setStock] = useState('')

  const getProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  const addProduct = async () => {
    await supabase.from('products').insert({
      name,
      price_buy: buy,
      price_sell: sell,
      stock
    })
    getProducts()
  }

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <div>
      <h2>Products</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Buy" onChange={e => setBuy(e.target.value)} />
      <input placeholder="Sell" onChange={e => setSell(e.target.value)} />
      <input placeholder="Stock" onChange={e => setStock(e.target.value)} />

      <button onClick={addProduct}>Add</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.stock}
          </li>
        ))}
      </ul>
    </div>
  )
}