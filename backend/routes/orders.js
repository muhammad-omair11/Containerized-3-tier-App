const router = require('express').Router();
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

// Get user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    for (const order of orders) {
      const { rows: items } = await pool.query(
        `SELECT oi.*, p.name, p.image_url FROM order_items oi
         JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Checkout — create order from cart
router.post('/checkout', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: cartItems } = await client.query(
      `SELECT c.quantity, p.id as product_id, p.price, p.stock
       FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (!cartItems.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient stock for some items' });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { rows: [order] } = await client.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, total.toFixed(2), 'confirmed']
    );

    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    await client.query('COMMIT');

    res.status(201).json({ ...order, items: cartItems });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Checkout failed' });
  } finally {
    client.release();
  }
});

module.exports = router;
