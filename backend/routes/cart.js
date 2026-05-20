const router = require('express').Router();
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

// Get user cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to cart
router.post('/', authMiddleware, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3
       RETURNING *`,
      [req.user.id, product_id, quantity]
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update quantity
router.put('/:id', authMiddleware, async (req, res) => {
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      return res.json({ deleted: true });
    }
    const { rows } = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, req.params.id, req.user.id]
    );
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
