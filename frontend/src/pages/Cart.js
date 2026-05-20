import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, updateQty, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const handleCheckout = async () => {
    setChecking(true);
    try {
      await api.post('/orders/checkout');
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Checkout failed');
    }
    setChecking(false);
  };

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🛒</div>
      <h2 style={styles.emptyText}>Your cart is empty</h2>
      <button style={styles.shopBtn} onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>
        <div style={styles.layout}>
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item.id} style={styles.item}>
                <img src={item.image_url} alt={item.name} style={styles.img} />
                <div style={styles.info}>
                  <h3 style={styles.name}>{item.name}</h3>
                  <span style={styles.price}>${parseFloat(item.price).toFixed(2)} each</span>
                </div>
                <div style={styles.qtyControls}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <span style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</span>
                <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping</span><span style={{ color: '#4caf50' }}>Free</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #222', paddingTop: '1rem', fontWeight: 700, color: '#fff' }}>
              <span>Total</span><span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              style={{ ...styles.checkoutBtn, opacity: checking ? 0.6 : 1 }}
              onClick={handleCheckout}
              disabled={checking}
            >
              {checking ? 'Processing...' : 'Place Order'}
            </button>
            <button style={styles.continueBtn} onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', paddingBottom: '4rem' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' },
  layout: { display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  items: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '1rem' },
  img: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
  info: { flex: 1 },
  name: { color: '#fff', margin: '0 0 0.3rem', fontSize: '0.95rem' },
  price: { color: '#666', fontSize: '0.8rem' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: { background: '#222', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  qty: { color: '#fff', minWidth: '20px', textAlign: 'center' },
  subtotal: { color: '#fff', fontWeight: 700, minWidth: '60px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' },
  summary: { width: '280px', background: '#141414', border: '1px solid #222', borderRadius: '12px', padding: '1.5rem' },
  summaryTitle: { color: '#fff', marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '0.75rem', fontSize: '0.9rem' },
  checkoutBtn: { width: '100%', background: '#e63946', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' },
  continueBtn: { width: '100%', background: 'none', color: '#555', border: '1px solid #333', padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', marginTop: '0.5rem', fontSize: '0.9rem' },
  empty: { minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' },
  emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
  emptyText: { color: '#666', marginBottom: '2rem' },
  shopBtn: { background: '#e63946', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 },
};
