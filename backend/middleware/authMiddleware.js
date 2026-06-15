import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database
      const userRes = await pool.query(
        'SELECT id, name, email, role, status FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userRes.rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      const user = userRes.rows[0];

      if (user.status === 'Inactive') {
        return res.status(403).json({ message: 'User account is inactive. Access denied.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
