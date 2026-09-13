import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Store, ArrowLeft, LogOut, Sun, Moon } from 'lucide-react';
import { useSeller } from '../context/SellerContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './SellerNavbar.css';

export default function SellerNavbar() {
  const { seller, logout } = useSeller();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out. Back to buyer mode.');
    navigate('/sell');
  };

  return (
    <nav className="navbar glass seller-nav">
      <div className="container nav-inner">
        <Link to="/seller/dashboard" className="nav-logo luxe-text">
          <span className="logo-main">THE DIGITAL</span>
          <span className="logo-sub">ATELIER · SELLER</span>
        </Link>

        <div className="nav-links label-md seller-links">
          <NavLink to="/seller/dashboard" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="seller-link-inner"><LayoutDashboard size={15} /> Dashboard</span>
          </NavLink>
          <NavLink to="/seller/dashboard/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="seller-link-inner"><Package size={15} /> Products</span>
          </NavLink>
          <NavLink to="/seller/dashboard/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="seller-link-inner"><Store size={15} /> Orders</span>
          </NavLink>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
          >
            <span className="toggle-icon icon-sun"><Sun size={20} strokeWidth={1.4} /></span>
            <span className="toggle-icon icon-moon"><Moon size={20} strokeWidth={1.4} /></span>
          </button>

          {seller && (
            <Link
              to={`/seller/${seller.id}`}
              className="btn-tertiary seller-shop-link"
              title="View your public storefront (buyer view)"
            >
              {seller.shop_name}
            </Link>
          )}

          <Link to="/shop" className="nav-icon-btn" title="Back to Shop (buyer mode)" aria-label="Back to Shop">
            <ArrowLeft size={20} strokeWidth={1.2} />
          </Link>

          <button onClick={handleLogout} className="nav-icon-btn" title="Sign out (back to buyer mode)" aria-label="Seller sign out">
            <LogOut size={20} strokeWidth={1.2} />
          </button>
        </div>
      </div>
    </nav>
  );
}
