'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './page.css';

const API_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000/ws';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [finance, setFinance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);
      if (eventType === 'metrics') {
        setMetrics(data);
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(() => {
        // Attempt reconnect
        window.location.reload();
      }, 3000);
    };

    return () => ws.close();
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, inventoryRes, financeRes] = await Promise.all([
          axios.get(`${API_URL}/api/orders`),
          axios.get(`${API_URL}/api/inventory`),
          axios.get(`${API_URL}/api/finance/stats/profitloss`)
        ]);

        setOrders(ordersRes.data);
        setInventory(inventoryRes.data);
        setFinance(financeRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const orderStatusCounts = orders.reduce((acc, order) => {
    const existing = acc.find(item => item.name === order.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: order.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Real-time ERP Dashboard</h1>
        <div className="status">
          <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '🟢 Live' : '🔴 Offline'}
          </span>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
        <button
          className={`tab ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
        </button>
      </nav>

      <div className="content">
        {activeTab === 'overview' && (
          <div className="overview">
            <div className="kpi-grid">
              {metrics && (
                <>
                  <div className="kpi-card">
                    <h3>📦 Today's Orders</h3>
                    <p className="kpi-value">{metrics.orders.total || 0}</p>
                    <small className="kpi-label">Total: ${metrics.orders.revenue || 0}</small>
                  </div>
                  <div className="kpi-card">
                    <h3>🏭 Inventory Items</h3>
                    <p className="kpi-value">{metrics.inventory.total_items || 0}</p>
                    <small className="kpi-label">Units: {metrics.inventory.total_quantity || 0}</small>
                  </div>
                  <div className="kpi-card">
                    <h3>💰 Daily Expenses</h3>
                    <p className="kpi-value">${metrics.finance.total_expense || 0}</p>
                    <small className="kpi-label">Today's spending</small>
                  </div>
                  <div className="kpi-card">
                    <h3>📈 Profit/Loss</h3>
                    <p className="kpi-value" style={{ color: finance?.net_profit > 0 ? 'green' : 'red' }}>
                      ${finance?.net_profit || 0}
                    </p>
                    <small className="kpi-label">Last 30 days</small>
                  </div>
                </>
              )}
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h3>Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Revenue vs Expense (30 days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Revenue', value: finance?.total_revenue || 0 },
                    { name: 'Expense', value: finance?.total_expense || 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Recent Orders</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.customer_name}</td>
                    <td>${order.total_amount}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <h2>Inventory Status</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {inventory.slice(0, 10).map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td><strong>{item.quantity}</strong></td>
                    <td>{item.warehouse_location}</td>
                    <td>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="finance-section">
            <h2>Financial Summary (Last 30 Days)</h2>
            <div className="finance-grid">
              <div className="finance-card">
                <h4>Total Revenue</h4>
                <p className="finance-value">${finance?.total_revenue || 0}</p>
              </div>
              <div className="finance-card">
                <h4>Total Expense</h4>
                <p className="finance-value">${finance?.total_expense || 0}</p>
              </div>
              <div className="finance-card">
                <h4>Net Profit/Loss</h4>
                <p className="finance-value" style={{ color: finance?.net_profit > 0 ? 'green' : 'red' }}>
                  ${finance?.net_profit || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
