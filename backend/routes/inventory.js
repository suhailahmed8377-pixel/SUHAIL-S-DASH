import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, p.name, p.sku, p.price FROM inventory i
      JOIN products p ON i.product_id = p.id
      ORDER BY i.last_updated DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory by product ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, p.name, p.sku, p.price FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const result = await db.query(
      'UPDATE inventory SET quantity = $1, last_updated = NOW() WHERE id = $2 RETURNING *',
      [quantity, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get low stock items (< 50 units)
router.get('/alerts/lowstock', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, p.name, p.sku FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.quantity < 50
      ORDER BY i.quantity ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory summary
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        AVG(quantity) as avg_quantity,
        MIN(quantity) as min_quantity,
        MAX(quantity) as max_quantity
      FROM inventory
    `);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
