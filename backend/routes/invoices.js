const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Stock = require('../models/Stock');
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.getAll();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.getById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerId, fabricId, quantity, rate, source, lumpsUsed } = req.body;
    
    const invoice = await Invoice.create(customerId, fabricId, quantity, rate, source, lumpsUsed);
    
    // Update customer outstanding
    const customer = await Customer.getById(customerId);
    await Customer.updateOutstanding(customerId, customer.outstanding + (quantity * rate));
    
    // Consume stock
    await Stock.consumeLumps(fabricId, lumpsUsed);
    
    await Activity.log(`Invoice created: ${invoice.invoice_number}`);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/today/summary', async (req, res) => {
  try {
    const summary = await Invoice.getTodayTotal();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
