import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/products/meta/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api.get('/products', { params })
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find What You Love</h1>
        <p style={styles.heroSub}>Premium products, delivered to your door.</p>
        <input
          style={styles.searchInput}
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.container}>
        <div style={styles.filters}>
          <button
            style={{ ...styles.filterBtn, ...(category === '' ? styles.activeFilter : {}) }}
            onClick={() => setCategory('')}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat}
              style={{ ...styles.filterBtn, ...(category === cat ? styles.activeFilter : {}) }}
              onClick={() => setCategory(cat === category ? '' : cat)}
            >{cat}</button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={styles.empty}>No products found.</div>
        ) : (
          <div style={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a' },
  hero: { textAlign: 'center', padding: '4rem 2rem 2rem', background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' },
  heroTitle: { color: '#fff', fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: '-1px' },
  heroSub: { color: '#666', margin: '0 0 2rem', fontSize: '1rem' },
  searchInput: { width: '100%', maxWidth: '500px', padding: '0.8rem 1.2rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' },
  filterBtn: { background: '#1a1a1a', border: '1px solid #333', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' },
  activeFilter: { background: '#e63946', borderColor: '#e63946', color: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  loading: { textAlign: 'center', color: '#555', padding: '4rem' },
  empty: { textAlign: 'center', color: '#555', padding: '4rem' },
};
