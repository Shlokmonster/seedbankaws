// Mock Data for SeedBank Genetic Resource Cloud

export const mockUser = {
  id: 1,
  name: 'Dr. Priya Sharma',
  email: 'priya.sharma@seedbank.gov',
  role: 'Admin',
  avatar: null,
  department: 'Genetic Resources Division',
  lastLogin: '2026-06-14T10:30:00Z',
};

export const mockSeeds = [
  { id: 1, name: 'Oryza sativa (Indica)', species: 'Oryza sativa', category: 'Cereal', quantity: 12500, region: 'South Asia', status: 'Active', addedDate: '2026-01-15', preservationStatus: 'Cryogenic' },
  { id: 2, name: 'Zea mays (Heirloom)', species: 'Zea mays', category: 'Cereal', quantity: 8300, region: 'North America', status: 'Active', addedDate: '2026-02-20', preservationStatus: 'Cold Storage' },
  { id: 3, name: 'Solanum lycopersicum', species: 'Solanum lycopersicum', category: 'Vegetable', quantity: 5200, region: 'Mediterranean', status: 'Active', addedDate: '2026-01-08', preservationStatus: 'Cryogenic' },
  { id: 4, name: 'Triticum aestivum', species: 'Triticum aestivum', category: 'Cereal', quantity: 21000, region: 'Central Asia', status: 'Active', addedDate: '2025-11-30', preservationStatus: 'Cold Storage' },
  { id: 5, name: 'Phaseolus vulgaris', species: 'Phaseolus vulgaris', category: 'Legume', quantity: 3800, region: 'Latin America', status: 'Endangered', addedDate: '2026-03-05', preservationStatus: 'Cryogenic' },
  { id: 6, name: 'Sorghum bicolor', species: 'Sorghum bicolor', category: 'Cereal', quantity: 9100, region: 'Africa', status: 'Active', addedDate: '2025-12-12', preservationStatus: 'Ambient' },
  { id: 7, name: 'Glycine max', species: 'Glycine max', category: 'Legume', quantity: 6700, region: 'East Asia', status: 'Active', addedDate: '2026-04-18', preservationStatus: 'Cold Storage' },
  { id: 8, name: 'Capsicum annuum', species: 'Capsicum annuum', category: 'Vegetable', quantity: 2900, region: 'Americas', status: 'Critical', addedDate: '2026-05-01', preservationStatus: 'Cryogenic' },
  { id: 9, name: 'Helianthus annuus', species: 'Helianthus annuus', category: 'Oilseed', quantity: 4400, region: 'Europe', status: 'Active', addedDate: '2026-02-14', preservationStatus: 'Cold Storage' },
  { id: 10, name: 'Lens culinaris', species: 'Lens culinaris', category: 'Legume', quantity: 1800, region: 'Middle East', status: 'Endangered', addedDate: '2026-03-22', preservationStatus: 'Cryogenic' },
  { id: 11, name: 'Coffea arabica', species: 'Coffea arabica', category: 'Beverage', quantity: 3200, region: 'Ethiopia', status: 'Active', addedDate: '2026-01-28', preservationStatus: 'Cold Storage' },
  { id: 12, name: 'Mangifera indica', species: 'Mangifera indica', category: 'Fruit', quantity: 760, region: 'South Asia', status: 'Critical', addedDate: '2026-05-10', preservationStatus: 'Cryogenic' },
];

