const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.getById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, outstanding } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    
    const customer = await Customer.create(name, phone, outstanding || 0);
    await Activity.log(`Added customer: ${name}`);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, outstanding } = req.body;
    const customer = await Customer.update(req.params.id, name, phone, outstanding);
    await Activity.log(`Updated customer: ${name}`);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Customer.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
