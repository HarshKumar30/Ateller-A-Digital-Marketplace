import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSeller } from '../context/SellerContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function SellerRegister() {
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useSeller();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(shopName, email, password);
    if (res.success) {
      toast.success('Shop created. Welcome, seller.');
      navigate('/seller/dashboard');
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="auth-luxe page-enter vast-space">
      <div className="container flex-center">
        <div className="auth-card-luxe">
          <header className="auth-header-luxe">
            <span className="label-md">Seller Registration</span>
            <h1 className="display-lg">Open a shop.</h1>
            <p className="body-md opacity-60">Separate from buyer accounts.</p>
          </header>
          <form onSubmit={handleSubmit} className="auth-form-luxe">
            <div className="form-group-luxe">
              <label className="label-md">Shop Name</label>
              <input type="text" className="input-minimal" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Maison Lumière" required minLength={2} />
            </div>
            <div className="form-group-luxe">
              <label className="label-md">Email Address</label>
              <input type="email" className="input-minimal" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="shop@atelier.com" required />
            </div>
            <div className="form-group-luxe">
              <label className="label-md">Secure Password</label>
              <input type="password" className="input-minimal" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary auth-btn-luxe" disabled={loading}>
              {loading ? 'Creating…' : 'Create Seller Account'}
            </button>
          </form>
          <footer className="auth-footer-luxe">
            <p className="body-md opacity-60">Already sell with us?</p>
            <Link to="/seller/login" className="btn-tertiary">Seller Sign In</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
