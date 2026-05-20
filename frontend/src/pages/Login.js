import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your account</p>
        <form onSubmit={handle} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Email" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password" required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.footer}>Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card: { background: '#141414', border: '1px solid #222', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px' },
  title: { color: '#fff', margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 800 },
  sub: { color: '#666', margin: '0 0 2rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.95rem', outline: 'none' },
  btn: { background: '#e63946', color: '#fff', border: 'none', padding: '0.9rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { color: '#555', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' },
  link: { color: '#e63946', textDecoration: 'none' },
};
