const express = require('express');
const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { phone, message, label } = req.body;
    // Placeholder for WhatsApp integration
    console.log(`WhatsApp message to ${phone}: ${message}`);
    res.json({ success: true, message: 'Message queued' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/threads', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
