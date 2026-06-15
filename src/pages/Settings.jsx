import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import './Settings.css';

const SECTIONS = ['Profile', 'Security', 'Notifications', 'Backup', 'Cloud'];

const sectionIcons = {
  Profile: '👤',
  Security: '🔒',
  Notifications: '🔔',
  Backup: '💾',
  Cloud: '☁️',
};

export default function Settings() {
  const { user, changePassword } = useAuth();
  const [activeSection, setActiveSection] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Priya Sharma',
    email: user?.email || 'priya@seedbank.gov',
    phone: '+91 98765 43210',
    department: 'Genetic Resources Division',
    bio: 'Senior geneticist specializing in cereal crop preservation and biodiversity conservation.',
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginNotification: true,
    ipWhitelist: '',
    currentPassword: '',
    newPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    seedAdditions: true,
    storageWarnings: true,
    systemHealth: true,
    weeklyDigest: true,
    incidentReports: true,
  });

  const [backup, setBackup] = useState({
    autoBackup: true,
    frequency: 'Daily',
    retention: '30',
    encryption: true,
    backupLocation: 'AWS S3',
    lastBackup: '2026-06-14 02:00 AM',
  });

  const [cloud, setCloud] = useState({
    region: 'ap-south-1',
    storageClass: 'STANDARD_IA',
    cdnEnabled: true,
    multiRegion: true,
    encryptionKey: 'AES-256',
    apiRateLimit: '1000',
  });

  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (activeSection === 'Security') {
      if (security.currentPassword || security.newPassword) {
        if (!security.currentPassword || !security.newPassword) {
          setErrorMsg('To change password, enter both current and new passwords.');
          return;
        }
        try {
          await changePassword(security.currentPassword, security.newPassword);
          setSuccessMsg('Password changed successfully!');
          setSecurity(s => ({ ...s, currentPassword: '', newPassword: '' }));
        } catch (err) {
          setErrorMsg(err.message || 'Failed to update password.');
          return;
        }
      } else {
        setSuccessMsg('Security preferences saved.');
      }
    } else {
      // Mock save other settings
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const renderProfile = () => (
    <div className="settings-section-content">
      <div className="settings-avatar-row">
        <div className="settings-avatar">{profile.name.charAt(0)}</div>
        <div>
          <h4 className="settings-avatar-name">{profile.name}</h4>
          <p className="settings-avatar-role">{user?.role || 'Staff'} · {profile.department}</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>📷 Change Photo</button>
        </div>
      </div>
      <div className="settings-form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address (Read-only)</label>
          <input type="email" className="form-input" value={profile.email} disabled style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input className="form-input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <input className="form-input" value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} />
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Bio</label>
          <textarea className="form-input" rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} />
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="settings-section-content">
      <div className="settings-toggles">
        {[
          { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require TOTP code on each login' },
          { key: 'loginNotification', label: 'Login Notifications', desc: 'Send email alert on new sign-in' },
        ].map(item => (
          <div key={item.key} className="toggle-row">
            <div>
              <div className="toggle-label">{item.label}</div>
              <div className="toggle-desc">{item.desc}</div>
            </div>
            <button
              className={`toggle-btn ${security[item.key] ? 'on' : 'off'}`}
              onClick={() => setSecurity(s => ({ ...s, [item.key]: !s[item.key] }))}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>
      <div className="settings-form-grid">
        <div className="form-group">
          <label className="form-label">Session Timeout (minutes)</label>
          <select className="form-select" value={security.sessionTimeout} onChange={e => setSecurity(s => ({ ...s, sessionTimeout: e.target.value }))}>
            {['15', '30', '60', '120', '240'].map(v => <option key={v} value={v}>{v} minutes</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Password Expiry (days)</label>
          <select className="form-select" value={security.passwordExpiry} onChange={e => setSecurity(s => ({ ...s, passwordExpiry: e.target.value }))}>
            {['30', '60', '90', '180', 'Never'].map(v => <option key={v} value={v}>{v === 'Never' ? 'Never' : `${v} days`}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Update Credentials</h4>
        </div>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Enter current password" 
            value={security.currentPassword}
            onChange={e => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Enter new password" 
            value={security.newPassword}
            onChange={e => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-section-content">
      <div className="settings-toggles">
        {[
          { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
          { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive critical alerts via SMS' },
          { key: 'seedAdditions', label: 'Seed Addition Events', desc: 'Notify on new seed batches' },
          { key: 'storageWarnings', label: 'Storage Warnings', desc: 'Alert when capacity exceeds 80%' },
          { key: 'systemHealth', label: 'System Health Alerts', desc: 'Infrastructure critical events' },
          { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary email every Monday' },
          { key: 'incidentReports', label: 'Incident Reports', desc: 'Post-incident analysis reports' },
        ].map(item => (
          <div key={item.key} className="toggle-row">
            <div>
              <div className="toggle-label">{item.label}</div>
              <div className="toggle-desc">{item.desc}</div>
            </div>
            <button
              className={`toggle-btn ${notifications[item.key] ? 'on' : 'off'}`}
              onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="settings-section-content">
      <div className="backup-status-card">
        <span className="backup-status-icon">✅</span>
        <div>
          <div className="backup-status-title">Last successful backup</div>
          <div className="backup-status-time">{backup.lastBackup}</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => handleSave()}>🔄 Backup Now</button>
      </div>
      <div className="settings-toggles">
        {[
          { key: 'autoBackup', label: 'Automatic Backups', desc: 'Scheduled backups based on frequency' },
          { key: 'encryption', label: 'Backup Encryption', desc: 'AES-256 encryption for all backups' },
        ].map(item => (
          <div key={item.key} className="toggle-row">
            <div>
              <div className="toggle-label">{item.label}</div>
              <div className="toggle-desc">{item.desc}</div>
            </div>
            <button
              className={`toggle-btn ${backup[item.key] ? 'on' : 'off'}`}
              onClick={() => setBackup(b => ({ ...b, [item.key]: !b[item.key] }))}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>
      <div className="settings-form-grid">
        <div className="form-group">
          <label className="form-label">Backup Frequency</label>
          <select className="form-select" value={backup.frequency} onChange={e => setBackup(b => ({ ...b, frequency: e.target.value }))}>
            {['Hourly', 'Daily', 'Weekly', 'Monthly'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Retention Period (days)</label>
          <select className="form-select" value={backup.retention} onChange={e => setBackup(b => ({ ...b, retention: e.target.value }))}>
            {['7', '14', '30', '60', '90'].map(v => <option key={v} value={v}>{v} days</option>)}
          </select>
        </div>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Backup Destination</label>
          <select className="form-select" value={backup.backupLocation} onChange={e => setBackup(b => ({ ...b, backupLocation: e.target.value }))}>
            {['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage', 'On-Premise'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  const renderCloud = () => (
    <div className="settings-section-content">
      <div className="cloud-info-banner">
        <span>☁️</span>
        <span>Connected to <strong>SeedBank Enterprise Cloud</strong> — Multi-region active</span>
        <span className="badge badge-success">Connected</span>
      </div>
      <div className="settings-toggles">
        {[
          { key: 'cdnEnabled', label: 'CDN Acceleration', desc: 'Global edge distribution for faster access' },
          { key: 'multiRegion', label: 'Multi-Region Replication', desc: 'Replicate data across geographic regions' },
        ].map(item => (
          <div key={item.key} className="toggle-row">
            <div>
              <div className="toggle-label">{item.label}</div>
              <div className="toggle-desc">{item.desc}</div>
            </div>
            <button
              className={`toggle-btn ${cloud[item.key] ? 'on' : 'off'}`}
              onClick={() => setCloud(c => ({ ...c, [item.key]: !c[item.key] }))}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        ))}
      </div>
      <div className="settings-form-grid">
        <div className="form-group">
          <label className="form-label">Primary Region</label>
          <select className="form-select" value={cloud.region} onChange={e => setCloud(c => ({ ...c, region: e.target.value }))}>
            {['ap-south-1', 'us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Storage Class</label>
          <select className="form-select" value={cloud.storageClass} onChange={e => setCloud(c => ({ ...c, storageClass: e.target.value }))}>
            {['STANDARD', 'STANDARD_IA', 'GLACIER', 'INTELLIGENT_TIERING'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Encryption Algorithm</label>
          <select className="form-select" value={cloud.encryptionKey} onChange={e => setCloud(c => ({ ...c, encryptionKey: e.target.value }))}>
            {['AES-256', 'RSA-2048', 'ChaCha20'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">API Rate Limit (req/min)</label>
          <input type="number" className="form-input" value={cloud.apiRateLimit} onChange={e => setCloud(c => ({ ...c, apiRateLimit: e.target.value }))} />
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'Profile': return renderProfile();
      case 'Security': return renderSecurity();
      case 'Notifications': return renderNotifications();
      case 'Backup': return renderBackup();
      case 'Cloud': return renderCloud();
      default: return null;
    }
  };

  return (
    <div className="settings-page animate-slideUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and platform configuration</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {successMsg && <span className="settings-saved-toast" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>{successMsg}</span>}
          {saved && <span className="settings-saved-toast">✅ Changes saved!</span>}
          <button className="btn btn-primary" onClick={handleSave} id="save-settings-btn">💾 Save Changes</button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="settings-layout">
        {/* Left Nav */}
        <nav className="settings-nav card">
          {SECTIONS.map(section => (
            <button
              key={section}
              className={`settings-nav-item ${activeSection === section ? 'active' : ''}`}
              onClick={() => { setErrorMsg(''); setSuccessMsg(''); setActiveSection(section); }}
              id={`settings-nav-${section.toLowerCase()}`}
            >
              <span className="settings-nav-icon">{sectionIcons[section]}</span>
              <span>{section} Settings</span>
              <span className="settings-nav-chevron">›</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="card settings-content">
          <div className="card-header">
            <h3 className="card-title">
              {sectionIcons[activeSection]} {activeSection} Settings
            </h3>
          </div>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
