import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Shop.css'; // Reusing shop grid styles

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) return (
    <div className="cart-empty-luxe page-enter vast-space">
      <div className="container flex-center" style={{ flexDirection: 'column' }}>
        <h2 className="display-lg">Your Wishlist is Empty.</h2>
        <p className="body-md" style={{ marginBottom: 40, opacity: 0.6 }}>Save items to curate your personal collection.</p>
        <Link to="/shop" className="btn btn-primary">Discover Products</Link>
      </div>
    </div>
  );

  return (
    <div className="shop-luxe page-enter">
      <div className="container">
        <header className="shop-header-luxe vast-space">
          <div className="header-text">
            <span className="label-md">Curated</span>
            <h1 className="display-lg">Your Wishlist</h1>
          </div>
        </header>

        <div className="shop-layout-luxe" style={{ display: 'block', gridTemplateColumns: '1fr' }}>
          <main className="shop-main-luxe">
            <div className="shop-grid-luxe">
              {wishlist.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
