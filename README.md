# Ateller — A Digital Marketplace

A luxury editorial-style marketplace SPA. Buyers browse a curated collection, sellers run shops with their own dashboard. Light/dark themed, JWT-secured, SQLite-backed.

## Features

**Buyer**
- Editorial home (`/`), filterable/sortable/searchable shop (`/shop`), product detail (`/product/:id`) with related items
- Cart + wishlist (local state), protected checkout (`/checkout`) with delivery/payment/review steps
- Buyer auth (`/login`, `/register`, `/profile`) — bcrypt-hashed passwords, JWT sessions, token re-validated on load
- Public seller storefronts (`/seller/:id`), seller discovery via `/sell`
- Light/dark toggle (persisted, follows OS default), fully themed buttons/inputs/toasts/footer

**Seller (separate accounts, one role at a time)**
- Own auth + chrome: `/seller/register`, `/seller/login` → seller navbar/footer (no cart/wishlist/search)
- Dashboard tabs: `/seller/dashboard` (overview stats), `/seller/dashboard/products` (CRUD + stock toggle), `/seller/dashboard/orders` (v2 placeholder — products-only v1)
- Products go live instantly in buyer Shop + storefront; ownership enforced API-side

**Backend**
- Express (`server.cjs`, port 5000) + SQLite (`server/data/app.db`, gitignored) via `better-sqlite3`
- Tables: `users`, `sellers`, `products` (seeded with 13 legacy products on first boot)
- Buyer: `POST /api/register`, `POST /api/login`, `GET /api/me`
- Seller: `POST /api/seller/register`, `POST /api/seller/login`, `GET /api/seller/me`
- Products (public): `GET /api/products`, `GET /api/products/:id`, `GET /api/sellers/:id/products`
- Products (seller-owner): `GET/POST /api/seller/products`, `PUT/DELETE /api/seller/products/:id`, `PATCH /api/seller/products/:id/stock`

## Tech stack

React 19 · Vite 8 · React Router 7 · `axios` · `lucide-react` · `react-hot-toast` · Express 5 · `better-sqlite3` · `bcryptjs` · `jsonwebtoken` · `dotenv` · `cors`

## Getting started

**Prerequisites:** Node 22+, npm 10+

```bash
npm install
cp .env.example .env   # then set JWT_SECRET (32+ random chars)
```

| Command | What it does |
|---|---|
| `npm run dev:all` | Backend (`:5000`) + frontend (`:5173`) together — **use this** |
| `npm run server` | API only (`node server.cjs`) |
| `npm run dev` | Frontend only (live data if backend up, else static fallback) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |

**Env (`.env`):**
```
PORT=5000
JWT_SECRET=<long-random-string>
JWT_EXPIRES_IN=7d
DB_PATH=./server/data/app.db
VITE_API_URL=http://localhost:5000/api
```

Vite proxies `/api` → `http://localhost:5000` in dev, so relative API calls work with or without `VITE_API_URL`.

## Roles & routes

Role is route-derived (`src/lib/role.js`): `/seller/dashboard*`, `/seller/login`, `/seller/register` render seller chrome; everything else renders buyer chrome.

- Buyer layout: `src/layouts/BuyerLayout.jsx` (buyer `Navbar` + `Footer`)
- Seller layout: `src/layouts/SellerLayout.jsx` (`SellerNavbar` + `SellerFooter`, no commerce chrome)
- Guards: `ProtectedRoute` (buyer) and `ProtectedSellerRoute` in `src/App.jsx`

## Project structure

```
server.cjs               Express API entry
server/db.cjs            SQLite init + schema + seed
server/auth.cjs          JWT, guards, validation
src/
  App.jsx                Nested buyer/seller routes
  layouts/               BuyerLayout, SellerLayout
  lib/                   productsApi.js (live + static fallback), role.js
  context/               AuthContext (buyer JWT), SellerContext, Cart, Wishlist, Theme
  components/            Navbar, SellerNavbar, Footer, SellerFooter, ProductCard
  pages/                 Home, Shop, ProductDetail, Cart, Checkout, Login,
                         Register, Profile, Wishlist, Sell, Seller* 
  data/products.js       Categories + static fallback catalog + formatPrice (INR)
```

## Notes

- Passwords are hashed (`bcryptjs`, cost 10); tokens are Bearer JWTs (`atelier_token` / `atelier_seller_token` in localStorage).
- `server/data/`, `*.db`, `.env` are gitignored — each clone starts fresh and re-seeds.
- `npm run lint` currently has no config (`eslint.config.js` missing, pre-existing) — build is the source of truth.
- Product images v1 are URL-only; uploads, orders, password-reset/OAuth are deferred.
