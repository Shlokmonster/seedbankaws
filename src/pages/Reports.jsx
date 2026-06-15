import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { analyticsService, reportService } from '../services/api';
import { CHART_COLORS } from '../data/mockData';
import './Reports.css';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const MetricCard = ({ icon, label, value, sub, color }) => (
  <div className="metric-card" style={{ '--metric-color': color }}>
    <div className="metric-icon" style={{ background: `${color}18`, color }}>
      {icon}
    </div>
    <div className="metric-content">
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
      {sub && <span className="metric-sub">{sub}</span>}
    </div>
  </div>
);

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [reportsHistory, setReportsHistory] = useState([]);

  const fetchAnalyticsAndReports = async () => {
    try {
      setLoading(true);
      setError('');
      const [regionsData, categoriesData, growthData, utilizationData, history] = await Promise.all([
        analyticsService.getSeedsByRegion(),
        analyticsService.getSeedsByCategory(),
        analyticsService.getMonthlyGrowth(),
        analyticsService.getStorageUtilization(),
        reportService.getReports().catch(() => []) // Fallback if user does not have permission
      ]);

      setRegions(regionsData);
      setCategories(categoriesData);
      setGrowth(growthData);
      setUtilization(utilizationData);
      setReportsHistory(history);
    } catch (err) {
      console.error('Failed to load reports metrics:', err);
      setError('Could not sync live report metrics. Displaying offline baseline metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndReports();
  }, []);

  const handleGenerateReport = async (name, type) => {
    try {
      setActionLoading(true);
      setError('');
      const response = await reportService.generateReport({
        report_name: name,
        report_type: type
      });
      
      const fileUrl = response.report.file_url;
      const downloadLink = `http://localhost:5000${fileUrl}`;
      
      // Trigger a browser file download automatically
      window.open(downloadLink, '_blank');
      
      // Refresh reports list
      fetchAnalyticsAndReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report on backend.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-color)' }}>
        <div className="spinner" style={{ fontSize: '3rem', marginBottom: '1.5rem', animation: 'spin 1.5s linear infinite' }}>📊</div>
        <h2>Compiling SeedBank analytical reports...</h2>
      </div>
    );
  }

  // Calculate Metrics
  const totalSeeds = categories.reduce((sum, c) => sum + (c.value || c.count || 0), 0);
  const peakMonth = growth.length > 0 ? growth.reduce((max, month) => (month.seeds > max.seeds ? month : max), growth[0]) : { month: 'N/A', seeds: 0 };
  const avgUtilization = utilization.length > 0 ? Math.round(utilization.reduce((sum, c) => sum + c.utilization, 0) / utilization.length) : 70;

  return (
    <div className="reports-page animate-slideUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Data insights for genetic resource management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-secondary" 
            id="export-csv-btn" 
            onClick={() => handleGenerateReport(`Inventory Export CSV`, 'Inventory')}
            disabled={actionLoading}
          >
            {actionLoading ? '⏳ Exporting...' : '📤 Export CSV'}
          </button>
          <button 
            className="btn btn-primary" 
            id="download-pdf-btn"
            onClick={() => handleGenerateReport(`Seed Audit Report`, 'Audit')}
            disabled={actionLoading}
          >
            📄 Run Audit Report
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
        <MetricCard icon="🌱" label="Total Seed Count" value={totalSeeds.toLocaleString()} sub="Across all categories" color="#2E7D32" />
        <MetricCard icon="📅" label="Peak Month" value={peakMonth.month} sub={`${peakMonth.seeds.toLocaleString()} seeds added`} color="#1565C0" />
        <MetricCard icon="📊" label="Categories Loaded" value={`${categories.length} Types`} sub="Distinct genetic categories" color="#6A1B9A" />
        <MetricCard icon="🏛️" label="Avg Utilization" value={`${avgUtilization}%`} sub="Across all centers" color="#F57F17" />
        <MetricCard icon="🌍" label="Regions Covered" value={regions.length} sub="Global biodiversity zones" color="#00897B" />
      </div>

      {/* Chart Section 1 */}
      <div className="charts-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Regional Inventory */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Regional Inventory Analysis</h3>
          </div>
          <div className="card-body" style={{ padding: '1rem' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regions} layout="vertical" margin={{ left: 60, right: 20, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9E9E9E' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 11, fill: '#757575' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} formatter={v => [v.toLocaleString(), 'Seeds']} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {regions.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Category Analysis</h3>
          </div>
          <div className="card-body" style={{ padding: '1rem' }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categories} cx="50%" cy="50%" outerRadius={100}
                  dataKey="value" labelLine={false} label={renderCustomLabel}
                >
                  {categories.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => [v.toLocaleString(), 'Seeds']} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: '12px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Monthly Performance Metrics</h3>
          <span className="badge badge-success">Growth View</span>
        </div>
        <div className="card-body" style={{ padding: '1rem' }}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growth} margin={{ top: 4, right: 20, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="repSeeds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="repVarieties" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1565C0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9E9E9E' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9E9E9E' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #eee', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{v}</span>} />
              <Area type="monotone" dataKey="seeds" stroke="#2E7D32" strokeWidth={2.5} fill="url(#repSeeds)" name="Seeds Added" />
              <Area type="monotone" dataKey="varieties" stroke="#1565C0" strokeWidth={2.5} fill="url(#repVarieties)" name="New Varieties" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Storage Utilization */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Storage Utilization Analytics</h3>
          <span className="badge badge-warning">Capacity tracking</span>
        </div>
        <div className="card-body">
          <div className="util-analysis-grid">
            {utilization.map(center => (
              <div key={center.name} className="util-analysis-card">
                <div className="util-analysis-header">
                  <div>
                    <span className="util-analysis-name">{center.name}</span>
                    <span className="util-analysis-capacity">{center.capacity.toLocaleString()} capacity</span>
                  </div>
                  <span className={`badge ${center.utilization >= 85 ? 'badge-error' : center.utilization >= 70 ? 'badge-warning' : 'badge-success'}`}>
                    {center.utilization}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '10px' }}>
                  <div
                    className={`progress-fill ${center.utilization >= 85 ? 'danger' : center.utilization >= 70 ? 'warning' : ''}`}
                    style={{ width: `${center.utilization}%` }}
                  />
                </div>
                <div className="util-analysis-meta">
                  <span>{center.used.toLocaleString()} seeds stored</span>
                  <span>{(center.capacity - center.used).toLocaleString()} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports History Archive Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Generated Reports Archive</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>Audit trail storage</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generator</th>
                <th>Generated Date</th>
                <th>File Link</th>
              </tr>
            </thead>
            <tbody>
              {reportsHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>
                    No reports generated yet. Click "Export CSV" to start.
                  </td>
                </tr>
              ) : reportsHistory.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📄</span>
                      <strong>{item.report_name}</strong>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{item.report_type}</span></td>
                  <td>{item.generator_name}</td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td>
                    <a 
                      href={`http://localhost:5000${item.file_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--primary)', fontWeight: 600 }}
                    >
                      ⬇️ Download File
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
