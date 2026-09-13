const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function sellerRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.auth.role !== 'seller') {
      return res.status(403).json({ error: 'Seller access required' });
    }
    next();
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateBuyerRegister({ name, email, password }) {
  if (!name || !email || !password) return 'Missing name, email, or password';
  if (String(name).trim().length < 2) return 'Name must be at least 2 characters';
  if (!EMAIL_RE.test(String(email))) return 'Invalid email address';
  if (String(password).length < 6) return 'Password must be at least 6 characters';
  return null;
}

function validateSellerRegister({ shop_name, email, password }) {
  if (!shop_name || !email || !password) return 'Missing shop_name, email, or password';
  if (String(shop_name).trim().length < 2) return 'Shop name must be at least 2 characters';
  if (!EMAIL_RE.test(String(email))) return 'Invalid email address';
  if (String(password).length < 6) return 'Password must be at least 6 characters';
  return null;
}

const ALLOWED_CATEGORIES = new Set(['electronics', 'clothing', 'footwear', 'accessories', 'home']);

function validateProduct(body, partial = false) {
  const { name, category, price, originalPrice, image, description, badge, inStock, tags } = body;
  if (!partial) {
    if (!name || price === undefined || price === null) return 'Missing product name or price';
  }
  if (name !== undefined && String(name).trim().length < 2) return 'Product name too short';
  if (category !== undefined && !ALLOWED_CATEGORIES.has(category)) return 'Invalid category';
  if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) <= 0)) return 'Price must be a positive number';
  if (originalPrice !== undefined && originalPrice !== null && (!Number.isFinite(Number(originalPrice)) || Number(originalPrice) <= 0)) return 'originalPrice must be positive';
  if (image !== undefined && image !== null && image !== '' && !/^https?:\/\/.+/i.test(String(image))) return 'Image must be a valid http(s) URL';
  if (badge !== undefined && badge !== null && String(badge).length > 40) return 'Badge too long';
  if (description !== undefined && description !== null && String(description).length > 2000) return 'Description too long';
  if (tags !== undefined && !Array.isArray(tags)) return 'Tags must be an array';
  if (inStock !== undefined && typeof inStock !== 'boolean' && typeof inStock !== 'number') return 'inStock must be boolean';
  return null;
}

module.exports = { signToken, authRequired, sellerRequired, validateBuyerRegister, validateSellerRegister, validateProduct, ALLOWED_CATEGORIES };
