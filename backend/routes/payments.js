const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Activity = require('../models/Activity');

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.getAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, partyId, partyType, direction, amount, reference } = req.body;
    
    const payment = await Payment.create(date, partyId, partyType, direction, amount, reference);
    
    if (partyType === 'customer' && direction === 'in') {
      const customer = await Customer.getById(partyId);
      await Customer.updateOutstanding(partyId, Math.max(0, customer.outstanding - amount));
    } else if (partyType === 'supplier' && direction === 'out') {
      const supplier = await Supplier.getById(partyId);
      await Supplier.updatePayable(partyId, Math.max(0, supplier.payable - amount));
    }
    
    await Activity.log(`Payment recorded: ${amount}`);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const incoming = await Payment.getIncomingTotal();
    const outgoing = await Payment.getOutgoingTotal();
    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
