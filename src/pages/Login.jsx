import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const ROLES = ['Admin', 'Manager', 'Staff'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Art */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1"></div>
        <div className="login-bg-orb orb-2"></div>
        <div className="login-bg-orb orb-3"></div>
        <div className="login-bg-grid"></div>
      </div>

      {/* Left Panel - Illustration */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-left-logo">
            <div className="login-logo-icon">🌿</div>
            <div>
              <h1 className="login-left-brand">SeedBank</h1>
              <p className="login-left-sub">Genetic Resource Cloud</p>
            </div>
          </div>

          <div className="login-illustration">
            <div className="illustration-main">
              <div className="ill-globe">🌍</div>
              <div className="ill-dna">🧬</div>
              <div className="ill-plant">🌱</div>
              <div className="ill-server">☁️</div>
              <div className="ill-leaf">🍃</div>
              <div className="ill-seed">🌾</div>
            </div>
          </div>

          <div className="login-left-text">
            <h2 className="login-left-headline">Preserving Earth's<br/>Genetic Heritage</h2>
            <p className="login-left-desc">
              A cutting-edge platform for managing, tracking, and analyzing the world's most valuable
              seed genetic resources — secured in the cloud.
            </p>
          </div>

          <div className="login-stats-row">
            <div className="login-stat">
              <span className="login-stat-value">80K+</span>
              <span className="login-stat-label">Seed Varieties</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">6</span>
              <span className="login-stat-label">Storage Centers</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">99.9%</span>
              <span className="login-stat-label">Uptime SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-right">
        <div className="login-card glass">
          <div className="login-card-header">
            <div className="login-card-logo-mobile">
              <div className="login-logo-icon-sm">🌿</div>
              <span className="login-brand-sm">SeedBank GRC</span>
            </div>
            <h2 className="login-card-title">Welcome back</h2>
            <p className="login-card-subtitle">Sign in to your enterprise account</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ margin: '0 0 1rem 0' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input login-input"
                  placeholder="you@seedbank.gov"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input login-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pass"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-role">Role</label>
              <div className="login-role-selector">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`login-role-btn ${role === r ? 'active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    <span className="login-role-icon">
                      {r === 'Admin' ? '👑' : r === 'Manager' ? '🎖️' : '👤'}
                    </span>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <span className="login-spinner">⏳ Authenticating...</span>
              ) : (
                <span>🔐 Sign In Securely</span>
              )}
            </button>
          </form>

          <p className="login-footer-text">
            Protected by enterprise SSO &nbsp;•&nbsp; SOC 2 Type II Certified
          </p>

          <div className="login-demo-hint">
            <span>💡</span>
            <span>Use any email + password to sign in with mock auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
