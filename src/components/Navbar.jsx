import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import './Navbar.css';
import { categories } from '../data/products';

export default function Navbar({ onSearch }) {
  const { items } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') onSearch(search);
    navigate('/shop');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-inner">
        {/* Logo - Editorial Style */}
        <Link to="/" className="nav-logo luxe-text">
          <span className="logo-main">THE DIGITAL</span>
          <span className="logo-sub">ATELIER</span>
        </Link>

        {/* Silent Navigation */}
        <div className="nav-links label-md">
          <div className="nav-item-dropdown">
            <Link to="/shop?category=all" className="nav-link">COLLECTION</Link>
            <div className="dropdown-content glass">
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/shop?category=${cat.id}`} 
                  className="dropdown-item"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/shop?category=all" className="nav-link">SHOP</Link>
          <Link to="/sell" className="nav-link">SELL</Link>
          <Link to="/" className="nav-link">Home</Link>
        </div>

        {/* Minimal Actions */}
        <div className="nav-actions">
          <form className="nav-search-wrap" onSubmit={handleSearch}>
            <Search size={18} strokeWidth={1.2} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Products..." 
              className="nav-search-input input-minimal"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="toggle-icon icon-sun">
              <Sun size={20} strokeWidth={1.4} />
            </span>
            <span className="toggle-icon icon-moon">
              <Moon size={20} strokeWidth={1.4} />
            </span>
          </button>

          <Link to="/wishlist" className="nav-icon-btn">
            <Heart size={20} strokeWidth={1.2} />
            {wishlist.length > 0 && <span className="wishlist-dot" />}
          </Link>

          <Link to="/cart" className="nav-icon-btn">
            <ShoppingBag size={20} strokeWidth={1.2} />
            <span className="cart-count label-md">{items.reduce((acc, item) => acc + item.qty, 0)}</span>
          </Link>

          {/* User Auth Link */}
          <Link to={isAuthenticated ? "/profile" : "/login"} className="nav-auth-btn">
            {isAuthenticated && user?.name ? (
              <div className="user-initials label-md">{user.name[0]}</div>
            ) : (
              <User size={20} strokeWidth={1.2} />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
