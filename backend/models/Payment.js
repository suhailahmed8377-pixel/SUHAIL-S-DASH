const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Payment {
  static async getAll() {
    const result = await pool.query('SELECT * FROM payments ORDER BY date DESC, created_at DESC');
    return result.rows;
  }

  static async create(date, partyId, partyType, direction, amount, reference = null) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO payments (id, date, party_id, party_type, direction, amount, reference) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, date, partyId, partyType, direction, amount, reference]
    );
    return result.rows[0];
  }

  static async getByDateRange(startDate, endDate) {
    const result = await pool.query(
      'SELECT * FROM payments WHERE date BETWEEN $1 AND $2 ORDER BY date DESC',
      [startDate, endDate]
    );
    return result.rows;
  }

  static async getIncomingTotal() {
    const result = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE direction = $1', ['in']);
    return result.rows[0].total;
  }

  static async getOutgoingTotal() {
    const result = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE direction = $1', ['out']);
    return result.rows[0].total;
  }

  static async getDailySummary(date) {
    const result = await pool.query(
      'SELECT direction, COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM payments WHERE date = $1 GROUP BY direction',
      [date]
    );
    return result.rows;
  }
}

module.exports = Payment;
