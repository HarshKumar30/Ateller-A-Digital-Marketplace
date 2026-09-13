import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products as fallbackProducts } from '../data/products';
import { fetchProducts } from '../lib/productsApi';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [list, setList] = useState(fallbackProducts);

  useEffect(() => {
    let alive = true;
    fetchProducts().then((rows) => {
      if (alive && rows.length > 0) setList(rows);
    });
    return () => { alive = false; };
  }, []);

  const FEATURED = list.filter(p => p.badge && p.inStock).slice(0, 3);
  const TRENDING = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  return (
    <div className="home-luxe page-enter">
      {/* 1. Hero: Editorial Impact */}
      <section className="hero-editorial vast-space">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="label-md hero-pretitle">The Digital Atelier</span>
              <h1 className="display-lg hero-title">
                Curating <br />
                <span className="italic">Spatial</span> Luxury.
              </h1>
              <p className="body-md hero-description">
                Elevate your everyday with objects of intentional design. <br />
                A collection where precision meets poetry.
              </p>
              <div className="hero-actions">
                <Link to="/shop" className="btn btn-primary">Discover Collection</Link>
                <Link to="/sell" className="btn-tertiary">Become a Seller</Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-overlay product-image-bg">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80"
                  alt="Minimalist Watch"
                  className="hero-main-img"
                />
                <div className="editorial-caption">
                  <span className="label-md">VOL. 01</span>
                  <h3>THE MINIMALIST SERIES</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Asymmetric Featured Grid */}
      <section className="featured-section vast-space">
        <div className="container">
          <div className="section-header-luxe">
            <h2 className="display-md">Featured Products</h2>
            <Link to="/shop" className="btn-tertiary">View All</Link>
          </div>

          <div className="asymmetric-grid">
            <div className="grid-col-large">
              {FEATURED[0] && <ProductCard product={FEATURED[0]} />}
            </div>
            <div className="grid-col-small-stack">
              {FEATURED.slice(1, 3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tonal Quote Section */}
      <section className="quote-section">
        <div className="container flex-center">
          <div className="quote-content">
            <span className="label-md quote-label">Our Philosophy</span>
            <blockquote className="display-sm">
              "Luxury is not about density; it's about the space between the notes."
            </blockquote>
          </div>
        </div>
      </section>

      {/* 4. Trending - Minimalist Row */}
      <section className="trending-section vast-space">
        <div className="container">
          <div className="section-header-luxe">
            <h2 className="display-md">The Season's Best</h2>
          </div>
          <div className="trending-row">
            {TRENDING.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist CTA Banner */}
      <section className="cta-banner-luxe">
        <div className="container">
          <div className="cta-inner-glass glass">
            <h2 className="display-sm">Join the Atelier</h2>
            <p className="body-md">Subscribe for early access to our curated drops.</p>
            <div className="cta-input-group">
              <input type="email" placeholder="Email Address" className="input-minimal" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
