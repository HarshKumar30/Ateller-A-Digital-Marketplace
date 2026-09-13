import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function SellerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useSeller();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      toast.success('Welcome back, seller');
      navigate('/seller/dashboard', { replace: true });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="auth-luxe page-enter vast-space">
      <div className="container flex-center">
        <div className="auth-card-luxe">
          <header className="auth-header-luxe">
            <span className="label-md">Seller Authentication</span>
            <h1 className="display-lg">Seller Login</h1>
            <p className="body-md opacity-60">Manage your products and stock.</p>
          </header>
          <form onSubmit={handleSubmit} className="auth-form-luxe">
            <div className="form-group-luxe">
              <label className="label-md">Email Address</label>
              <input type="email" className="input-minimal" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="shop@atelier.com" required />
            </div>
            <div className="form-group-luxe">
              <label className="label-md">Secure Password</label>
              <input type="password" className="input-minimal" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary auth-btn-luxe" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In as Seller'}
            </button>
          </form>
          <footer className="auth-footer-luxe">
            <p className="body-md opacity-60">New seller?</p>
            <Link to="/seller/register" className="btn-tertiary">Open a shop</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
