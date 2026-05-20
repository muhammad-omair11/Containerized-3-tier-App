import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.sub}>Join thousands of happy shoppers</p>
        <form onSubmit={handle} style={styles.form}>
          <input style={styles.input} type="text" placeholder="Full name" required
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input style={styles.input} type="email" placeholder="Email" required
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password (min 6 chars)" minLength={6} required
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={styles.link}>Sign in</Link></p>
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
