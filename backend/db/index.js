const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecommerce',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        category VARCHAR(100),
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 1,
        UNIQUE(user_id, product_id)
      );
    `);

    // Seed products if empty
    const { rows } = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO products (name, description, price, stock, category, image_url) VALUES
        ('Wireless Headphones Pro', 'Premium noise-cancelling wireless headphones with 40hr battery', 129.99, 50, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
        ('Mechanical Keyboard', 'TKL mechanical keyboard with RGB backlighting and tactile switches', 89.99, 30, 'Electronics', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
        ('Running Shoes X1', 'Lightweight performance running shoes with cushioned sole', 74.99, 100, 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
        ('Leather Backpack', 'Genuine leather backpack with laptop compartment, 30L capacity', 149.99, 25, 'Bags', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
        ('Stainless Water Bottle', 'Insulated 32oz water bottle keeps drinks cold 24hrs', 34.99, 200, 'Lifestyle', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'),
        ('Sunglasses Aviator', 'Polarized UV400 aviator sunglasses with metal frame', 59.99, 75, 'Accessories', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
        ('Smart Watch Series 5', 'Fitness tracking smartwatch with heart rate and GPS', 199.99, 40, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
        ('Yoga Mat Premium', 'Non-slip 6mm thick yoga mat with alignment lines', 44.99, 60, 'Sports', 'https://images.unsplash.com/photo-1601925228046-9e1a0d9b26aa?w=400')
      `);
    }

    console.log('✅ Database initialized successfully');
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
