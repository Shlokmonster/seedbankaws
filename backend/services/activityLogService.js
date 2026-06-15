import pool from '../config/db.js';

export const logActivity = async (userId, action, moduleName) => {
  try {
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, module_name) VALUES ($1, $2, $3)',
      [userId, action, moduleName]
    );
  } catch (error) {
    console.error('Failed to write activity log:', error);
  }
};
