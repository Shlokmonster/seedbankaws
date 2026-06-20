import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/seeds', icon: '🌱', label: 'Seed Management' },
  { to: '/storage', icon: '🏛️', label: 'Storage Centers' },
  { to: '/reports', icon: '📊', label: 'Reports' },
  { to: '/monitoring', icon: '📡', label: 'Monitoring' },
  { to: '/pricing', icon: '💲', label: 'Pricing' },
  { to: '/users', icon: '👥', label: 'Users' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter navigation items by role
  const allowedNavItems = navItems.filter(item => {
    if (!user) return false;
    
    // Users tab restricted to Admin
    if (item.to === '/users') {
      return user.role === 'Admin';
    }
    
    // Reports and Monitoring restricted to Admin and Manager
    if (item.to === '/reports' || item.to === '/monitoring') {
      return user.role === 'Admin' || user.role === 'Manager';
    }
    
    return true;
  });

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌿</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">SeedBank</span>
              <span className="sidebar-tagline">Genetic Resource Cloud</span>
            </div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={onToggle} title="Toggle Sidebar">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          {!collapsed && <span className="sidebar-section-label">Navigation</span>}
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : ''}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name.split(' ').slice(0,2).join(' ')}</span>
              <span className="sidebar-user-role">{user.role}</span>
            </div>
          </div>
        )}
        <button className="sidebar-logout" onClick={handleLogout} title="Sign Out">
          <span>🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