export const mockStorageCenters = [
  { id: 1, name: 'Arctic Vault Alpha', location: 'Svalbard, Norway', capacity: 100000, used: 72000, manager: 'Dr. Erik Hansen', status: 'Operational', temp: '-18°C', established: '2020-03-01' },
  { id: 2, name: 'Himalayan Biobank', location: 'Shimla, India', capacity: 50000, used: 38500, manager: 'Dr. Priya Sharma', status: 'Operational', temp: '-10°C', established: '2019-07-15' },
  { id: 3, name: 'Amazon Diversity Hub', location: 'Manaus, Brazil', capacity: 35000, used: 29400, manager: 'Dr. Carlos Silva', status: 'Operational', temp: '4°C', established: '2021-01-20' },
  { id: 4, name: 'Sahel Resilience Center', location: 'Niamey, Niger', capacity: 25000, used: 8200, manager: 'Dr. Aisha Kouyate', status: 'Operational', temp: '4°C', established: '2022-05-10' },
  { id: 5, name: 'Pacific Rim Repository', location: 'Kagawa, Japan', capacity: 60000, used: 51000, manager: 'Dr. Yuki Tanaka', status: 'Maintenance', temp: '-15°C', established: '2018-09-12' },
  { id: 6, name: 'Great Plains Seedbank', location: 'Nebraska, USA', capacity: 80000, used: 44800, manager: 'Dr. John Whitfield', status: 'Operational', temp: '-18°C', established: '2017-04-22' },
];

export const mockUsers = [
  { id: 1, name: 'Dr. Priya Sharma', email: 'priya@seedbank.gov', role: 'Admin', status: 'Active', department: 'Genetic Resources', lastLogin: '2026-06-14', avatar: null },
  { id: 2, name: 'Dr. Erik Hansen', email: 'erik@seedbank.gov', role: 'Manager', status: 'Active', department: 'Storage Operations', lastLogin: '2026-06-13', avatar: null },
  { id: 3, name: 'Dr. Carlos Silva', email: 'carlos@seedbank.gov', role: 'Manager', status: 'Active', department: 'Research', lastLogin: '2026-06-14', avatar: null },
  { id: 4, name: 'Amara Diallo', email: 'amara@seedbank.gov', role: 'Staff', status: 'Active', department: 'Cataloging', lastLogin: '2026-06-12', avatar: null },
  { id: 5, name: 'Dr. Yuki Tanaka', email: 'yuki@seedbank.gov', role: 'Manager', status: 'Active', department: 'Pacific Operations', lastLogin: '2026-06-11', avatar: null },
  { id: 6, name: 'James Okonkwo', email: 'james@seedbank.gov', role: 'Staff', status: 'Inactive', department: 'Field Collection', lastLogin: '2026-05-30', avatar: null },
  { id: 7, name: 'Dr. Aisha Kouyate', email: 'aisha@seedbank.gov', role: 'Manager', status: 'Active', department: 'Sahel Operations', lastLogin: '2026-06-13', avatar: null },
  { id: 8, name: 'Dr. John Whitfield', email: 'john@seedbank.gov', role: 'Manager', status: 'Active', department: 'Americas Division', lastLogin: '2026-06-14', avatar: null },
];

export const seedsByRegion = [
  { region: 'South Asia', count: 13260 },
  { region: 'Central Asia', count: 21000 },
  { region: 'Africa', count: 9100 },
  { region: 'East Asia', count: 6700 },
  { region: 'Americas', count: 11700 },
  { region: 'Europe', count: 4400 },
  { region: 'Mediterranean', count: 5200 },
  { region: 'Middle East', count: 1800 },
];

export const seedsByCategory = [
  { name: 'Cereal', value: 50900 },
  { name: 'Legume', value: 12300 },
  { name: 'Vegetable', value: 8100 },
  { name: 'Oilseed', value: 4400 },
  { name: 'Fruit', value: 760 },
  { name: 'Beverage', value: 3200 },
];

export const monthlyGrowth = [
  { month: 'Jan', seeds: 4200, varieties: 18 },
  { month: 'Feb', seeds: 3800, varieties: 14 },
  { month: 'Mar', seeds: 5100, varieties: 22 },
  { month: 'Apr', seeds: 4700, varieties: 19 },
  { month: 'May', seeds: 6300, varieties: 28 },
  { month: 'Jun', seeds: 5800, varieties: 24 },
  { month: 'Jul', seeds: 7200, varieties: 31 },
  { month: 'Aug', seeds: 6900, varieties: 29 },
  { month: 'Sep', seeds: 8100, varieties: 35 },
  { month: 'Oct', seeds: 7500, varieties: 32 },
  { month: 'Nov', seeds: 9200, varieties: 40 },
  { month: 'Dec', seeds: 8700, varieties: 37 },
];

