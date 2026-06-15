import { useState, useEffect } from 'react';
import { seedService } from '../services/api';
import { REGIONS, CATEGORIES, PRESERVATION_STATUSES, SEED_STATUSES } from '../data/mockData';
import './SeedManagement.css';

const SEEDS_PER_PAGE = 8;

const statusColors = {
  Active: 'badge-success',
  Endangered: 'badge-warning',
  Critical: 'badge-error',
  Archived: 'badge-neutral',
};

const preservationColors = {
  Cryogenic: 'badge-info',
  'Cold Storage': 'badge-success',
  Ambient: 'badge-neutral',
  'Controlled Atmosphere': 'badge-purple',
};

const emptyForm = {
  name: '', species: '', category: 'Cereal', quantity: '', region: 'South Asia',
  status: 'Active', preservationStatus: 'Cold Storage', description: ''
};

export default function SeedManagement() {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editSeed, setEditSeed] = useState(null);
  const [deleteSeed, setDeleteSeed] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Map Backend seed schema to Frontend form schema
  const toFrontend = (seed) => ({
    id: seed.id,
    name: seed.seed_name,
    species: seed.species,
    category: seed.genetic_category,
    quantity: seed.quantity,
    region: seed.region,
    preservationStatus: seed.preservation_status,
    status: seed.status,
    description: seed.description || '',
    addedDate: new Date(seed.created_at).toISOString().split('T')[0]
  });

  // Fetch Seeds from API
  const fetchSeeds = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search || undefined,
        category: filterCategory || undefined,
        status: filterStatus || undefined,
        region: filterRegion || undefined,
        page: currentPage,
        limit: SEEDS_PER_PAGE
      };
      
      const data = await seedService.getSeeds(params);
      setSeeds(data.seeds.map(toFrontend));
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (err) {
      console.error('Failed to fetch seeds:', err);
      setError('Could not retrieve seed records from server. Displaying cached session records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeeds();
  }, [search, filterCategory, filterStatus, filterRegion, currentPage]);

  // Form handlers
  const openAdd = () => { setForm(emptyForm); setShowAddModal(true); };
  const openEdit = (seed) => { setEditSeed(seed); setForm({ ...seed }); };
  const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    if (!form.name || !form.quantity || !form.species) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setError('');
      const payload = {
        seed_name: form.name,
        species: form.species,
        genetic_category: form.category,
        quantity: parseInt(form.quantity, 10),
        region: form.region,
        preservation_status: form.preservationStatus,
        status: form.status,
        description: form.description
      };
      
      await seedService.createSeed(payload);
      setShowAddModal(false);
      setCurrentPage(1); // Go to first page
      fetchSeeds(); // Refresh table
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create seed record.');
    }
  };

  const handleEdit = async () => {
    if (!form.name || !form.quantity || !form.species) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError('');
      const payload = {
        seed_name: form.name,
        species: form.species,
        genetic_category: form.category,
        quantity: parseInt(form.quantity, 10),
        region: form.region,
        preservation_status: form.preservationStatus,
        status: form.status,
        description: form.description
      };

      await seedService.updateSeed(editSeed.id, payload);
      setEditSeed(null);
      fetchSeeds(); // Refresh table
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update seed record.');
    }
  };

  const handleDelete = async () => {
    try {
      setError('');
      await seedService.deleteSeed(deleteSeed.id);
      setDeleteSeed(null);
      // Adjust current page if we deleted the last item on the page
      if (seeds.length === 1 && currentPage > 1) {
        setCurrentPage(p => p - 1);
      } else {
        fetchSeeds();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete seed record. Roles Manager or Admin required.');
      setDeleteSeed(null);
    }
  };

  return (
    <div className="seed-mgmt animate-slideUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Seed Management</h1>
          <p className="page-subtitle">{totalItems} varieties in active inventory</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-seed-btn">
          + Add Seed
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Filters Row */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="seed-filters">
            <div className="search-bar">
              <span>🔍</span>
              <input
                type="text" placeholder="Search seeds, species, region..."
                value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                id="seed-search-input"
              />
            </div>
            <select className="form-select filter-select" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }} id="filter-category">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} id="filter-status">
              <option value="">All Statuses</option>
              {SEED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="form-select filter-select" value={filterRegion} onChange={e => { setFilterRegion(e.target.value); setCurrentPage(1); }} id="filter-region">
              <option value="">All Regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {(search || filterCategory || filterStatus || filterRegion) && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); setFilterRegion(''); setCurrentPage(1); }}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-color)' }}>
            <div className="spinner" style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1.5s linear infinite' }}>🌱</div>
            <p>Syncing seed catalog...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table" id="seeds-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Seed Name</th>
                  <th>Species</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Region</th>
                  <th>Preservation</th>
                  <th>Status</th>
                  <th>Added Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {seeds.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="empty-state">
                        <div className="empty-state-icon">🌱</div>
                        <h3>No seeds found</h3>
                        <p>Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : seeds.map((seed, idx) => (
                  <tr key={seed.id}>
                    <td style={{ color: 'var(--gray-400)', fontSize: 'var(--text-xs)' }}>
                      {(currentPage - 1) * SEEDS_PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <div className="seed-name-cell">
                        <div className="seed-icon-mini">🌱</div>
                        <span style={{ fontWeight: 600 }}>{seed.name}</span>
                      </div>
                    </td>
                    <td style={{ fontStyle: 'italic', color: 'var(--gray-600)' }}>{seed.species}</td>
                    <td><span className="badge badge-neutral">{seed.category}</span></td>
                    <td><strong>{seed.quantity.toLocaleString()}</strong></td>
                    <td>{seed.region}</td>
                    <td>
                      <span className={`badge ${preservationColors[seed.preservationStatus] || 'badge-neutral'}`}>
                        {seed.preservationStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${statusColors[seed.status] || 'badge-neutral'}`}>
                        {seed.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>{seed.addedDate}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => openEdit(seed)} title="Edit">✏️</button>
                        <button className="action-btn delete" onClick={() => setDeleteSeed(seed)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="table-footer">
            <span className="table-info">
              Showing {(currentPage - 1) * SEEDS_PER_PAGE + 1}–{Math.min(currentPage * SEEDS_PER_PAGE, totalItems)} of {totalItems}
            </span>
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="pagination-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <SeedModal title="Add New Seed" form={form} onChange={handleFormChange} onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}

      {/* Edit Modal */}
      {editSeed && (
        <SeedModal title="Edit Seed" form={form} onChange={handleFormChange} onClose={() => setEditSeed(null)} onSave={handleEdit} />
      )}

      {/* Delete Confirm */}
      {deleteSeed && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--error)' }}>⚠️ Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteSeed(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deleteSeed.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteSeed(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Seed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SeedModal({ title, form, onChange, onClose, onSave }) {
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
              <label className="form-label">Seed Name *</label>
              <input name="name" className="form-input" value={form.name} onChange={onChange} placeholder="e.g. Oryza sativa (Indica)" required />
            </div>
            <div className="form-group">
              <label className="form-label">Species Scientific Name *</label>
              <input name="species" className="form-input" value={form.species} onChange={onChange} placeholder="Scientific name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={onChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input name="quantity" type="number" className="form-input" value={form.quantity} onChange={onChange} placeholder="e.g. 5000" required />
            </div>
            <div className="form-group">
              <label className="form-label">Region</label>
              <select name="region" className="form-select" value={form.region} onChange={onChange}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={form.status} onChange={onChange}>
                {SEED_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Preservation Method</label>
              <select name="preservationStatus" className="form-select" value={form.preservationStatus} onChange={onChange}>
                {PRESERVATION_STATUSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description / Field Notes</label>
              <textarea name="description" className="form-input" value={form.description || ''} onChange={onChange} placeholder="Field collection notes..." rows={3} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>💾 Save Seed</button>
        </div>
      </div>
    </div>
  );
}
