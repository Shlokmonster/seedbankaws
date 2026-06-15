import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { ROLES } from '../data/mockData';
import './UserManagement.css';

const roleColors = { Admin: 'badge-error', Manager: 'badge-info', Staff: 'badge-neutral' };
const roleIcons = { Admin: '👑', Manager: '🎖️', Staff: '👤' };

const emptyForm = { name: '', email: '', password: '', role: 'Staff', department: '', status: 'Active' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getUsers();
      
      const mapped = data.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department || 'N/A',
        status: u.status || 'Active',
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'
      }));
      setUsers(mapped);
    } catch (err) {
      console.error('Failed to load user management list:', err);
      setError('Could not query users list. Restricted to Admin roles only.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !search || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const openEdit = (u) => { 
    setEditUser(u); 
    setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department, status: u.status }); 
  };
  
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields (Name, Email, and Password)');
      return;
    }
    
    try {
      setError('');
      await userService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        status: form.status
      });
      setShowAdd(false);
      setForm(emptyForm);
      fetchUsersList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create new user profile.');
    }
  };

  const handleEdit = async () => {
    if (!form.name || !form.email) {
      setError('Name and Email are required.');
      return;
    }

    try {
      setError('');
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department,
        status: form.status
      };
      
      // Only include password if set
      if (form.password) {
        payload.password = form.password;
      }

      await userService.updateUser(editUser.id, payload);
      setEditUser(null);
      fetchUsersList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user profile.');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await userService.deleteUser(deleteUser.id);
      setDeleteUser(null);
      fetchUsersList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove user account.');
      setDeleteUser(null);
    }
  };

  const toggleStatus = async (user) => {
    try {
      setError('');
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      await userService.updateUser(user.id, {
        name: user.name,
        email: user.email,
        role: user.role,
        status: newStatus
      });
      fetchUsersList();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle account status.');
    }
  };

  return (
    <div className="users-page animate-slideUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.filter(u => u.status === 'Active').length} active of {users.length} total users</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setShowAdd(true); }} id="add-user-btn">
          + Add User
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Role Summary */}
      <div className="role-summary-grid" style={{ marginBottom: '1.5rem' }}>
        {ROLES.map(role => {
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="role-summary-card">
              <span className="role-card-icon">{roleIcons[role]}</span>
              <div>
                <div className="role-card-count">{count}</div>
                <div className="role-card-label">{role}s</div>
              </div>
              <span className={`badge ${roleColors[role]}`}>{role}</span>
            </div>
          );
        })}
        <div className="role-summary-card">
          <span className="role-card-icon">✅</span>
          <div>
            <div className="role-card-count">{users.filter(u => u.status === 'Active').length}</div>
            <div className="role-card-label">Active</div>
          </div>
          <span className="badge badge-success">Active</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="seed-filters">
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Search by name or email..." value={search}
                onChange={e => setSearch(e.target.value)} id="user-search-input" />
            </div>
            <select className="form-select filter-select" value={filterRole} onChange={e => setFilterRole(e.target.value)} id="user-filter-role">
              <option value="">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="form-select filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="user-filter-status">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="users-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ fontSize: '2rem', animation: 'spin 1.5s linear infinite' }}>👤</div>
            <p style={{ marginTop: '1rem' }}>Querying personnel registers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">👥</div>
            <h3>No users found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : filtered.map(user => (
          <div key={user.id} className={`user-card ${user.status === 'Inactive' ? 'inactive' : ''}`}>
            <div className="user-card-header">
              <div className="user-card-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-card-info">
                <span className="user-card-name">{user.name}</span>
                <span className="user-card-email">{user.email}</span>
              </div>
              <div className="user-card-badges">
                <span className={`badge ${roleColors[user.role]}`}>{roleIcons[user.role]} {user.role}</span>
                <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{user.status}</span>
              </div>
            </div>
            <div className="user-card-meta">
              <div className="user-meta-item">
                <span className="user-meta-icon">🏢</span>
                <span>{user.department}</span>
              </div>
              <div className="user-meta-item">
                <span className="user-meta-icon">🕐</span>
                <span>Last Login: {user.lastLogin}</span>
              </div>
            </div>
            <div className="user-card-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(user)}>✏️ Edit</button>
              <button
                className={`btn btn-sm ${user.status === 'Active' ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => toggleStatus(user)}
              >
                {user.status === 'Active' ? '⏸ Deactivate' : '▶ Activate'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteUser(user)} style={{ color: 'var(--error)' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <UserModal title="Add New User" form={form} onChange={handleChange} onClose={() => setShowAdd(false)} onSave={handleAdd} showPassword={true} />
      )}

      {/* Edit Modal */}
      {editUser && (
        <UserModal title="Edit User" form={form} onChange={handleChange} onClose={() => setEditUser(null)} onSave={handleEdit} showPassword={false} />
      )}

      {/* Delete Confirm */}
      {deleteUser && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--error)' }}>⚠️ Remove User</h3>
              <button className="modal-close" onClick={() => setDeleteUser(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>{deleteUser.name}</strong>? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteUser(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Remove User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserModal({ title, form, onChange, onClose, onSave, showPassword }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input name="name" className="form-input" value={form.name} onChange={onChange} placeholder="Dr. Jane Smith" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input name="email" type="email" className="form-input" value={form.email} onChange={onChange} placeholder="jane@seedbank.gov" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password {showPassword ? '*' : '(leave blank to keep unchanged)'}</label>
              <input name="password" type="password" className="form-input" value={form.password} onChange={onChange} placeholder="••••••••" required={showPassword} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={form.role} onChange={onChange}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input name="department" className="form-input" value={form.department} onChange={onChange} placeholder="e.g. Genetic Resources" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Account Status</label>
              <select name="status" className="form-select" value={form.status} onChange={onChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>💾 Save User</button>
        </div>
      </div>
    </div>
  );
}
