const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const Activity = require('../models/Activity');

router.get('/fabrics', async (req, res) => {
  try {
    const fabrics = await Stock.getAllFabrics();
    res.json(fabrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/fabrics/:id', async (req, res) => {
  try {
    const fabric = await Stock.getFabricById(req.params.id);
    if (!fabric) return res.status(404).json({ error: 'Fabric not found' });
    res.json(fabric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fabrics', async (req, res) => {
  try {
    const { name, rate } = req.body;
    const fabric = await Stock.createFabric(name, rate);
    await Activity.log(`Created fabric: ${name}`);
    res.status(201).json(fabric);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/lumps', async (req, res) => {
  try {
    const { fabricId, lumpId, meters } = req.body;
    await Stock.addLump(fabricId, lumpId, meters);
    await Activity.log(`Added lump ${lumpId} to fabric`);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const threshold = req.query.threshold || 20;
    const lowStock = await Stock.getLowStockLumps(threshold);
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
