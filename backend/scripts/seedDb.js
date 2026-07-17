import db from '../db.js';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Sample products
    const products = [
      { name: 'Laptop', sku: 'LP-001', price: 999.99 },
      { name: 'Monitor', sku: 'MN-001', price: 299.99 },
      { name: 'Keyboard', sku: 'KB-001', price: 79.99 },
      { name: 'Mouse', sku: 'MS-001', price: 29.99 },
      { name: 'Desk Chair', sku: 'CH-001', price: 199.99 },
    ];

    for (const product of products) {
      await db.query(
        'INSERT INTO products (name, sku, price) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [product.name, product.sku, product.price]
      );
    }

    // Sample inventory
    const inventoryData = [
      { product_id: 1, quantity: 45, warehouse_location: 'A1' },
      { product_id: 2, quantity: 120, warehouse_location: 'B2' },
      { product_id: 3, quantity: 300, warehouse_location: 'C1' },
      { product_id: 4, quantity: 500, warehouse_location: 'D1' },
      { product_id: 5, quantity: 80, warehouse_location: 'A3' },
    ];

    for (const item of inventoryData) {
      await db.query(
        'INSERT INTO inventory (product_id, quantity, warehouse_location) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [item.product_id, item.quantity, item.warehouse_location]
      );
    }

    // Sample orders (last 7 days)
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];
    const customers = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'];

    for (let i = 0; i < 20; i++) {
      const amount = Math.floor(Math.random() * 5000) + 500;
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const daysAgo = Math.floor(Math.random() * 7);

      const result = await db.query(
        `INSERT INTO orders (order_number, customer_name, total_amount, status, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${daysAgo} days')
         RETURNING id`,
        [`ORD-${Date.now()}-${i}`, customer, amount, status]
      );

      // Add order items
      const orderId = result.rows[0].id;
      const itemCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < itemCount; j++) {
        const productId = Math.floor(Math.random() * 5) + 1;
        const qty = Math.floor(Math.random() * 5) + 1;
        const price = (amount / itemCount).toFixed(2);

        await db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
          [orderId, productId, qty, price]
        );
      }
    }

    // Sample finance data
    const financeTypes = ['revenue', 'expense', 'investment', 'loan'];
    const categories = ['sales', 'supplies', 'salaries', 'utilities', 'rent', 'marketing'];

    for (let i = 0; i < 30; i++) {
      const type = financeTypes[Math.floor(Math.random() * financeTypes.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const amount = Math.floor(Math.random() * 10000) + 100;
      const daysAgo = Math.floor(Math.random() * 7);

      await db.query(
        `INSERT INTO finance (type, amount, description, category, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${daysAgo} days')`,
        [type, amount, `${type}: ${category}`, category]
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
