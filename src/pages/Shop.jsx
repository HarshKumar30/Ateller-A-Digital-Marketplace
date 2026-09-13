import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { categories, formatPrice, products as fallbackProducts } from '../data/products';
import { fetchProducts } from '../lib/productsApi';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const SORT_OPTIONS = [
  { val: 'featured', label: 'Curated' },
  { val: 'price-asc', label: 'Price: Low-High' },
  { val: 'price-desc', label: 'Price: High-Low' },
  { val: 'rating', label: 'Top Rated' },
];

export default function Shop({ searchQuery: searchQueryProp }) {
  const outlet = useOutletContext();
  const searchQuery = searchQueryProp ?? outlet?.searchQuery ?? '';
  const [searchParams] = useSearchParams();
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(120000);
  const [allProducts, setAllProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  useEffect(() => {
    let alive = true;
    fetchProducts().then((rows) => {
      if (!alive) return;
      setAllProducts(rows.length > 0 ? rows : fallbackProducts);
      const max = Math.max(...rows.map((p) => Number(p.price) || 0), 120000);
      setMaxPrice((prev) => (prev === 120000 ? max : prev));
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const filtered = allProducts
    .filter(p => selectedCat === 'all' || p.category === selectedCat)
    .filter(p => p.price <= maxPrice)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="shop-luxe page-enter">
      <div className="container">
        {/* Editorial Header */}
        <header className="shop-header-luxe vast-space">
          <div className="header-text">
            <span className="label-md">Collection</span>
            <h1 className="display-lg">The Shop</h1>
            {loading && <p className="body-md opacity-60">Loading live collection…</p>}
          </div>
          <div className="header-actions">
            <select className="sort-select-luxe label-md" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
          </div>
        </header>

        <div className="shop-layout-luxe">
          {/* Minimalist Sidebar */}
          <aside className="shop-sidebar-luxe">
            <div className="filter-group-luxe">
              <h4 className="label-md">Categories</h4>
              <ul className="cat-list">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`cat-btn ${selectedCat === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat.id)}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group-luxe">
              <h4 className="label-md">Price Range</h4>
              <div className="price-filter-luxe">
                <input
                  type="range" min="999" max="120000" step="1000"
                  value={Math.min(maxPrice, 120000)} onChange={e => setMaxPrice(Number(e.target.value))}
                  className="range-input-luxe"
                />
                <div className="price-labels label-md">
                  <span>₹999</span>
                  <span>{formatPrice(maxPrice)}</span>
                </div>
              </div>
            </div>

            <button className="btn-tertiary reset-btn" onClick={() => { setSelectedCat('all'); setMaxPrice(120000); }}>Reset Filters</button>
          </aside>

          {/* Product Grid */}
          <main className="shop-main-luxe">
            {filtered.length === 0 ? (
              <div className="empty-shop">
                <h2 className="display-sm">No artifacts found.</h2>
                <button className="btn-tertiary" onClick={() => { setSelectedCat('all'); setMaxPrice(120000); }}>View All</button>
              </div>
            ) : (
              <div className="shop-grid-luxe">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
