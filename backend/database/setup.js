import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  console.log('Starting SeedBank database schema setup...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL commands
    await pool.query(schemaSql);
    console.log('Database tables, constraints, indexes, and views successfully created!');
  } catch (error) {
    console.error('Error during database schema setup:', error);
  } finally {
    await pool.end();
  }
}

runSetup();
