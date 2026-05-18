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

  // 🔍 filter search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // tambah ke cart
  const addToCart = (product) => {
    if (product.stock <= 0) return // 🚫 disable kalau stock habis

    const exist = cart.find(item => item.id === product.id)

    if (exist) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const updateQty = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + change) }
        : item
    ))
  }

  const total = cart.reduce((acc, item) => {
    return acc + item.qty * item.price_sell
  }, 0)

  const handleSave = async () => {
    if (cart.length === 0) return alert('Keranjang kosong')

    const { data: trx } = await supabase
      .from('transactions')
      .insert({})
      .select()
      .single()

    const items = cart.map(item => ({
      transaction_id: trx.id,
      product_id: item.id,
      qty: item.qty,
      price_buy: item.price_buy,
      price_sell: item.price_sell
    }))

    await supabase.from('transaction_items').insert(items)

    // update stock
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

    alert('Transaksi berhasil')
    setCart([])
    getProducts()
  }

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>

      {/* PRODUK */}
      <div style={{ flex: 2 }}>
        <h2>Produk</h2>

        {/* 🔍 SEARCH */}
        <input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 10, padding: 5, width: '100%' }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10
        }}>
          {filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                cursor: p.stock > 0 ? 'pointer' : 'not-allowed',
                opacity: p.stock > 0 ? 1 : 0.5,
                borderRadius: 8
              }}
            >
              <h4>{p.name}</h4>
              <p>{formatRupiah(p.price_sell)}</p>
              <small>Stock: {p.stock}</small>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div style={{ flex: 1 }}>
        <h2>Keranjang</h2>

        {cart.length === 0 && <p>Belum ada item</p>}

        {cart.map(item => (
          <div key={item.id}>
            <b>{item.name}</b>
            <br />

            <button onClick={() => updateQty(item.id, -1)}>-</button>
            <span style={{ margin: '0 10px' }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id, 1)}>+</button>

            <p>{formatRupiah(item.qty * item.price_sell)}</p>
          </div>
        ))}

        <hr />

        <h3>Total: {formatRupiah(total)}</h3>

        <button onClick={handleSave} disabled={cart.length === 0}>
          Simpan Transaksi
        </button>
      </div>
    </div>
  )
}