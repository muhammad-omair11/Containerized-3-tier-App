const router = require('express').Router();
const { pool } = require('../db');

// Get all products with optional search/filter
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
  }
  if (category) {
    params.push(category);
    query += ` AND category = $${params.length}`;
  }
  if (minPrice) {
    params.push(minPrice);
    query += ` AND price >= $${params.length}`;
  }
  if (maxPrice) {
    params.push(maxPrice);
    query += ` AND price <= $${params.length}`;
  }
  query += ' ORDER BY created_at DESC';

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(rows.map(r => r.category));
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
