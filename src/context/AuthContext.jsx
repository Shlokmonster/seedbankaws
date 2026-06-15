import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto Login Persistence
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('seedbank_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to restore login session:', err.message);
        localStorage.removeItem('seedbank_token');
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('seedbank_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('seedbank_token');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Password update failed.';
      throw new Error(errMsg);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="loading-screen" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0d1117',
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>🌱</div>
          <h2 style={{ fontWeight: 400 }}>Loading SeedBank GRC...</h2>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
