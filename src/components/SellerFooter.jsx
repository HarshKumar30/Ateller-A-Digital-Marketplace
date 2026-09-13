import { Link } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import './Footer.css';

export default function SellerFooter() {
  const { seller } = useSeller();
  const year = new Date().getFullYear();

  return (
    <footer className="footer-luxe seller-footer">
      <div className="container footer-inner-luxe seller-footer-inner">
        <div className="footer-brand-luxe">
          <span className="logo-text">THE DIGITAL ATELIER · SELLER</span>
          <p className="body-md footer-tagline-luxe">
            {seller ? `${seller.shop_name} — ` : ''}products-only v1. Orders land here in v2.
          </p>
        </div>
        <div className="footer-links-luxe seller-footer-links">
          <div className="footer-col-luxe">
            <h4 className="label-md">Seller</h4>
            <Link to="/seller/dashboard" className="footer-link-luxe">Dashboard</Link>
            <Link to="/seller/dashboard/products" className="footer-link-luxe">My Products</Link>
            <Link to="/seller/dashboard/orders" className="footer-link-luxe">Orders</Link>
          </div>
          <div className="footer-col-luxe">
            <h4 className="label-md">Marketplace</h4>
            <Link to="/shop" className="footer-link-luxe">Back to Shop (buyer mode)</Link>
            {seller && <Link to={`/seller/${seller.id}`} className="footer-link-luxe">My Storefront</Link>}
            <Link to="/sell" className="footer-link-luxe">Seller Home</Link>
          </div>
          <div className="footer-col-luxe">
            <h4 className="label-md">Support</h4>
            <a href="mailto:hello@digitalatelier.in" className="footer-link-luxe">hello@digitalatelier.in</a>
            <Link to="/seller/login" className="footer-link-luxe">Seller Sign In</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom-luxe">
        <div className="container flex-between">
          <p className="label-md">© {year} THE DIGITAL ATELIER · SELLER MODE</p>
          <p className="label-md footer-crafted">Buyer cart & wishlist hidden in this mode</p>
        </div>
      </div>
    </footer>
  );
}
