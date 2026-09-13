import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css'; // Reuse auth styles

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      toast.success('Registration successful. Welcome to the Atelier.');
      navigate('/profile');
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="auth-luxe page-enter vast-space">
      <div className="container flex-center">
        <div className="auth-card-luxe">
          <header className="auth-header-luxe">
            <span className="label-md">Registration</span>
            <h1 className="display-lg">Apply.</h1>
            <p className="body-md opacity-60">Join our curated community of intentional collectors.</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form-luxe">
            <div className="form-group-luxe">
              <label className="label-md">User Name</label>
              <input 
                type="text" 
                className="input-minimal" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Enter your User Name"
                required 
              />
            </div>
            <div className="form-group-luxe">
              <label className="label-md">Email Address</label>
              <input 
                type="email" 
                className="input-minimal" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your E-mail"
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
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn-luxe" disabled={loading}>{loading ? 'Applying…' : 'Apply for Membership'}</button>
          </form>

          <footer className="auth-footer-luxe">
            <p className="body-md opacity-60">Already a member?</p>
            <Link to="/login" className="btn-tertiary">Sign In</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
