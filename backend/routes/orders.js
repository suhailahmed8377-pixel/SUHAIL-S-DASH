import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID with items
router.get('/:id', async (req, res) => {
  try {
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const { customer_name, total_amount, status } = req.body;
    const order_number = `ORD-${Date.now()}`;

    const result = await db.query(
      'INSERT INTO orders (order_number, customer_name, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_number, customer_name, total_amount, status || 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        MAX(total_amount) as highest_order
      FROM orders
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
