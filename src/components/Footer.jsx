import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { categories } from '../data/products';
import './Footer.css';

const SOCIALS = [
  { label: 'GitHub', Icon: Github, href: 'https://github.com/HarshKumar30/Ateller-A-Digital-Marketplace' },
  { label: 'Twitter', Icon: Twitter, href: 'https://twitter.com' },
  { label: 'Instagram', Icon: Instagram, href: 'https://instagram.com' },
  { label: 'Email', Icon: Mail, href: 'mailto:hello@digitalatelier.in' },
];

export default function Footer() {
  const [newsletter, setNewsletter] = useState('');
  const year = new Date().getFullYear();

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newsletter.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Subscribed. Welcome to the Atelier list.');
    setNewsletter('');
  };

  return (
    <footer className="footer-luxe">
      <div className="container footer-inner-luxe">
        <div className="footer-brand-luxe">
          <Link to="/" className="footer-logo-luxe">
            <span className="logo-text">THE DIGITAL ATELIER</span>
          </Link>
          <p className="body-md footer-tagline-luxe">
            A curated space for the intentional collector. <br />
            Precision in design, poetry in everyday life.
          </p>

          <form className="footer-newsletter" onSubmit={subscribe}>
            <label className="label-md" htmlFor="footer-newsletter-input">Early access to curated drops</label>
            <div className="footer-newsletter-row">
              <input
                id="footer-newsletter-input"
                type="email"
                className="input-minimal footer-newsletter-input"
                placeholder="Email Address"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
              />
              <button type="submit" className="btn btn-primary footer-newsletter-btn" aria-label="Subscribe">
                <Send size={14} /> Join
              </button>
            </div>
          </form>

          <div className="footer-social-luxe">
            {SOCIALS.map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="social-btn-luxe"
                aria-label={label}
              >
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links-luxe">
          <div className="footer-col-luxe">
            <h4 className="label-md">Collection</h4>
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <Link key={c.id} to={`/shop?category=${c.id}`} className="footer-link-luxe">{c.label}</Link>
            ))}
            <Link to="/shop?category=all" className="footer-link-luxe">View All</Link>
          </div>
          <div className="footer-col-luxe">
            <h4 className="label-md">Atelier</h4>
            <Link to="/shop" className="footer-link-luxe">Shop</Link>
            <Link to="/wishlist" className="footer-link-luxe">Wishlist</Link>
            <Link to="/cart" className="footer-link-luxe">Cart</Link>
            <Link to="/sell" className="footer-link-luxe">Become a Seller</Link>
            <Link to="/seller/register" className="footer-link-luxe">Open a Shop</Link>
          </div>
          <div className="footer-col-luxe">
            <h4 className="label-md">Support</h4>
            <a href="mailto:hello@digitalatelier.in" className="footer-link-luxe footer-contact">
              <Mail size={14} /> hello@digitalatelier.in
            </a>
            <a href="tel:+911800000000" className="footer-link-luxe footer-contact">
              <Phone size={14} /> 1800-000-000 (Toll-free)
            </a>
            <p className="footer-link-luxe footer-contact footer-address">
              <MapPin size={14} /> Connaught Place, New Delhi 110001
            </p>
            <p className="body-md footer-note">Free shipping over ₹9,999 · 7-day curated returns</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom-luxe">
        <div className="container flex-between">
          <p className="label-md">© {year} THE DIGITAL ATELIER</p>
          <div className="footer-payments" aria-label="Accepted payments">
            {['UPI', 'Visa', 'Mastercard', 'COD'].map((p) => (
              <span key={p} className="pay-badge label-md">{p}</span>
            ))}
          </div>
          <p className="label-md footer-crafted">Crafted in India</p>
        </div>
      </div>
    </footer>
  );
}
