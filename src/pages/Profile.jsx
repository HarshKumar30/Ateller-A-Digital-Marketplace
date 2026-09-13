import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Settings, Heart } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-luxe page-enter">
      <div className="container">
        <header className="profile-header-luxe vast-space">
          <div className="header-text">
            <span className="label-md">The Member</span>
            <h1 className="display-lg">The Profile.</h1>
          </div>
          <button className="btn-tertiary logout-btn-luxe" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={1.5} /> Sign Out
          </button>
        </header>

        <div className="profile-layout-luxe">
          <aside className="profile-sidebar-luxe">
            <div className="user-info-card-luxe">
              <div className="user-avatar-luxe">{user.name[0]}</div>
              <div className="user-details-luxe">
                <h3 className="noto-serif">{user.name}</h3>
                <p className="body-md opacity-60">{user.email}</p>
              </div>
            </div>

            <nav className="profile-nav-luxe">
              {[
                { label: 'Collection Dashboard', icon: User, active: true },
                { label: 'Curated Favorites', icon: Heart },
                { label: 'Shipment History', icon: Package },
                { label: 'Atelier Settings', icon: Settings },
              ].map(item => (
                <button key={item.label} className={`profile-nav-btn ${item.active ? 'active' : ''}`}>
                  <item.icon size={18} strokeWidth={1.5} />
                  <span className="label-md">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="profile-content-luxe">
            <div className="empty-profile-state">
              <h2 className="display-sm">No recent shipments found.</h2>
              <p className="body-md opacity-60">Begin your curated journey in our catalog.</p>
              <button className="btn btn-primary" onClick={() => navigate('/shop')}>Discover More Products</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
