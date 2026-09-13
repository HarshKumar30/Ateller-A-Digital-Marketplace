require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sellers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER REFERENCES sellers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'electronics',
  price INTEGER NOT NULL,
  originalPrice INTEGER,
  rating REAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  badge TEXT,
  image TEXT,
  description TEXT,
  tags TEXT DEFAULT '[]',
  inStock INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

const SEED_PRODUCTS = [
  { category: 'electronics', name: 'Sony WH-1000XM5 Headphones', price: 29999, originalPrice: 34999, rating: 4.8, reviews: 2341, badge: 'Best Seller', image: 'https://m.media-amazon.com/images/I/61BGLYEN-xL._SL1500_.jpg', description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life.', tags: ['wireless', 'noise-cancelling', 'premium'], inStock: 1 },
  { category: 'electronics', name: 'Apple MacBook Air M2', price: 114900, originalPrice: 119900, rating: 4.9, reviews: 1876, badge: 'New', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', description: 'Supercharged by M2 chip. Fanless design, 18-hour battery, stunning Liquid Retina display.', tags: ['laptop', 'apple', 'premium'], inStock: 1 },
  { category: 'electronics', name: 'Samsung Galaxy S24 Ultra', price: 89999, originalPrice: 99999, rating: 4.7, reviews: 3210, badge: 'Hot Deal', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', description: 'Titanium frame, 200MP camera, built-in S Pen. The ultimate Android experience.', tags: ['smartphone', 'samsung', '5G'], inStock: 1 },
  { category: 'clothing', name: 'Premium Linen Shirt', price: 2499, originalPrice: 3999, rating: 4.5, reviews: 892, badge: '38% Off', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', description: 'Breathable pure linen fabric. Perfect for summer days and casual outings.', tags: ['shirt', 'linen', 'casual'], inStock: 1 },
  { category: 'clothing', name: 'Slim Fit Chinos', price: 1899, originalPrice: 2999, rating: 4.4, reviews: 567, badge: null, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80', description: 'Classic slim fit chinos that pair well with any outfit. Wrinkle-resistant fabric.', tags: ['pants', 'chinos', 'formal'], inStock: 1 },
  { category: 'footwear', name: 'Nike Air Max 270', price: 12995, originalPrice: 14995, rating: 4.6, reviews: 4521, badge: 'Trending', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', description: 'Max cushioning meets bold style. The largest Air unit in Nike history.', tags: ['sneakers', 'nike', 'sport'], inStock: 1 },
  { category: 'footwear', name: 'Adidas Ultraboost 23', price: 15999, originalPrice: 17999, rating: 4.7, reviews: 2109, badge: null, image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80', description: 'Energy-returning Boost midsole with Primeknit upper. Born to run.', tags: ['running', 'adidas', 'sport'], inStock: 0 },
  { category: 'accessories', name: 'Fossil Gen 6 Smartwatch', price: 24995, originalPrice: 29995, rating: 4.3, reviews: 743, badge: 'Sale', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', description: 'Wear OS smartwatch with health tracking, SpO2 monitoring, and 3-day battery.', tags: ['smartwatch', 'fossil', 'wearable'], inStock: 1 },
  { category: 'accessories', name: 'Tan Leather Wallet', price: 1299, originalPrice: 1999, rating: 4.5, reviews: 1230, badge: null, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80', description: 'Full-grain genuine leather bifold wallet. RFID blocking with 8 card slots.', tags: ['wallet', 'leather', 'minimalist'], inStock: 1 },
  { category: 'home', name: 'Dyson V15 Detect', price: 54900, originalPrice: 59900, rating: 4.8, reviews: 987, badge: 'New', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', description: 'Laser dust detection, HEPA filtration, LCD screen displaying live data.', tags: ['vacuum', 'dyson', 'home appliance'], inStock: 1 },
  { category: 'home', name: 'Spinn Pro', price: 11999, originalPrice: 14999, rating: 4.6, reviews: 2043, badge: 'Best Seller', image: 'https://cdn.swell.store/spinn-marketplace/66c73eaf83f7820012f72906/7a023345cd31528ff82092fb01b24d75/1.jpg?width=1240', description: 'One-touch coffee & espresso maker with 5 cup sizes. WiFi connected.', tags: ['coffee', 'kitchen', 'appliance'], inStock: 1 },
  { category: 'electronics', name: 'iPad Pro 12.9" M2', price: 99900, originalPrice: 109900, rating: 4.9, reviews: 1456, badge: null, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', description: 'Powerful M2 chip, Liquid Retina XDR display, Thunderbolt port, ProMotion.', tags: ['tablet', 'apple', 'premium'], inStock: 1 },
  { category: 'electronics', name: 'Aula F75', price: 4999, originalPrice: 5999, rating: 4.9, reviews: 1456, badge: 'New Arrival', image: 'https://m.media-amazon.com/images/I/61RWSNffoWL._SX522_.jpg', description: 'Aula F75 75% Wireless Mechanical Keyboard | Hot Swappable | RGB Backlit.', tags: ['wireless', 'aula', 'premium'], inStock: 1 },
];

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (count > 0) return { seeded: false, count };
  const insert = db.prepare(`
    INSERT INTO products (seller_id, name, category, price, originalPrice, rating, reviews, badge, image, description, tags, inStock)
    VALUES (NULL, @name, @category, @price, @originalPrice, @rating, @reviews, @badge, @image, @description, @tags, @inStock)
  `);
  const tx = db.transaction((rows) => {
    for (const r of rows) {
      insert.run({ ...r, tags: JSON.stringify(r.tags || []) });
    }
  });
  tx(SEED_PRODUCTS);
  return { seeded: true, count: SEED_PRODUCTS.length };
}

function serializeProduct(row) {
  if (!row) return row;
  let tags = [];
  try { tags = JSON.parse(row.tags || '[]'); } catch { tags = []; }
  return {
    ...row,
    tags,
    inStock: !!row.inStock,
    seller_id: row.seller_id ?? null,
  };
}

module.exports = { db, seedIfEmpty, serializeProduct };
