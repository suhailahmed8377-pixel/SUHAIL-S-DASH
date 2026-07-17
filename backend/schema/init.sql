-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  outstanding DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  payable DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_phone ON suppliers(phone);

-- Stock Fabrics
CREATE TABLE IF NOT EXISTS stock_fabrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  rate DECIMAL(10, 2) NOT NULL,
  total_meters DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Lumps
CREATE TABLE IF NOT EXISTS stock_lumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fabric_id UUID NOT NULL,
  lump_id VARCHAR(50) NOT NULL,
  meters DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fabric_id) REFERENCES stock_fabrics(id) ON DELETE CASCADE
);

CREATE INDEX idx_stock_lumps_fabric ON stock_lumps(fabric_id);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  fabric_id UUID NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  source VARCHAR(50) DEFAULT 'whatsapp',
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (fabric_id) REFERENCES stock_fabrics(id)
);

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(date);

-- Invoice Lumps Used
CREATE TABLE IF NOT EXISTS invoice_lumps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL,
  lump_id UUID NOT NULL,
  meters_used DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (lump_id) REFERENCES stock_lumps(id)
);

CREATE INDEX idx_invoice_lumps_invoice ON invoice_lumps(invoice_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  party_id UUID,
  party_type VARCHAR(20) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (party_id) REFERENCES customers(id),
  CHECK (party_type IN ('customer', 'supplier')),
  CHECK (direction IN ('in', 'out', 'payable'))
);

CREATE INDEX idx_payments_date ON payments(date);
CREATE INDEX idx_payments_party ON payments(party_id, party_type);

-- WhatsApp Threads
CREATE TABLE IF NOT EXISTS whatsapp_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID,
  contact_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL,
  direction VARCHAR(10) NOT NULL,
  text TEXT,
  message_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES whatsapp_threads(id) ON DELETE CASCADE
);

CREATE INDEX idx_whatsapp_messages_thread ON whatsapp_messages(thread_id);

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp);

-- Meesho Accounts
CREATE TABLE IF NOT EXISTS meesho_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  orders INT DEFAULT 0,
  dispatched INT DEFAULT 0,
  returns INT DEFAULT 0,
  dispatch_amount DECIMAL(12, 2) DEFAULT 0,
  return_amount DECIMAL(12, 2) DEFAULT 0,
  cost_rate DECIMAL(5, 2) DEFAULT 0.60,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
