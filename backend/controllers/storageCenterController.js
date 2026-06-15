import pool from '../config/db.js';
import { logActivity } from '../services/activityLogService.js';

// @desc    Get all storage centers
// @route   GET /api/storage-centers
// @access  Private (Admin, Manager, Staff)
export const getStorageCenters = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM storage_center_details_view ORDER BY center_name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single storage center
// @route   GET /api/storage-centers/:id
// @access  Private (Admin, Manager, Staff)
export const getStorageCenterById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM storage_center_details_view WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Storage center not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create storage center
// @route   POST /api/storage-centers
// @access  Private (Admin, Manager)
export const createStorageCenter = async (req, res, next) => {
  const { center_name, location, capacity, utilization_percentage, manager_id } = req.body;

  try {
    // Validate manager exists and is a Manager or Admin
    if (manager_id) {
      const checkMgr = await pool.query('SELECT role FROM users WHERE id = $1', [manager_id]);
      if (checkMgr.rows.length === 0) {
        return res.status(400).json({ message: 'Assigned manager user not found' });
      }
    }

    const result = await pool.query(
      `INSERT INTO storage_centers (center_name, location, capacity, utilization_percentage, manager_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [center_name, location, capacity || 0, utilization_percentage || 0.00, manager_id || null]
    );

    const newCenter = result.rows[0];

    // Log storage center creation
    await logActivity(req.user.id, `Storage center created: ${newCenter.center_name}`, 'Storage Centers');

    res.status(201).json(newCenter);
  } catch (error) {
    next(error);
  }
};

// @desc    Update storage center
// @route   PUT /api/storage-centers/:id
// @access  Private (Admin, Manager)
export const updateStorageCenter = async (req, res, next) => {
  const { id } = req.params;
  const { center_name, location, capacity, utilization_percentage, manager_id } = req.body;

  try {
    // Check if storage center exists
    const checkCenter = await pool.query('SELECT center_name FROM storage_centers WHERE id = $1', [id]);
    if (checkCenter.rows.length === 0) {
      return res.status(404).json({ message: 'Storage center not found' });
    }

    if (manager_id) {
      const checkMgr = await pool.query('SELECT role FROM users WHERE id = $1', [manager_id]);
      if (checkMgr.rows.length === 0) {
        return res.status(400).json({ message: 'Assigned manager user not found' });
      }
    }

    const result = await pool.query(
      `UPDATE storage_centers 
       SET center_name = $1, location = $2, capacity = $3, 
           utilization_percentage = $4, manager_id = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [center_name, location, capacity, utilization_percentage, manager_id || null, id]
    );

    const updatedCenter = result.rows[0];

    // Log update
    await logActivity(req.user.id, `Storage center updated: ${updatedCenter.center_name}`, 'Storage Centers');

    res.json(updatedCenter);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete storage center
// @route   DELETE /api/storage-centers/:id
// @access  Private (Admin, Manager)
export const deleteStorageCenter = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if exists
    const checkCenter = await pool.query('SELECT center_name FROM storage_centers WHERE id = $1', [id]);
    if (checkCenter.rows.length === 0) {
      return res.status(404).json({ message: 'Storage center not found' });
    }

    const centerToDelete = checkCenter.rows[0];

    await pool.query('DELETE FROM storage_centers WHERE id = $1', [id]);

    // Log deletion
    await logActivity(req.user.id, `Storage center deleted: ${centerToDelete.center_name}`, 'Storage Centers');

    res.json({ message: 'Storage center deleted successfully' });
  } catch (error) {
    next(error);
  }
};
