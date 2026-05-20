import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add item');
    }
    setAdding(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={product.image_url} alt={product.name} style={styles.img} />
        <span style={styles.category}>{product.category}</span>
      </div>
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            style={{ ...styles.btn, opacity: adding || product.stock === 0 ? 0.6 : 1 }}
          >
            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
        <span style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</span>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#141414', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' },
  imgWrap: { position: 'relative', height: '200px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  category: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#aaa', fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  body: { padding: '1rem' },
  name: { color: '#fff', margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 600 },
  desc: { color: '#666', fontSize: '0.8rem', margin: '0 0 1rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' },
  price: { color: '#e63946', fontWeight: 800, fontSize: '1.1rem' },
  btn: { background: '#e63946', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 },
  stock: { color: '#555', fontSize: '0.75rem' },
};
