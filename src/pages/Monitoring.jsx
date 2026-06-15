import { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { monitoringService } from '../services/api';
import './Monitoring.css';

const severityColors = {
  error: 'badge-error',
  warning: 'badge-warning',
  info: 'badge-info',
  success: 'badge-success',
};

const incidentSeverityColors = {
  High: 'badge-error',
  Medium: 'badge-warning',
  Low: 'badge-info',
};

const incidentStatusColors = {
  Resolved: 'badge-success',
  Monitoring: 'badge-warning',
  Open: 'badge-error',
};

function GaugeCard({ label, value, icon, color, bg, unit = '%', warning = 75, danger = 90 }) {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayVal(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  const status = displayVal >= danger ? 'critical' : displayVal >= warning ? 'warning' : 'normal';
  const statusText = { normal: 'Normal', warning: 'Elevated', critical: 'Critical' };

  const gaugeData = [
    { name: 'value', value: displayVal, fill: color },
    { name: 'remaining', value: 100 - displayVal, fill: '#f0f0f0' },
  ];

  return (
    <div className={`gauge-card gauge-${status}`}>
      <div className="gauge-header">
        <div className="gauge-icon" style={{ background: bg }}>{icon}</div>
        <div>
          <div className="gauge-label">{label}</div>
          <div className={`gauge-status ${status}`}>{statusText[status]}</div>
        </div>
      </div>
      <div className="gauge-chart-wrapper">
        <ResponsiveContainer width="100%" height={120}>
          <RadialBarChart cx="50%" cy="75%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={0} data={gaugeData}>
            <RadialBar minAngle={0} dataKey="value" cornerRadius={6} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="gauge-value-overlay">
          <span className="gauge-value" style={{ color }}>{displayVal}</span>
          <span className="gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="gauge-bar-wrapper">
        <div className="progress-bar">
          <div
            className={`progress-fill ${status === 'critical' ? 'danger' : status === 'warning' ? 'warning' : ''}`}
            style={{ width: `${displayVal}%`, background: color }}
          />
        </div>
        <div className="gauge-bar-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

export default function Monitoring() {
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, disk: 0, network: 0, uptime: '99.99%', lastBackup: '' });
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMonitoringData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setRefreshing(true);
    }
    setError('');

    try {
      const data = await monitoringService.getMetrics();
      setMetrics(data.systemHealth);
      setAlerts(data.monitoringAlerts);
      setIncidents(data.incidentHistory);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to query monitoring metrics:', err);
      setError('Could not retrieve live monitoring telemetry. Displaying local fallback metrics.');
      
      // Fallback
      setMetrics({ cpu: 45, memory: 67, disk: 81, network: 29, uptime: '99.98%', lastBackup: new Date().toISOString() });
      setAlerts([
        { id: 1, severity: 'warning', message: 'Disk space on Pacific Node is high', time: '1h ago' },
        { id: 2, severity: 'error', message: 'CPU temperature spike - Arctic Alpha', time: '5m ago' }
      ]);
      setIncidents([
        { id: 1, title: 'Temp spike - Arctic Node', severity: 'High', status: 'Resolved', duration: '2h', date: '2026-06-12' }
      ]);
    } finally {
      if (showRefreshIndicator) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchMonitoringData(false);
    
    // Auto-refresh metrics every 30 seconds
    const interval = setInterval(() => {
      fetchMonitoringData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchMonitoringData(true);
  };

  return (
    <div className="monitoring-page animate-slideUp">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Monitoring</h1>
          <p className="page-subtitle">
            Last updated: {lastRefresh.toLocaleTimeString()} &nbsp;•&nbsp; Uptime: {metrics.uptime}
          </p>
        </div>
        <button 
          className={`btn btn-secondary ${refreshing ? 'refreshing' : ''}`} 
          onClick={handleManualRefresh} 
          disabled={refreshing} 
          id="refresh-metrics-btn"
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Metrics'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Gauge Cards */}
      <div className="gauge-grid" style={{ marginBottom: '1.5rem' }}>
        <GaugeCard label="CPU Usage" value={metrics.cpu} icon="🖥️" color="#2E7D32" bg="#E8F5E9" warning={70} danger={90} />
        <GaugeCard label="Memory Usage" value={metrics.memory} icon="💾" color="#1565C0" bg="#E3F2FD" warning={75} danger={90} />
        <GaugeCard label="Disk Usage" value={metrics.disk} icon="💿" color="#F57F17" bg="#FFF8E1" warning={70} danger={85} />
        <GaugeCard label="Network Traffic" value={metrics.network} icon="🌐" color="#6A1B9A" bg="#F3E5F5" warning={60} danger={80} />
      </div>

      {/* Infrastructure Status */}
      <div className="monitoring-row" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Infrastructure Status</h3>
            <span className="badge badge-success">● All Nodes Healthy</span>
          </div>
          <div className="card-body">
            <div className="infra-grid">
              {[
                { name: 'Primary Database', status: 'Operational', latency: '12ms', region: 'us-east-1' },
                { name: 'API Gateway', status: 'Operational', latency: '8ms', region: 'global' },
                { name: 'Storage Layer', status: 'Operational', latency: '45ms', region: 'multi-region' },
                { name: 'Auth Service', status: 'Operational', latency: '15ms', region: 'us-west-2' },
                { name: 'CDN Network', status: 'Degraded', latency: '92ms', region: 'eu-west-1' },
                { name: 'Backup Service', status: 'Operational', latency: '120ms', region: 'ap-south-1' },
              ].map(node => (
                <div key={node.name} className="infra-node">
                  <div className={`infra-dot ${node.status === 'Operational' ? 'operational' : 'degraded'}`} />
                  <div className="infra-node-info">
                    <span className="infra-node-name">{node.name}</span>
                    <span className="infra-node-meta">{node.region} · {node.latency}</span>
                  </div>
                  <span className={`badge ${node.status === 'Operational' ? 'badge-success' : 'badge-warning'}`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Alerts</h3>
            <span className="badge badge-error">{alerts.length} issues</span>
          </div>
          <div className="card-body">
            <div className="alerts-list">
              {alerts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>🟢 No active warnings detected.</p>
              ) : alerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                  <div className="alert-item-icon">
                    {alert.severity === 'error' ? '🔴' : alert.severity === 'warning' ? '🟡' : alert.severity === 'success' ? '🟢' : '🔵'}
                  </div>
                  <div className="alert-item-content">
                    <p className="alert-item-message">{alert.message}</p>
                    <span className="alert-item-time">{alert.time}</span>
                  </div>
                  <span className={`badge ${severityColors[alert.severity]}`}>{alert.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Incident History</h3>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>Archived metrics</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table" id="incidents-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Incident</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-500)' }}>No logged incidents.</td>
                </tr>
              ) : incidents.map((inc, idx) => (
                <tr key={inc.id}>
                  <td style={{ color: 'var(--gray-400)', fontSize: 'var(--text-xs)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{inc.title}</td>
                  <td><span className={`badge ${incidentSeverityColors[inc.severity]}`}>{inc.severity}</span></td>
                  <td><span className={`badge ${incidentStatusColors[inc.status]}`}>{inc.status}</span></td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{inc.duration}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{inc.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
