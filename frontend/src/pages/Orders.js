import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({ confirmed: '#4caf50', pending: '#ff9800', cancelled: '#e63946' }[s] || '#888');

  if (loading) return <div style={styles.loading}>Loading orders...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Your Orders</h1>
        {orders.length === 0 ? (
          <div style={styles.empty}>No orders yet. Start shopping!</div>
        ) : (
          <div style={styles.list}>
            {orders.map(order => (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.orderId}>Order #{order.id}</span>
                    <span style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.right}>
                    <span style={{ ...styles.status, color: statusColor(order.status) }}>● {order.status}</span>
                    <span style={styles.total}>${parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </div>
                <div style={styles.items}>
                  {order.items?.map(item => (
                    <div key={item.id} style={styles.item}>
                      <img src={item.image_url} alt={item.name} style={styles.img} />
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemQty}>×{item.quantity}</span>
                      <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', paddingBottom: '4rem' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  title: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  card: { background: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #222' },
  orderId: { color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginRight: '1rem' },
  date: { color: '#555', fontSize: '0.8rem' },
  right: { display: 'flex', alignItems: 'center', gap: '1rem' },
  status: { fontSize: '0.8rem', textTransform: 'capitalize' },
  total: { color: '#fff', fontWeight: 700 },
  items: { padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: { display: 'flex', alignItems: 'center', gap: '1rem' },
  img: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' },
  itemName: { flex: 1, color: '#ccc', fontSize: '0.9rem' },
  itemQty: { color: '#555', fontSize: '0.85rem' },
  itemPrice: { color: '#aaa', fontSize: '0.9rem', fontWeight: 600 },
  loading: { textAlign: 'center', color: '#555', padding: '4rem', background: '#0a0a0a', minHeight: '80vh' },
  empty: { textAlign: 'center', color: '#555', padding: '4rem' },
};
