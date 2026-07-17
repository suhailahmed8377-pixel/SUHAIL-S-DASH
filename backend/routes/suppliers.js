const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.getAll();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.getById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, payable } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
    
    const supplier = await Supplier.create(name, phone, payable || 0);
    await Activity.log(`Added supplier: ${name}`);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, payable } = req.body;
    const supplier = await Supplier.update(req.params.id, name, phone, payable);
    await Activity.log(`Updated supplier: ${name}`);
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Supplier.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
