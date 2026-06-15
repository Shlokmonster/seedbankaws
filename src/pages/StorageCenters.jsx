import { useState, useEffect } from 'react';
import { storageCenterService, userService } from '../services/api';
import './StorageCenters.css';

const statusColors = { Operational: 'badge-success', Maintenance: 'badge-warning', Offline: 'badge-error' };

const emptyForm = { name: '', location: '', capacity: '', utilization: 0, managerId: '', status: 'Operational' };

export default function StorageCenters() {
  const [centers, setCenters] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editCenter, setEditCenter] = useState(null);
  const [deleteCenter, setDeleteCenter] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Map Backend center schema to Frontend
  const toFrontend = (c) => {
    const capacity = parseInt(c.capacity, 10) || 0;
    const utilPct = parseFloat(c.utilization_percentage) || 0;
    const used = Math.round((capacity * utilPct) / 100);
    
    // Dynamically match temp based on vault names
    let temp = '4°C';
    if (c.center_name.includes('Arctic') || c.center_name.includes('Plains')) temp = '-18°C';
    else if (c.center_name.includes('Himalayan')) temp = '-10°C';
    else if (c.center_name.includes('Pacific')) temp = '-15°C';

    return {
      id: c.id,
      name: c.center_name,
      location: c.location,
      capacity,
      used,
      utilPct,
      manager: c.manager_name || 'Unassigned',
      managerId: c.manager_id || '',
      status: c.utilization_percentage > 90 ? 'Maintenance' : 'Operational', // or map to status
      temp,
      established: new Date(c.created_at).toISOString().split('T')[0]
    };
  };

  const fetchCentersAndManagers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [centersData, usersData] = await Promise.all([
        storageCenterService.getStorageCenters(),
        userService.getUsers().catch(() => []) // Fallback in case user is not admin (non-admin can't read users)
      ]);

      setCenters(centersData.map(toFrontend));
      
      // Filter users who can manage vaults (Managers and Admins)
      const managersList = usersData.filter(u => u.role === 'Manager' || u.role === 'Admin');
      setManagers(managersList);
    } catch (err) {
      console.error('Failed to load storage centers data:', err);
      setError('Could not retrieve storage center list. Using offline session view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentersAndManagers();
  }, []);

  const filtered = centers.filter(c => {
    const q = search.toLowerCase();
    const match = !search || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return match && matchStatus;
  });

  const openAdd = () => { setForm(emptyForm); setShowAdd(true); };
  
  const openEdit = (c) => { 
    setEditCenter(c); 
    setForm({ 
      name: c.name, 
      location: c.location, 
      capacity: c.capacity, 
      utilization: c.utilPct,
      managerId: c.managerId, 
      status: c.status 
    }); 
  };
  
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.capacity || !form.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setError('');
      const payload = {
        center_name: form.name,
        location: form.location,
        capacity: parseInt(form.capacity, 10),
        utilization_percentage: parseFloat(form.utilization || 0),
        manager_id: form.managerId || null
      };

      await storageCenterService.createStorageCenter(payload);
      setShowAdd(false);
      fetchCentersAndManagers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create storage center.');
    }
  };

  const handleEdit = async () => {
    if (!form.name || !form.capacity || !form.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      const payload = {
        center_name: form.name,
        location: form.location,
        capacity: parseInt(form.capacity, 10),
        utilization_percentage: parseFloat(form.utilization || 0),
        manager_id: form.managerId || null
      };

      await storageCenterService.updateStorageCenter(editCenter.id, payload);
      setEditCenter(null);
      fetchCentersAndManagers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update storage center.');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await storageCenterService.deleteStorageCenter(deleteCenter.id);
      setDeleteCenter(null);
      fetchCentersAndManagers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete storage center. Role privileges Manager or Admin required.');
      setDeleteCenter(null);
    }
  };

  const getUtilColor = (pct) => pct >= 85 ? 'danger' : pct >= 70 ? 'warning' : '';

  // Calculate Aggregations
  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0);
  const totalUsed = centers.reduce((sum, c) => sum + c.used, 0);
  const overallUtil = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;

  return (
    <div className="storage-page animate-slideUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Storage Centers</h1>
          <p className="page-subtitle">{filtered.length} facilities managed globally</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-center-btn">+ Add Center</button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="storage-summary-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Capacity', value: totalCapacity.toLocaleString(), icon: '📦', bg: '#E8F5E9' },
          { label: 'Total Used', value: totalUsed.toLocaleString(), icon: '📊', bg: '#E3F2FD' },
          { label: 'Overall Utilization', value: `${overallUtil}%`, icon: '📈', bg: '#FFF8E1' },
          { label: 'Operational Vaults', value: centers.length, icon: '✅', bg: '#E0F7FA' },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-top">
              <div className="stat-icon" style={{ background: card.bg }}>{card.icon}</div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="seed-filters">
            <div className="search-bar">
              <span>🔍</span>
              <input type="text" placeholder="Search centers by name or location..." value={search}
                onChange={e => setSearch(e.target.value)} id="center-search-input" />
            </div>
            <select className="form-select filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} id="center-filter-status">
              <option value="">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-color)' }}>
            <div className="spinner" style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1.5s linear infinite' }}>🏛️</div>
            <p>Syncing storage vault arrays...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table" id="centers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Center Name</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>Capacity</th>
                  <th>Utilization</th>
                  <th>Temperature</th>
                  <th>Status</th>
                  <th>Established</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10}>
                    <div className="empty-state">
                      <div className="empty-state-icon">🏛️</div>
                      <h3>No storage centers found</h3>
                    </div>
                  </td></tr>
                ) : filtered.map((c, idx) => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--gray-400)', fontSize: 'var(--text-xs)' }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="center-icon-mini">🏛️</div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray-600)' }}>📍 {c.location}</td>
                    <td style={{ color: 'var(--gray-700)' }}>{c.manager}</td>
                    <td><strong>{c.capacity.toLocaleString()}</strong></td>
                    <td>
                      <div className="util-cell">
                        <span className="util-pct">{c.utilPct}%</span>
                        <div className="progress-bar" style={{ width: '100px' }}>
                          <div className={`progress-fill ${getUtilColor(c.utilPct)}`} style={{ width: `${c.utilPct}%` }} />
                        </div>
                        <span className="util-label">{c.used.toLocaleString()}/{c.capacity.toLocaleString()}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{c.temp}</span></td>
                    <td><span className={`badge ${statusColors[c.status] || 'badge-neutral'}`}>{c.status}</span></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>{c.established}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => openEdit(c)} title="Edit">✏️</button>
                        <button className="action-btn delete" onClick={() => setDeleteCenter(c)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && <CenterModal title="Add Storage Center" form={form} onChange={handleChange} onClose={() => setShowAdd(false)} onSave={handleAdd} managers={managers} />}

      {/* Edit Modal */}
      {editCenter && <CenterModal title="Edit Storage Center" form={form} onChange={handleChange} onClose={() => setEditCenter(null)} onSave={handleEdit} managers={managers} />}

      {/* Delete Confirm */}
      {deleteCenter && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--error)' }}>⚠️ Delete Center</h3>
              <button className="modal-close" onClick={() => setDeleteCenter(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Delete <strong>{deleteCenter.name}</strong>? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteCenter(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CenterModal({ title, form, onChange, onClose, onSave, managers }) {
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
              <label className="form-label">Center Name *</label>
              <input name="name" className="form-input" value={form.name} onChange={onChange} placeholder="e.g. Arctic Vault Alpha" required />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-input" value={form.location} onChange={onChange} placeholder="City, Country" required />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity (seeds) *</label>
              <input name="capacity" type="number" className="form-input" value={form.capacity} onChange={onChange} placeholder="e.g. 50000" required />
            </div>
            <div className="form-group">
              <label className="form-label">Utilization (%) *</label>
              <input name="utilization" type="number" step="0.01" min="0" max="100" className="form-input" value={form.utilization} onChange={onChange} placeholder="e.g. 72.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Manager</label>
              <select name="managerId" className="form-select" value={form.managerId} onChange={onChange}>
                <option value="">Select manager</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={form.status} onChange={onChange}>
                <option value="Operational">Operational</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>💾 Save Center</button>
        </div>
      </div>
    </div>
  );
}
