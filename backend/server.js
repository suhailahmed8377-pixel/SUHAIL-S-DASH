import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import db from './db.js';
import ordersRouter from './routes/orders.js';
import inventoryRouter from './routes/inventory.js';
import financeRouter from './routes/finance.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/finance', financeRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// WebSocket connections - broadcast real-time data
const clients = new Set();
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast function
export function broadcastUpdate(event, data) {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
}

// Simulate real-time updates every 10 seconds
setInterval(async () => {
  try {
    const orders = await db.query('SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders WHERE created_at > NOW() - INTERVAL \'1 day\'');
    const inventory = await db.query('SELECT COUNT(*) as total_items, SUM(quantity) as total_quantity FROM inventory');
    const finance = await db.query('SELECT SUM(amount) as total_expense FROM finance WHERE type = \'expense\' AND created_at > NOW() - INTERVAL \'1 day\'');

    broadcastUpdate('metrics', {
      orders: orders.rows[0],
      inventory: inventory.rows[0],
      finance: finance.rows[0]
    });
  } catch (error) {
    console.error('Error broadcasting metrics:', error);
  }
}, 10000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ WebSocket available at ws://localhost:${PORT}/ws`);
});