export const recentActivity = [
  { id: 1, action: 'New seed batch added', user: 'Dr. Priya Sharma', seed: 'Oryza sativa (Indica)', center: 'Himalayan Biobank', time: '2 hours ago', type: 'add' },
  { id: 2, action: 'Storage center updated', user: 'Dr. Erik Hansen', seed: '-', center: 'Arctic Vault Alpha', time: '4 hours ago', type: 'update' },
  { id: 3, action: 'Critical alert triggered', user: 'System', seed: 'Capsicum annuum', center: 'Amazon Diversity Hub', time: '6 hours ago', type: 'alert' },
  { id: 4, action: 'Seed variety exported', user: 'Dr. Carlos Silva', seed: 'Glycine max', center: 'Pacific Rim Repository', time: '8 hours ago', type: 'export' },
  { id: 5, action: 'New user registered', user: 'Admin', seed: '-', center: '-', time: '1 day ago', type: 'user' },
  { id: 6, action: 'Backup completed', user: 'System', seed: '-', center: 'All Centers', time: '1 day ago', type: 'backup' },
];

export const systemHealth = {
  cpu: 34,
  memory: 61,
  disk: 78,
  network: 42,
  uptime: '99.98%',
  lastBackup: '2026-06-14T02:00:00Z',
};

export const monitoringAlerts = [
  { id: 1, severity: 'warning', message: 'Disk usage at Pacific Rim Repository approaching 85%', time: '30 min ago' },
  { id: 2, severity: 'info', message: 'Scheduled maintenance window for Arctic Vault Alpha begins in 48h', time: '2 hours ago' },
  { id: 3, severity: 'error', message: 'Temperature sensor offline at Sahel Center - Sector 3', time: '5 hours ago' },
  { id: 4, severity: 'success', message: 'Monthly backup completed successfully across all nodes', time: '1 day ago' },
];

export const incidentHistory = [
  { id: 1, title: 'Temperature Fluctuation - Arctic Vault', severity: 'High', status: 'Resolved', duration: '2h 15m', date: '2026-06-10' },
  { id: 2, title: 'Network Latency Spike - Pacific Node', severity: 'Medium', status: 'Resolved', duration: '45m', date: '2026-06-08' },
  { id: 3, title: 'Disk Space Warning - Amazon Hub', severity: 'Low', status: 'Monitoring', duration: 'Ongoing', date: '2026-06-12' },
  { id: 4, title: 'Auth Service Degradation', severity: 'High', status: 'Resolved', duration: '1h 5m', date: '2026-05-28' },
];

export const storageUtilization = [
  { name: 'Arctic Vault Alpha', utilization: 72, capacity: 100000, used: 72000 },
  { name: 'Himalayan Biobank', utilization: 77, capacity: 50000, used: 38500 },
  { name: 'Amazon Diversity Hub', utilization: 84, capacity: 35000, used: 29400 },
  { name: 'Sahel Resilience Center', utilization: 33, capacity: 25000, used: 8200 },
  { name: 'Pacific Rim Repository', utilization: 85, capacity: 60000, used: 51000 },
  { name: 'Great Plains Seedbank', utilization: 56, capacity: 80000, used: 44800 },
];

export const CHART_COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#00897B', '#1565C0', '#6A1B9A', '#F57F17', '#0097A7'];

export const REGIONS = ['South Asia', 'Central Asia', 'Africa', 'East Asia', 'North America', 'Latin America', 'Europe', 'Mediterranean', 'Middle East', 'Pacific', 'Americas', 'Ethiopia'];
export const CATEGORIES = ['Cereal', 'Legume', 'Vegetable', 'Oilseed', 'Fruit', 'Beverage', 'Herb', 'Fiber'];
export const PRESERVATION_STATUSES = ['Cryogenic', 'Cold Storage', 'Ambient', 'Controlled Atmosphere'];
export const SEED_STATUSES = ['Active', 'Endangered', 'Critical', 'Archived'];
export const ROLES = ['Admin', 'Manager', 'Staff'];
