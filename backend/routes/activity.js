const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const result = await pool.query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT $1', [limit]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { action } = req.body;
    const result = await pool.query('INSERT INTO activity_log (action) VALUES ($1) RETURNING *', [action]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
