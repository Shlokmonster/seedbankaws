import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { logActivity } from '../services/activityLogService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin, Manager)
export const getReports = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as generator_name 
       FROM reports r
       LEFT JOIN users u ON r.generated_by = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate / Upload a report
// @route   POST /api/reports
// @access  Private (Admin, Manager)
export const generateReport = async (req, res, next) => {
  const { report_name, report_type } = req.body;

  try {
    let fileUrl = '';
    const name = report_name || `Inventory Report ${new Date().toISOString().split('T')[0]}`;
    const type = report_type || 'Inventory';

    if (req.file) {
      // If a file was uploaded manually
      fileUrl = `/uploads/${req.file.filename}`;
    } else {
      // Automatically generate a CSV report with live seeds inventory data
      console.log('Generating automated CSV report...');
      const seedsResult = await pool.query(
        'SELECT seed_name, species, genetic_category, quantity, region, preservation_status, status FROM seeds ORDER BY seed_name ASC'
      );

      // Create CSV content
      let csvContent = 'Seed Name,Species,Genetic Category,Quantity,Region,Preservation Status,Status\n';
      seedsResult.rows.forEach(seed => {
        csvContent += `"${seed.seed_name}","${seed.species}","${seed.genetic_category}",${seed.quantity},"${seed.region}","${seed.preservation_status}","${seed.status}"\n`;
      });

      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `report-inventory-${Date.now()}.csv`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, csvContent, 'utf8');
      
      fileUrl = `/uploads/${filename}`;
    }

    const result = await pool.query(
      `INSERT INTO reports (report_name, report_type, generated_by, file_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, type, req.user.id, fileUrl]
    );

    const report = result.rows[0];

    // Log report generation activity
    await logActivity(req.user.id, `Report generated: ${report.report_name} (${report.report_type})`, 'Reports');

    res.status(201).json({
      message: 'Report generated successfully',
      report: {
        ...report,
        generator_name: req.user.name
      }
    });
  } catch (error) {
    next(error);
  }
};
