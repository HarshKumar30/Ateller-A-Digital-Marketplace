import { Link } from 'react-router-dom';
import './Login.css';

export default function Sell() {
  return (
    <div className="auth-luxe page-enter vast-space">
      <div className="container flex-center">
        <div className="auth-card-luxe">
          <header className="auth-header-luxe">
            <span className="label-md">Sellers</span>
            <h1 className="display-lg">Sell at the Atelier.</h1>
            <p className="body-md opacity-60">
              Open a shop, list artifacts, manage stock. Products-only v1 — no order management yet.
            </p>
          </header>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/seller/register" className="btn btn-primary">Open a shop</Link>
            <Link to="/seller/login" className="btn-tertiary">Seller sign in</Link>
            <Link to="/seller/dashboard" className="btn-tertiary">Dashboard</Link>
          </div>
          <footer className="auth-footer-luxe">
            <p className="body-md opacity-60">Separate seller accounts. Buyer login stays unchanged.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
