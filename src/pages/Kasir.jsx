import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { formatRupiah } from '../utils/format'
import toast from 'react-hot-toast'

export default function Kasir() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const searchRef = useRef()

  const getProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  useEffect(() => {
    getProducts()
    searchRef.current.focus()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product) => {
    if (product.stock <= 0) {
      return toast.error('Stock habis')
    }

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

  const removeItem = (id) => {
    setCart(cart.filter(i => i.id !== id))
  }

  const total = cart.reduce((acc, i) => acc + i.qty * i.price_sell, 0)

  const handleSave = async () => {
    if (cart.length === 0) {
      return toast.error('Keranjang kosong')
    }

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
    toast.success('Transaksi berhasil')
  }

  return (
    <div className="flex gap-6">

      {/* PRODUK */}
      <div className="flex-1">

        <input
          ref={searchRef}
          className="w-full p-3 mb-4 rounded-lg border dark:bg-gray-800"
          placeholder="🔍 Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className={`p-4 rounded-xl shadow cursor-pointer transition
              ${p.stock <= 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <h3 className="font-semibold">{p.name}</h3>
              <p>{formatRupiah(p.price_sell)}</p>
              <span className="text-sm">Stock: {p.stock}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div className="w-96 bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col">

        <h2 className="font-bold mb-4">🛒 Keranjang</h2>

        <div className="flex-1 overflow-y-auto space-y-3">
          {cart.map(item => (
            <div key={item.id} className="border-b pb-2">

              <div className="flex justify-between">
                <span>{item.name}</span>
                <span>{formatRupiah(item.qty * item.price_sell)}</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button onClick={() => updateQty(item.id, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}>+</button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-red-500"
                >
                  ✕
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* TOTAL FIXED */}
        <div className="mt-4 border-t pt-4">
          <h3 className="text-xl font-bold">
            Total: {formatRupiah(total)}
          </h3>

          <button
            onClick={handleSave}
            disabled={cart.length === 0}
            className={`w-full mt-3 p-3 rounded-lg text-white font-semibold
              ${cart.length === 0 
                ? 'bg-gray-400' 
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            Simpan Transaksi
          </button>
        </div>

      </div>
    </div>
  )
}