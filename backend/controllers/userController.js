import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { logActivity } from '../services/activityLogService.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  const { name, email, password, role, status } = req.body;

  try {
    // Check if email already registered
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'password123', salt);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, status, created_at`,
      [name, email, passwordHash, role, status || 'Active']
    );

    const newUser = result.rows[0];

    // Log user creation
    await logActivity(req.user.id, `Created user: ${newUser.name} (${newUser.email}) as ${newUser.role}`, 'User Management');

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, status, password } = req.body;

  try {
    // Find user
    const checkUser = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let queryText = 'UPDATE users SET name = $1, email = $2, role = $3, status = $4, updated_at = NOW()';
    let params = [name, email, role, status];

    // If new password is provided, hash it and update it
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      queryText += ', password = $5 WHERE id = $6 RETURNING id, name, email, role, status, updated_at';
      params.push(passwordHash, id);
    } else {
      queryText += ' WHERE id = $5 RETURNING id, name, email, role, status, updated_at';
      params.push(id);
    }

    const result = await pool.query(queryText, params);
    const updatedUser = result.rows[0];

    // Log update activity
    await logActivity(req.user.id, `Updated user: ${updatedUser.name} (${updatedUser.email})`, 'User Management');

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if user exists first
    const checkUser = await pool.query('SELECT name, email FROM users WHERE id = $1', [id]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userToDelete = checkUser.rows[0];

    // Prevent Admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    // Log user delete activity
    await logActivity(req.user.id, `Deleted user: ${userToDelete.name} (${userToDelete.email})`, 'User Management');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
