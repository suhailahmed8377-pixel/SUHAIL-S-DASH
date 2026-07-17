# 🚀 Real-time ERP Dashboard

A simplified, production-ready ERP system with a **real-time dashboard** using **PostgreSQL**, **Express**, and **Next.js**. No Supabase, no Vercel — just pure Node.js running locally.

## 🎯 Features

✅ **Real-time Dashboard** with live KPI updates  
✅ **WebSocket Integration** for instant data refresh  
✅ **Multiple Views**: CEO, Orders, Inventory, Finance  
✅ **RESTful API** with complete CRUD operations  
✅ **PostgreSQL Database** with sample data  
✅ **Docker Support** for easy PostgreSQL setup  
✅ **Beautiful Charts** using Recharts  
✅ **Responsive Design** for desktop & mobile  

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14 + React 18 |
| **Backend** | Express.js + WebSockets |
| **Database** | PostgreSQL 16 |
| **Charts** | Recharts |
| **Hosting** | Local (no cloud required) |

## 📋 Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **Docker & Docker Compose** ([Download](https://docker.com))
- **PostgreSQL** (optional if using Docker)

## 🚀 Quick Start (5 minutes)

### 1️⃣ Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### 2️⃣ Install Dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3️⃣ Setup Database

```bash
npm run db:setup
npm run db:seed
```

### 4️⃣ Start Everything

```bash
npm run dev
```

### 5️⃣ Open in Browser

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000/ws

---

## 📁 Project Structure

```
suhail-s-dash/
├── backend/
│   ├── server.js                 # Express + WebSocket server
│   ├── db.js                     # PostgreSQL connection
│   ├── routes/
│   │   ├── orders.js             # Order APIs
│   │   ├── inventory.js          # Inventory APIs
│   │   └── finance.js            # Finance APIs
│   └── scripts/
│       ├── setupDb.js            # Create tables
│       └── seedDb.js             # Sample data
├── frontend/
│   ├── src/app/
│   │   ├── page.js               # Main dashboard
│   │   ├── page.css              # Dashboard styling
│   │   ├── layout.js             # Next.js layout
│   │   └── globals.css           # Global styles
│   ├── next.config.js            # Next.js config
│   └── package.json
├── docker-compose.yml            # PostgreSQL setup
├── package.json                  # Root package
└── README.md                     # This file
```

---

## 📊 API Endpoints

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/stats/summary` - Order statistics

### Inventory
- `GET /api/inventory` - List inventory
- `PUT /api/inventory/:id` - Update quantity
- `GET /api/inventory/alerts/lowstock` - Low stock alerts
- `GET /api/inventory/stats/summary` - Inventory summary

### Finance
- `GET /api/finance` - List finance records
- `POST /api/finance` - Create record
- `GET /api/finance/type/:type` - Filter by type
- `GET /api/finance/stats/summary` - Finance summary
- `GET /api/finance/stats/profitloss` - P&L report
- `GET /api/finance/stats/trends` - 7-day trends

---

## 🎨 Dashboard Tabs

### 📈 Overview
- Real-time KPIs (Orders, Inventory, Expenses, Profit)
- Order status pie chart
- Revenue vs Expense bar chart

### 📦 Orders
- All orders list
- Status tracking (pending, processing, shipped, delivered)
- Customer details
- Order amounts

### 🏭 Inventory
- Product inventory levels
- Warehouse locations
- Stock quantity tracking
- Price information

### 💰 Finance
- Revenue summary
- Expense tracking
- Profit/Loss calculation
- 30-day financial summary

---

## 🔌 WebSocket Events

Real-time updates broadcast every 10 seconds:

```javascript
// Event format
{
  event: 'metrics',
  data: {
    orders: { total: 15, revenue: 5500 },
    inventory: { total_items: 5, total_quantity: 945 },
    finance: { total_expense: 2300 }
  },
  timestamp: '2024-07-17T20:54:32Z'
}
```

---

## 🗄️ Database Schema

### Tables
- **users** - User accounts & roles
- **products** - Product catalog
- **inventory** - Stock levels
- **orders** - Customer orders
- **order_items** - Order line items
- **finance** - Revenue/expense records
- **returns** - Return management

---

## 🛑 Troubleshooting

### ❌ PostgreSQL connection failed
```bash
# Check if Docker container is running
docker ps

# Check logs
docker logs erp-postgres

# Restart Docker
docker-compose down
docker-compose up -d
```

### ❌ Port already in use
```bash
# Change port in backend/.env
PORT=5001

# Or kill process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### ❌ WebSocket connection failed
- Check backend is running: `curl http://localhost:5000/health`
- Check firewall settings
- Browser console may have CORS errors

### ❌ Empty dashboard
- Wait 30 seconds for data refresh
- Check browser console for errors
- Verify backend is seeded: `npm run db:seed`

---

## 🚀 Production Deployment

### Local Deployment (Recommended)
```bash
npm run build
npm run start
```

### Using PM2 (Process Manager)
```bash
npm install -g pm2

# Start services
pm2 start backend/server.js --name "erp-api"
pm2 start "npm start" --name "erp-frontend"
pm2 status
```

### Environment Variables
Update `backend/.env` for production:
```env
NODE_ENV=production
DB_HOST=<your-postgres-host>
DB_PASSWORD=<strong-password>
```

---

## 📝 Sample Data

Automatically generated on `npm run db:seed`:
- ✅ 20 Orders (last 7 days)
- ✅ 5 Products
- ✅ Inventory across warehouses
- ✅ 30 Finance transactions

---

## 🔐 Security Notes

⚠️ **Development Only**: 
- Default postgres password: `postgres`
- No authentication on APIs
- CORS enabled for all origins

🔒 **For Production**:
- Change DB password in `docker-compose.yml`
- Implement API authentication (JWT)
- Enable HTTPS/TLS
- Restrict CORS origins
- Add rate limiting

---

## 📞 Support

For issues or feature requests, check:
1. Error logs: `backend/server.js`
2. Browser console: Press `F12`
3. Database: `psql -U postgres -d erp_dashboard`

---

## 📄 License

MIT - Use freely for personal & commercial projects

---

**Built with ❤️ for simplicity and speed**
