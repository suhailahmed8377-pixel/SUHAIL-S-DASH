const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Invoice {
  static async getAll() {
    const result = await pool.query(
      'SELECT i.*, c.name as customer_name, sf.name as fabric_name FROM invoices i JOIN customers c ON i.customer_id = c.id JOIN stock_fabrics sf ON i.fabric_id = sf.id ORDER BY i.created_at DESC'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT i.*, c.name as customer_name, sf.name as fabric_name FROM invoices i JOIN customers c ON i.customer_id = c.id JOIN stock_fabrics sf ON i.fabric_id = sf.id WHERE i.id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    
    const invoice = result.rows[0];
    const lumpsResult = await pool.query(
      'SELECT il.*, sl.lump_id FROM invoice_lumps il JOIN stock_lumps sl ON il.lump_id = sl.id WHERE il.invoice_id = $1',
      [id]
    );
    invoice.lumps_used = lumpsResult.rows;
    return invoice;
  }

  static async create(customerId, fabricId, quantity, rate, source = 'whatsapp', lumpsUsed = []) {
    const id = uuidv4();
    const invoiceNumber = `INV-${Date.now()}`;
    const totalAmount = quantity * rate;
    const date = new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      'INSERT INTO invoices (id, invoice_number, customer_id, fabric_id, quantity, rate, total_amount, source, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [id, invoiceNumber, customerId, fabricId, quantity, rate, totalAmount, source, date]
    );
    
    // Insert lumps used
    for (let lump of lumpsUsed) {
      const lumpId = uuidv4();
      await pool.query(
        'INSERT INTO invoice_lumps (id, invoice_id, lump_id, meters_used) VALUES ($1, $2, $3, $4)',
        [lumpId, id, lump.lump_id, lump.meters_used]
      );
    }
    
    return result.rows[0];
  }

  static async getByDateRange(startDate, endDate) {
    const result = await pool.query(
      'SELECT i.*, c.name as customer_name FROM invoices i JOIN customers c ON i.customer_id = c.id WHERE i.date BETWEEN $1 AND $2 ORDER BY i.date DESC',
      [startDate, endDate]
    );
    return result.rows;
  }

  static async getTodayTotal() {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(
      'SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total FROM invoices WHERE date = $1',
      [today]
    );
    return result.rows[0];
  }
}

module.exports = Invoice;
