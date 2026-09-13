# Atelier Build Progress

## Done
- [x] Buyer/seller UI separation (one role at a time, route-derived)
- [x] SQLite DB (`server/data/app.db`, gitignored) with `users`, `sellers`, `products`
- [x] Express `server.cjs` on :5000 — buyer JWT auth, seller JWT auth (separate accounts), public + seller product APIs
- [x] Seeded 13 legacy products from `src/data/products.js`
- [x] Removed `vite.config.js` excel/xlsx plugin → `/api` proxy to :5000
- [x] Buyer `AuthContext` → JWT + `/me` rehydrate + loading states
- [x] Seller `SellerContext` + `/sell`, `/seller/register`, `/seller/login`, `/seller/dashboard` (CRUD + stock), `/seller/:id` storefront
- [x] Shop/Home/ProductDetail fetch live `/api/products` with static fallback
- [x] Removed `users.xlsx` (plaintext) + `debug.txt`, uninstalled `xlsx`
- [x] Verified: health, buyer register/login/me, 13 products, seller register→create→list→update→delete, invalid-token 401, `npm run build` passes

## Run
- Backend: `npm run server` (or `npm run dev:all` for backend + frontend)
- Frontend: `npm run dev` (needs backend for live data; falls back to static otherwise)
- Env: copy `.env.example` → `.env`, set `JWT_SECRET`

## Next (optional)
- [ ] Seller product images upload (multer/S3) — currently URL-only
- [ ] Orders table + seller order view (deferred v1)
- [ ] Forgot-password / OAuth
- [ ] Cleanup `src/App.css` dead Vite template + Footer dead links
