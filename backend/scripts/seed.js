const pool = require('../config/database');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Stock = require('../models/Stock');

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Create sample customers
    const customer1 = await Customer.create('Suhail', '919811100001', 0);
    const customer2 = await Customer.create('Sana Fabrics', '919811144455', 11900);
    
    // Create sample supplier
    const supplier1 = await Supplier.create('Balaji Textile Suppliers', '919811188899', 0);
    
    // Create sample fabrics
    const fabric1 = await Stock.createFabric('Stripes', 150);
    const fabric2 = await Stock.createFabric('Georgette Print', 180);
    
    // Add lumps
    await Stock.addLump(fabric1.id, 'L1', 120);
    await Stock.addLump(fabric1.id, 'L2', 95);
    await Stock.addLump(fabric2.id, 'L1', 14);
    
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
