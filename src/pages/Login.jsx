import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      toast.success('Welcome back to the Atelier');
      navigate(from, { replace: true });
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="auth-luxe page-enter vast-space">
      <div className="container flex-center">
        <div className="auth-card-luxe">
          <header className="auth-header-luxe">
            <span className="label-md">Authentication</span>
            <h1 className="display-lg">Login</h1>
            <p className="body-md opacity-60">Please sign in to access your curated collection.</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form-luxe">
            <div className="form-group-luxe">
              <label className="label-md">Email Address</label>
              <input 
                type="email" 
                className="input-minimal" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="atelier@member.com"
                required 
              />
            </div>
            <div className="form-group-luxe">
              <label className="label-md">Secure Password</label>
              <input 
                type="password" 
                className="input-minimal" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn-luxe" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>

          <footer className="auth-footer-luxe">
            <p className="body-md opacity-60">New to the Atelier?</p>
            <Link to="/register" className="btn-tertiary">Register to Ateller</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
