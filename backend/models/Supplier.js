const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Supplier {
  static async getAll() {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByPhone(phone) {
    const result = await pool.query('SELECT * FROM suppliers WHERE phone = $1', [phone]);
    return result.rows[0];
  }

  static async create(name, phone, payable = 0) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO suppliers (id, name, phone, payable) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, phone, payable]
    );
    return result.rows[0];
  }

  static async update(id, name, phone, payable) {
    const result = await pool.query(
      'UPDATE suppliers SET name = $1, phone = $2, payable = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, phone, payable, id]
    );
    return result.rows[0];
  }

  static async updatePayable(id, amount) {
    const result = await pool.query(
      'UPDATE suppliers SET payable = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [amount, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
  }

  static async getTotalPayable() {
    const result = await pool.query('SELECT COALESCE(SUM(payable), 0) as total FROM suppliers');
    return result.rows[0].total;
  }
}

module.exports = Supplier;
