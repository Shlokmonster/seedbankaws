import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function runSeed() {
  console.log('Starting SeedBank database seeding...');

  try {
    // 1. Insert Users
    console.log('Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    
    const usersData = [
      { name: 'Dr. Priya Sharma', email: 'priya@seedbank.gov', role: 'Admin', status: 'Active' },
      { name: 'Dr. Erik Hansen', email: 'erik@seedbank.gov', role: 'Manager', status: 'Active' },
      { name: 'Dr. Carlos Silva', email: 'carlos@seedbank.gov', role: 'Manager', status: 'Active' },
      { name: 'Dr. Yuki Tanaka', email: 'yuki@seedbank.gov', role: 'Manager', status: 'Active' },
      { name: 'Dr. Aisha Kouyate', email: 'aisha@seedbank.gov', role: 'Manager', status: 'Active' },
      { name: 'Dr. John Whitfield', email: 'john@seedbank.gov', role: 'Manager', status: 'Active' },
      { name: 'Amara Diallo', email: 'amara@seedbank.gov', role: 'Staff', status: 'Active' },
      { name: 'James Okonkwo', email: 'james@seedbank.gov', role: 'Staff', status: 'Inactive' }
    ];

    const usersMap = {};
    for (const u of usersData) {
      const res = await pool.query(
        `INSERT INTO users (name, email, password, role, status) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, status = EXCLUDED.status
         RETURNING id, email`,
        [u.name, u.email, passwordHash, u.role, u.status]
      );
      usersMap[u.email] = res.rows[0].id;
    }

    const priyaId = usersMap['priya@seedbank.gov'];
    const erikId = usersMap['erik@seedbank.gov'];
    const carlosId = usersMap['carlos@seedbank.gov'];
    const yukiId = usersMap['yuki@seedbank.gov'];
    const aishaId = usersMap['aisha@seedbank.gov'];
    const johnId = usersMap['john@seedbank.gov'];
    const amaraId = usersMap['amara@seedbank.gov'];

    // 2. Insert Seeds
    console.log('Seeding seeds...');
    const seedsData = [
      { seed_name: 'Oryza sativa (Indica)', species: 'Oryza sativa', genetic_category: 'Cereal', quantity: 12500, region: 'South Asia', preservation_status: 'Cryogenic', status: 'Active', description: 'High yield rice variant native to South Asia.', created_by: priyaId },
      { seed_name: 'Zea mays (Heirloom)', species: 'Zea mays', genetic_category: 'Cereal', quantity: 8300, region: 'North America', preservation_status: 'Cold Storage', status: 'Active', description: 'Traditional corn cultivar preserving ancient genetic traits.', created_by: erikId },
      { seed_name: 'Solanum lycopersicum', species: 'Solanum lycopersicum', genetic_category: 'Vegetable', quantity: 5200, region: 'Mediterranean', preservation_status: 'Cryogenic', status: 'Active', description: 'Wild tomato relative resilient to dry soil.', created_by: carlosId },
      { seed_name: 'Triticum aestivum', species: 'Triticum aestivum', genetic_category: 'Cereal', quantity: 21000, region: 'Central Asia', preservation_status: 'Cold Storage', status: 'Active', description: 'Standard common bread wheat variant.', created_by: priyaId },
      { seed_name: 'Phaseolus vulgaris', species: 'Phaseolus vulgaris', genetic_category: 'Legume', quantity: 3800, region: 'Latin America', preservation_status: 'Cryogenic', status: 'Endangered', description: 'Common bean, high protein selection.', created_by: carlosId },
      { seed_name: 'Sorghum bicolor', species: 'Sorghum bicolor', genetic_category: 'Cereal', quantity: 9100, region: 'Africa', preservation_status: 'Ambient', status: 'Active', description: 'Drought resistant cereal grain variant.', created_by: aishaId },
      { seed_name: 'Glycine max', species: 'Glycine max', genetic_category: 'Legume', quantity: 6700, region: 'East Asia', preservation_status: 'Cold Storage', status: 'Active', description: 'High yield soybean cultivar.', created_by: yukiId },
      { seed_name: 'Capsicum annuum', species: 'Capsicum annuum', genetic_category: 'Vegetable', quantity: 2900, region: 'Americas', preservation_status: 'Cryogenic', status: 'Critical', description: 'Mild chili pepper cultivar.', created_by: johnId },
      { seed_name: 'Helianthus annuus', species: 'Helianthus annuus', genetic_category: 'Oilseed', quantity: 4400, region: 'Europe', preservation_status: 'Cold Storage', status: 'Active', description: 'Common sunflower cultivar.', created_by: priyaId },
      { seed_name: 'Lens culinaris', species: 'Lens culinaris', genetic_category: 'Legume', quantity: 1800, region: 'Middle East', preservation_status: 'Cryogenic', status: 'Endangered', description: 'Traditional red lentil variant.', created_by: carlosId },
      { seed_name: 'Coffea arabica', species: 'Coffea arabica', genetic_category: 'Beverage', quantity: 3200, region: 'Ethiopia', preservation_status: 'Cold Storage', status: 'Active', description: 'Wild arabica coffee seeds.', created_by: amaraId },
      { seed_name: 'Mangifera indica', species: 'Mangifera indica', genetic_category: 'Fruit', quantity: 760, region: 'South Asia', preservation_status: 'Cryogenic', status: 'Critical', description: 'Alphonso mango genetic tissue samples.', created_by: priyaId }
    ];

    for (const s of seedsData) {
      await pool.query(
        `INSERT INTO seeds (seed_name, species, genetic_category, quantity, region, preservation_status, status, description, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [s.seed_name, s.species, s.genetic_category, s.quantity, s.region, s.preservation_status, s.status, s.description, s.created_by]
      );
    }

    // 3. Insert Storage Centers
    console.log('Seeding storage centers...');
    const storageCentersData = [
      { center_name: 'Arctic Vault Alpha', location: 'Svalbard, Norway', capacity: 100000, utilization_percentage: 72.00, manager_id: erikId },
      { center_name: 'Himalayan Biobank', location: 'Shimla, India', capacity: 50000, utilization_percentage: 77.00, manager_id: priyaId },
      { center_name: 'Amazon Diversity Hub', location: 'Manaus, Brazil', capacity: 35000, utilization_percentage: 84.00, manager_id: carlosId },
      { center_name: 'Sahel Resilience Center', location: 'Niamey, Niger', capacity: 25000, utilization_percentage: 33.00, manager_id: aishaId },
      { center_name: 'Pacific Rim Repository', location: 'Kagawa, Japan', capacity: 60000, utilization_percentage: 85.00, manager_id: yukiId },
      { center_name: 'Great Plains Seedbank', location: 'Nebraska, USA', capacity: 80000, utilization_percentage: 56.00, manager_id: johnId }
    ];

    for (const sc of storageCentersData) {
      await pool.query(
        `INSERT INTO storage_centers (center_name, location, capacity, utilization_percentage, manager_id) 
         VALUES ($1, $2, $3, $4, $5)`,
        [sc.center_name, sc.location, sc.capacity, sc.utilization_percentage, sc.manager_id]
      );
    }

    // 4. Insert Reports
    console.log('Seeding reports...');
    await pool.query(
      `INSERT INTO reports (report_name, report_type, generated_by, file_url)
       VALUES 
       ($1, $2, $3, $4),
       ($5, $6, $7, $8)`,
      [
        'Annual Genetic Diversity Audit 2025', 'Audit', priyaId, 'https://seedbank-s3.s3.amazonaws.com/reports/audit_2025.pdf',
        'Global Seed Inventory Report Q1', 'Inventory', erikId, 'https://seedbank-s3.s3.amazonaws.com/reports/inventory_q1_2026.pdf'
      ]
    );

    // 5. Insert Activity Logs
    console.log('Seeding activity logs...');
    const activityLogsData = [
      { user_id: priyaId, action: 'Login succeeded', module_name: 'Auth' },
      { user_id: priyaId, action: 'User Created: Amara Diallo (Staff)', module_name: 'User Management' },
      { user_id: erikId, action: 'Seed batch updated: Zea mays (Heirloom)', module_name: 'Seed Management' },
      { user_id: carlosId, action: 'Report generated: Annual Genetic Diversity Audit 2025', module_name: 'Reports' },
      { user_id: aishaId, action: 'Seed Created: Sorghum bicolor', module_name: 'Seed Management' }
    ];

    for (const log of activityLogsData) {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, module_name) VALUES ($1, $2, $3)`,
        [log.user_id, log.action, log.module_name]
      );
    }

    // 6. Insert Monitoring Metrics
    console.log('Seeding monitoring metrics...');
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const recordedAt = new Date(now.getTime() - i * 60 * 60 * 1000); // 1hr intervals
      await pool.query(
        `INSERT INTO monitoring_metrics (cpu_usage, memory_usage, disk_usage, network_usage, recorded_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          (30 + Math.random() * 20).toFixed(2),
          (55 + Math.random() * 15).toFixed(2),
          (70 + Math.random() * 5).toFixed(2),
          (35 + Math.random() * 15).toFixed(2),
          recordedAt
        ]
      );
    }

    console.log('Database successfully seeded with mock data!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

runSeed();
