import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function exportBackup() {
  console.log('Initiating database export backup...');
  
  const tables = [
    'users',
    'seeds',
    'storage_centers',
    'reports',
    'activity_logs',
    'monitoring_metrics'
  ];

  try {
    const backupData = {
      timestamp: new Date().toISOString(),
      database: 'seedbank_cloud',
      tables: {}
    };

    // Query and serialize data from all tables
    for (const table of tables) {
      console.log(`Exporting table: ${table}...`);
      const result = await pool.query(`SELECT * FROM ${table}`);
      backupData.tables[table] = result.rows;
    }

    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-seedbank-${timestamp}.json`;
    const filePath = path.join(backupsDir, filename);

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), 'utf8');
    
    console.log('--------------------------------------------------');
    console.log(`Backup completed successfully!`);
    console.log(`Saved to: ${filePath}`);
    console.log(`Total records backed up:`);
    Object.keys(backupData.tables).forEach(t => {
      console.log(` - ${t}: ${backupData.tables[t].length} records`);
    });
    console.log('--------------------------------------------------');

  } catch (error) {
    console.error('Error occurred during database backup:', error);
  } finally {
    await pool.end();
  }
}

exportBackup();
