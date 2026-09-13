require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { db, seedIfEmpty, serializeProduct } = require('./server/db.cjs');
const { signToken, authRequired, sellerRequired, validateBuyerRegister, validateSellerRegister, validateProduct } = require('./server/auth.cjs');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: [/localhost:\d+$/, /127\.0\.0\.1:\d+$/], credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ---------- Buyer auth ----------
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body || {};
  const err = validateBuyerRegister({ name, email, password });
  if (err) return res.status(400).json({ error: err });

  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(String(name).trim(), normalizedEmail, hash);
  const user = { id: info.lastInsertRowid, name: String(name).trim(), email: normalizedEmail };
  const token = signToken({ sub: user.id, role: 'buyer', email: user.email });
  res.status(201).json({ message: 'User registered successfully', user, token });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const normalizedEmail = String(email).trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!row || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const user = { id: row.id, name: row.name, email: row.email };
  const token = signToken({ sub: user.id, role: 'buyer', email: user.email });
  res.json({ message: 'Login successful', user, token });
});

app.get('/api/me', authRequired, (req, res) => {
  if (req.auth.role !== 'buyer') return res.status(403).json({ error: 'Buyer token required' });
  const row = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.auth.sub);
  if (!row) return res.status(404).json({ error: 'User not found' });
  res.json({ user: row });
});

// ---------- Seller auth (separate accounts) ----------
app.post('/api/seller/register', (req, res) => {
  const { shop_name, shopName, email, password } = req.body || {};
  const name = shop_name || shopName;
  const err = validateSellerRegister({ shop_name: name, email, password });
  if (err) return res.status(400).json({ error: err });

  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = db.prepare('SELECT id FROM sellers WHERE email = ?').get(normalizedEmail);
  if (exists) return res.status(400).json({ error: 'Seller already exists' });

  const hash = bcrypt.hashSync(String(password), 10);
  const info = db.prepare('INSERT INTO sellers (shop_name, email, password_hash) VALUES (?, ?, ?)')
    .run(String(name).trim(), normalizedEmail, hash);
  const seller = { id: info.lastInsertRowid, shop_name: String(name).trim(), email: normalizedEmail };
  const token = signToken({ sub: seller.id, role: 'seller', email: seller.email });
  res.status(201).json({ message: 'Seller registered successfully', seller, token });
});

app.post('/api/seller/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const normalizedEmail = String(email).trim().toLowerCase();
  const row = db.prepare('SELECT * FROM sellers WHERE email = ?').get(normalizedEmail);
  if (!row || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const seller = { id: row.id, shop_name: row.shop_name, email: row.email };
  const token = signToken({ sub: seller.id, role: 'seller', email: seller.email });
  res.json({ message: 'Login successful', seller, token });
});

app.get('/api/seller/me', sellerRequired, (req, res) => {
  const row = db.prepare('SELECT id, shop_name, email FROM sellers WHERE id = ?').get(req.auth.sub);
  if (!row) return res.status(404).json({ error: 'Seller not found' });
  res.json({ seller: row });
});

// ---------- Public products ----------
app.get('/api/products', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, s.shop_name as shop_name FROM products p
    LEFT JOIN sellers s ON s.id = p.seller_id
    ORDER BY p.id ASC
  `).all();
  res.json({ products: rows.map(serializeProduct) });
});

app.get('/api/products/:id', (req, res) => {
  const row = db.prepare(`
    SELECT p.*, s.shop_name as shop_name FROM products p
    LEFT JOIN sellers s ON s.id = p.seller_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: serializeProduct(row) });
});

app.get('/api/sellers/:id/products', (req, res) => {
  const seller = db.prepare('SELECT id, shop_name, email FROM sellers WHERE id = ?').get(req.params.id);
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  const rows = db.prepare('SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC').all(seller.id);
  res.json({ seller, products: rows.map(serializeProduct) });
});

// ---------- Seller product CRUD (owner only, products only — no orders in v1) ----------
app.get('/api/seller/products', sellerRequired, (req, res) => {
  const rows = db.prepare('SELECT * FROM products WHERE seller_id = ? ORDER BY id DESC').all(req.auth.sub);
  res.json({ products: rows.map(serializeProduct) });
});

app.post('/api/seller/products', sellerRequired, (req, res) => {
  const err = validateProduct(req.body || {});
  if (err) return res.status(400).json({ error: err });
  const { name, category = 'electronics', price, originalPrice = null, rating = 0, reviews = 0, badge = null, image = null, description = null, tags = [], inStock = true } = req.body;
  const info = db.prepare(`
    INSERT INTO products (seller_id, name, category, price, originalPrice, rating, reviews, badge, image, description, tags, inStock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.auth.sub, String(name).trim(), category, Number(price),
    originalPrice != null ? Number(originalPrice) : null,
    Number(rating) || 0, Number(reviews) || 0, badge || null, image || null,
    description || null, JSON.stringify(tags || []), inStock ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ message: 'Product created', product: serializeProduct(row) });
});

app.put('/api/seller/products/:id', sellerRequired, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  if (existing.seller_id !== req.auth.sub) return res.status(403).json({ error: 'Not your product' });
  const err = validateProduct(req.body || {}, true);
  if (err) return res.status(400).json({ error: err });

  const merged = {
    name: req.body.name !== undefined ? String(req.body.name).trim() : existing.name,
    category: req.body.category !== undefined ? req.body.category : existing.category,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? (req.body.originalPrice == null ? null : Number(req.body.originalPrice)) : existing.originalPrice,
    rating: req.body.rating !== undefined ? Number(req.body.rating) : existing.rating,
    reviews: req.body.reviews !== undefined ? Number(req.body.reviews) : existing.reviews,
    badge: req.body.badge !== undefined ? (req.body.badge || null) : existing.badge,
    image: req.body.image !== undefined ? (req.body.image || null) : existing.image,
    description: req.body.description !== undefined ? (req.body.description || null) : existing.description,
    tags: req.body.tags !== undefined ? JSON.stringify(req.body.tags) : existing.tags,
    inStock: req.body.inStock !== undefined ? (req.body.inStock ? 1 : 0) : existing.inStock,
  };
  db.prepare(`
    UPDATE products SET name=?, category=?, price=?, originalPrice=?, rating=?, reviews=?, badge=?, image=?, description=?, tags=?, inStock=? WHERE id=?
  `).run(merged.name, merged.category, merged.price, merged.originalPrice, merged.rating, merged.reviews, merged.badge, merged.image, merged.description, merged.tags, merged.inStock, req.params.id);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ message: 'Product updated', product: serializeProduct(row) });
});

app.patch('/api/seller/products/:id/stock', sellerRequired, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  if (existing.seller_id !== req.auth.sub) return res.status(403).json({ error: 'Not your product' });
  const inStock = req.body.inStock ? 1 : 0;
  db.prepare('UPDATE products SET inStock = ? WHERE id = ?').run(inStock, req.params.id);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ product: serializeProduct(row) });
});

app.delete('/api/seller/products/:id', sellerRequired, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  if (existing.seller_id !== req.auth.sub) return res.status(403).json({ error: 'Not your product' });
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Product deleted' });
});

// Serve frontend build if present (optional)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.listen(PORT, () => {
  const seed = seedIfEmpty();
  console.log(`[atelier] API listening on http://localhost:${PORT}`);
  console.log(`[atelier] DB: ${process.env.DB_PATH || 'server/data/app.db'} (seeded=${seed.seeded} products=${seed.count})`);
});
