import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/format'

export default function Kasir() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')

  const getProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  useEffect(() => {
    getProducts()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product) => {
    if (product.stock <= 0) return

    const exist = cart.find(i => i.id === product.id)

    if (exist) {
      setCart(cart.map(i =>
        i.id === product.id ? { ...i, qty: i.qty + 1 } : i
      ))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const updateQty = (id, change) => {
    setCart(cart.map(i =>
      i.id === id
        ? { ...i, qty: Math.max(1, i.qty + change) }
        : i
    ))
  }

  const total = cart.reduce((acc, i) => acc + i.qty * i.price_sell, 0)

  const handleSave = async () => {
    if (cart.length === 0) return alert('Keranjang kosong')

    const { data: trx } = await supabase
      .from('transactions')
      .insert({})
      .select()
      .single()

    const items = cart.map(i => ({
      transaction_id: trx.id,
      product_id: i.id,
      qty: i.qty,
      price_buy: i.price_buy,
      price_sell: i.price_sell
    }))

    await supabase.from('transaction_items').insert(items)

    for (const item of cart) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single()

      await supabase
        .from('products')
        .update({
          stock: product.stock - item.qty
        })
        .eq('id', item.id)
    }

    setCart([])
    getProducts()
  }

  return (
    <div className="flex gap-6">

      {/* PRODUK */}
      <div className="flex-1">
        <input
          className="w-full p-2 mb-4 rounded border dark:bg-gray-800"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-4">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className={`p-4 rounded-lg shadow cursor-pointer 
              ${p.stock <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <h3>{p.name}</h3>
              <p>{formatRupiah(p.price_sell)}</p>
              <span>Stock: {p.stock}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-80 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="font-bold mb-4">Keranjang</h2>

        {cart.map(item => (
          <div key={item.id} className="mb-2">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>{formatRupiah(item.qty * item.price_sell)}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => updateQty(item.id, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)}>+</button>
            </div>
          </div>
        ))}

        <h3 className="mt-4 font-bold">
          Total: {formatRupiah(total)}
        </h3>

        <button
          onClick={handleSave}
          className="w-full mt-2 bg-green-600 text-white p-2 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  )
}