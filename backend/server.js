const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const stockRoutes = require('./routes/stock');
const invoiceRoutes = require('./routes/invoices');
const paymentRoutes = require('./routes/payments');
const whatsappRoutes = require('./routes/whatsapp');
const meeshoRoutes = require('./routes/meesho');
const activityRoutes = require('./routes/activity');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/meesho', meeshoRoutes);
app.use('/api/activity', activityRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Evomoda Backend running on port ${PORT}`);
  console.log(`📚 Database: ${process.env.DB_NAME}`);
});

module.exports = app;
