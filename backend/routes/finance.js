import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all finance records
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM finance ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get finance records by type
router.get('/type/:type', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM finance WHERE type = $1 ORDER BY created_at DESC LIMIT 50',
      [req.params.type]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create finance record
router.post('/', async (req, res) => {
  try {
    const { type, amount, description, category } = req.body;
    const result = await db.query(
      'INSERT INTO finance (type, amount, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, amount, description, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get finance summary
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        type,
        COUNT(*) as count,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount
      FROM finance
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY type
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get daily finance trends
router.get('/stats/trends', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        DATE(created_at) as date,
        type,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM finance
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at), type
      ORDER BY date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profit/loss summary
router.get('/stats/profitloss', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as total_revenue,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
        SUM(CASE WHEN type = 'revenue' THEN amount ELSE -amount END) as net_profit
      FROM finance
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
