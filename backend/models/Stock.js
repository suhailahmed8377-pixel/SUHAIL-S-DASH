const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Stock {
  static async getAllFabrics() {
    const result = await pool.query('SELECT * FROM stock_fabrics ORDER BY created_at DESC');
    const fabrics = result.rows;
    
    for (let fabric of fabrics) {
      const lumpsResult = await pool.query('SELECT * FROM stock_lumps WHERE fabric_id = $1', [fabric.id]);
      fabric.lumps = lumpsResult.rows;
    }
    return fabrics;
  }

  static async getFabricById(id) {
    const result = await pool.query('SELECT * FROM stock_fabrics WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    
    const fabric = result.rows[0];
    const lumpsResult = await pool.query('SELECT * FROM stock_lumps WHERE fabric_id = $1', [id]);
    fabric.lumps = lumpsResult.rows;
    return fabric;
  }

  static async createFabric(name, rate) {
    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO stock_fabrics (id, name, rate, total_meters) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, name, rate, 0]
    );
    return result.rows[0];
  }

  static async addLump(fabricId, lumpId, meters) {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO stock_lumps (id, fabric_id, lump_id, meters) VALUES ($1, $2, $3, $4)',
      [id, fabricId, lumpId, meters]
    );
    
    // Update total_meters
    await pool.query(
      'UPDATE stock_fabrics SET total_meters = total_meters + $1 WHERE id = $2',
      [meters, fabricId]
    );
  }

  static async consumeLumps(fabricId, lumpsUsed) {
    for (let lump of lumpsUsed) {
      await pool.query(
        'UPDATE stock_lumps SET meters = meters - $1 WHERE id = $2',
        [lump.meters_used, lump.lump_id]
      );
    }
    
    // Update fabric total
    const totalUsed = lumpsUsed.reduce((sum, l) => sum + l.meters_used, 0);
    await pool.query(
      'UPDATE stock_fabrics SET total_meters = total_meters - $1 WHERE id = $2',
      [totalUsed, fabricId]
    );
  }

  static async getLowStockLumps(threshold = 20) {
    const result = await pool.query(
      'SELECT sf.name, sl.lump_id, sl.meters FROM stock_lumps sl JOIN stock_fabrics sf ON sl.fabric_id = sf.id WHERE sl.meters < $1',
      [threshold]
    );
    return result.rows;
  }
}

module.exports = Stock;
