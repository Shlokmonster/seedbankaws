import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SeedManagement from './pages/SeedManagement';
import StorageCenters from './pages/StorageCenters';
import Reports from './pages/Reports';
import Monitoring from './pages/Monitoring';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/seeds" element={<SeedManagement />} />
        <Route path="/storage" element={<StorageCenters />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
