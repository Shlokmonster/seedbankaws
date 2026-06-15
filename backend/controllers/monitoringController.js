import pool from '../config/db.js';

// @desc    Get system health and resource metrics
// @route   GET /api/monitoring
// @access  Private (Admin, Manager)
export const getMetrics = async (req, res, next) => {
  try {
    // Fetch last 15 metric records ordered by recorded_at ascending for charts
    const metricsResult = await pool.query(
      `SELECT cpu_usage as cpu, memory_usage as memory, disk_usage as disk, network_usage as network, recorded_at as time 
       FROM monitoring_metrics 
       ORDER BY recorded_at DESC 
       LIMIT 15`
    );

    // Format time strings (e.g. HH:MM)
    const metrics = metricsResult.rows.reverse().map(m => ({
      ...m,
      cpu: parseFloat(m.cpu),
      memory: parseFloat(m.memory),
      disk: parseFloat(m.disk),
      network: parseFloat(m.network),
      time: new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    // Get current system health (the latest record)
    const currentHealthResult = await pool.query(
      `SELECT cpu_usage, memory_usage, disk_usage, network_usage, recorded_at 
       FROM monitoring_metrics 
       ORDER BY recorded_at DESC 
       LIMIT 1`
    );

    let systemHealth = { cpu: 0, memory: 0, disk: 0, network: 0, uptime: '99.99%', lastBackup: new Date().toISOString() };
    if (currentHealthResult.rows.length > 0) {
      const current = currentHealthResult.rows[0];
      systemHealth = {
        cpu: parseFloat(current.cpu_usage),
        memory: parseFloat(current.memory_usage),
        disk: parseFloat(current.disk_usage),
        network: parseFloat(current.network_usage),
        uptime: '99.99%',
        lastBackup: new Date(new Date().getTime() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      };
    }

    // Static alerts for monitoring dashboard (simulating alerts dynamically based on high CPU/Memory/Disk values)
    const monitoringAlerts = [];
    if (systemHealth.disk > 75) {
      monitoringAlerts.push({
        id: 1,
        severity: 'warning',
        message: `Disk usage at Pacific Rim Repository is high (${systemHealth.disk}%)`,
        time: '30 min ago'
      });
    }
    monitoringAlerts.push({
      id: 2,
      severity: 'info',
      message: 'Scheduled maintenance window for Arctic Vault Alpha begins in 48h',
      time: '2 hours ago'
    });
    if (systemHealth.cpu > 80) {
      monitoringAlerts.push({
        id: 3,
        severity: 'error',
        message: `CPU utilization spike detected (${systemHealth.cpu}%)`,
        time: 'Just now'
      });
    }
    monitoringAlerts.push({
      id: 4,
      severity: 'success',
      message: 'Monthly backup completed successfully across all nodes',
      time: '1 day ago'
    });

    // Incident history (simulated for tracking purposes)
    const incidentHistory = [
      { id: 1, title: 'Temperature Fluctuation - Arctic Vault', severity: 'High', status: 'Resolved', duration: '2h 15m', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 2, title: 'Network Latency Spike - Pacific Node', severity: 'Medium', status: 'Resolved', duration: '45m', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { id: 3, title: 'Disk Space Warning - Amazon Hub', severity: 'Low', status: 'Monitoring', duration: 'Ongoing', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
    ];

    res.json({
      metrics,
      systemHealth,
      monitoringAlerts,
      incidentHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record new system health metrics (usually by daemon)
// @route   POST /api/monitoring
// @access  Private (Admin)
export const createMetric = async (req, res, next) => {
  const { cpu_usage, memory_usage, disk_usage, network_usage } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO monitoring_metrics (cpu_usage, memory_usage, disk_usage, network_usage)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cpu_usage, memory_usage, disk_usage, network_usage || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
