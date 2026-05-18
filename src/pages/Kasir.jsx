import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Kasir() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  // ambil produk
  const getProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data)
  }

  useEffect(() => {
    getProducts()
  }, [])

  // tambah ke cart
  const addToCart = (product) => {
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

  // update qty
  const updateQty = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + change) }
        : item
    ))
  }

  // hitung total
  const total = cart.reduce((acc, item) => {
    return acc + item.qty * item.price_sell
  }, 0)

  // simpan transaksi
  const handleSave = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong')
      return
    }

    // 1. insert transaksi
    const { data: trx, error: trxError } = await supabase
      .from('transactions')
      .insert({})
      .select()
      .single()

    if (trxError) {
      alert('Gagal simpan transaksi')
      return
    }

    // 2. insert items
    const items = cart.map(item => ({
      transaction_id: trx.id,
      product_id: item.id,
      qty: item.qty,
      price_buy: item.price_buy,
      price_sell: item.price_sell
    }))

    const { error: itemError } = await supabase
      .from('transaction_items')
      .insert(items)

    if (itemError) {
      alert('Gagal simpan item transaksi')
      return
    }

    // 🔥 3. update stock (AMAN)
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

    // reset cart
    setCart([])
    getProducts()
  }

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>
      
      {/* PRODUK */}
      <div style={{ flex: 2 }}>
        <h2>Produk</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10
        }}>
          {products.map(p => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                cursor: 'pointer',
                borderRadius: 8
              }}
            >
              <h4>{p.name}</h4>
              <p>Rp {p.price_sell}</p>
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
          <div key={item.id} style={{ marginBottom: 10 }}>
            <b>{item.name}</b>
            <br />

            <button onClick={() => updateQty(item.id, -1)}>-</button>
            <span style={{ margin: '0 10px' }}>{item.qty}</span>
            <button onClick={() => updateQty(item.id, 1)}>+</button>

            <p>Rp {item.qty * item.price_sell}</p>
          </div>
        ))}

        <hr />

        <h3>Total: Rp {total}</h3>

        <button
          onClick={handleSave}
          disabled={cart.length === 0}
          style={{
            padding: 10,
            width: '100%',
            background: 'green',
            color: 'white',
            border: 'none'
          }}
        >
          Simpan Transaksi
        </button>
      </div>
    </div>
  )
}