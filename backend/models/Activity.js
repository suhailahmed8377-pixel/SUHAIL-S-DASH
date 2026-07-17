const pool = require('../config/database');

class Activity {
  static async log(action) {
    try {
      await pool.query('INSERT INTO activity_log (action) VALUES ($1)', [action]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  static async getRecent(limit = 50) {
    const result = await pool.query('SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT $1', [limit]);
    return result.rows;
  }
}

module.exports = Activity;
