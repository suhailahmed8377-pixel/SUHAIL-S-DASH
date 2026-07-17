const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/accounts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meesho_accounts ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meesho_accounts');
    const accounts = result.rows;
    
    const totals = accounts.reduce((acc, a) => ({
      orders: acc.orders + a.orders,
      dispatched: acc.dispatched + a.dispatched,
      returns: acc.returns + a.returns,
      dispatch_amount: acc.dispatch_amount + parseFloat(a.dispatch_amount),
      return_amount: acc.return_amount + parseFloat(a.return_amount)
    }), { orders: 0, dispatched: 0, returns: 0, dispatch_amount: 0, return_amount: 0 });
    
    res.json(totals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
