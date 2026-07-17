# Evomoda Dashboard Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database

Create a PostgreSQL database and user:
```sql
CREATE DATABASE evomoda_db;
CREATE USER evomoda_user WITH PASSWORD 'your_secure_password';
ALTER ROLE evomoda_user SET client_encoding TO 'utf8';
ALTER ROLE evomoda_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE evomoda_user SET default_transaction_deferrable TO on;
ALTER ROLE evomoda_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE evomoda_db TO evomoda_user;
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 4. Run Database Migrations
```bash
node scripts/migrate.js
```

### 5. Seed Sample Data (Optional)
```bash
node scripts/seed.js
```

### 6. Start Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Stock
- `GET /api/stock/fabrics` - List all fabrics
- `GET /api/stock/fabrics/:id` - Get fabric with lumps
- `POST /api/stock/fabrics` - Create fabric
- `POST /api/stock/lumps` - Add lump
- `GET /api/stock/low-stock` - Get low stock alerts

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/today/summary` - Today's summary

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record payment
- `GET /api/payments/summary` - Payment summary

### Activity Log
- `GET /api/activity` - Get activity log
- `POST /api/activity` - Log activity

### Meesho
- `GET /api/meesho/accounts` - List Meesho accounts
- `GET /api/meesho/summary` - Get combined summary

## Architecture

```
backend/
├── config/         # Database configuration
├── models/         # Data models (Customer, Invoice, etc.)
├── routes/         # API routes
├── schema/         # Database schema
├── scripts/        # Migration and seeding scripts
├── server.js       # Express app entry point
└── .env            # Environment variables
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (ready to implement)
- **Validation:** Express Validator

## Next Steps

1. Update frontend to call these APIs instead of localStorage
2. Add authentication middleware
3. Implement WhatsApp API integration
4. Add automated scheduling for Meesho sync
