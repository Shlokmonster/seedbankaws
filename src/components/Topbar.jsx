import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Topbar.css';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of genetic resource operations' },
  '/seeds': { title: 'Seed Management', subtitle: 'Manage seed inventory and varieties' },
  '/storage': { title: 'Storage Centers', subtitle: 'Monitor and manage storage facilities' },
  '/reports': { title: 'Reports & Analytics', subtitle: 'Insights and performance metrics' },
  '/monitoring': { title: 'System Monitoring', subtitle: 'Infrastructure health and alerts' },
  '/users': { title: 'User Management', subtitle: 'Manage accounts and permissions' },
  '/settings': { title: 'Settings', subtitle: 'Configure your platform' },
};

export default function Topbar({ onMenuClick, sidebarCollapsed }) {
  const { user } = useAuth();
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: 'SeedBank', subtitle: '' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} title="Toggle menu">
          ☰
        </button>
        <div className="topbar-page-info">
          <h1 className="topbar-page-title">{pageInfo.title}</h1>
          <p className="topbar-page-subtitle">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-status">
          <span className="topbar-status-dot"></span>
          <span className="topbar-status-text">All Systems Operational</span>
        </div>

        <div className="topbar-divider"></div>

        <button className="topbar-icon-btn" title="Notifications">
          <span>🔔</span>
          <span className="topbar-notif-badge">3</span>
        </button>

        <button className="topbar-icon-btn" title="Help">
          <span>❓</span>
        </button>

        <div className="topbar-user-pill">
          <div className="topbar-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name?.split(' ').slice(0, 2).join(' ')}</span>
            <span className="topbar-user-role">{user?.role}</span>
          </div>
          <span className="topbar-chevron">▾</span>
        </div>
      </div>
    </header>
  );
}
