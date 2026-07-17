const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Customer {
  static async getAll() {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByPhone(phone) {
    const result = await pool.query('SELECT * FROM customers WHERE phone = $1', [phone]);
    return result.rows[0];
  }

  static async create(name, phone, outstanding = 0) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO customers (id, name, phone, outstanding) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, phone, outstanding]
    );
    return result.rows[0];
  }

  static async update(id, name, phone, outstanding) {
    const result = await pool.query(
      'UPDATE customers SET name = $1, phone = $2, outstanding = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, phone, outstanding, id]
    );
    return result.rows[0];
  }

  static async updateOutstanding(id, amount) {
    const result = await pool.query(
      'UPDATE customers SET outstanding = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [amount, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
  }

  static async getTotalOutstanding() {
    const result = await pool.query('SELECT COALESCE(SUM(outstanding), 0) as total FROM customers');
    return result.rows[0].total;
  }
}

module.exports = Customer;
