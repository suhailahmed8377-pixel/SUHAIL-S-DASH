const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    const schema = fs.readFileSync(path.join(__dirname, '../schema/init.sql'), 'utf-8');
    await pool.query(schema);
    console.log('✅ Database schema created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
