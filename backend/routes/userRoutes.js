import express from 'express';
import { body } from 'express-validator';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All user management routes require login and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['Admin', 'Manager', 'Staff']).withMessage('Invalid role, must be Admin, Manager or Staff'),
    body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status, must be Active or Inactive'),
    validate
  ],
  createUser
);

router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('role').isIn(['Admin', 'Manager', 'Staff']).withMessage('Invalid role, must be Admin, Manager or Staff'),
    body('status').isIn(['Active', 'Inactive']).withMessage('Invalid status, must be Active or Inactive'),
    body('password').optional().custom((val) => {
      if (val !== undefined && val.trim().length < 6 && val.trim() !== '') {
        throw new Error('Password must be at least 6 characters long if changing');
      }
      return true;
    }),
    validate
  ],
  updateUser
);

router.delete('/:id', deleteUser);

export default router;
