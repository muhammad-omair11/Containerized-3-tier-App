import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>⚡ ShopNow</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Shop</Link>
        {user ? (
          <>
            <Link to="/cart" style={styles.cartBtn}>
              🛒 Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.userLabel}>Hi, {user.name.split(' ')[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: '#0f0f0f', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontSize: '1.4rem', fontWeight: 800, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px' },
  links: { display: 'flex', alignItems: 'center', gap: '1rem' },
  link: { color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' },
  cartBtn: { color: '#fff', textDecoration: 'none', background: '#1a1a1a', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', position: 'relative', border: '1px solid #333' },
  badge: { background: '#e63946', color: '#fff', borderRadius: '50%', padding: '0 5px', fontSize: '0.7rem', marginLeft: '4px', fontWeight: 700 },
  userLabel: { color: '#888', fontSize: '0.85rem' },
  logoutBtn: { background: 'none', border: '1px solid #333', color: '#aaa', cursor: 'pointer', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' },
  registerBtn: { background: '#e63946', color: '#fff', textDecoration: 'none', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 },
};
