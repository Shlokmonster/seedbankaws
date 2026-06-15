import express from 'express';
import { body } from 'express-validator';
import { getStorageCenters, getStorageCenterById, createStorageCenter, updateStorageCenter, deleteStorageCenter } from '../controllers/storageCenterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getStorageCenters);
router.get('/:id', getStorageCenterById);

// Admin and Manager can manage storage centers
router.post(
  '/',
  authorize('Admin', 'Manager'),
  [
    body('center_name').trim().notEmpty().withMessage('Center name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('utilization_percentage').isFloat({ min: 0, max: 100 }).withMessage('Utilization percentage must be between 0 and 100'),
    body('manager_id').optional({ nullable: true }).isUUID().withMessage('Invalid manager UUID format'),
    validate
  ],
  createStorageCenter
);

router.put(
  '/:id',
  authorize('Admin', 'Manager'),
  [
    body('center_name').trim().notEmpty().withMessage('Center name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
    body('utilization_percentage').isFloat({ min: 0, max: 100 }).withMessage('Utilization percentage must be between 0 and 100'),
    body('manager_id').optional({ nullable: true }).isUUID().withMessage('Invalid manager UUID format'),
    validate
  ],
  updateStorageCenter
);

router.delete('/:id', authorize('Admin', 'Manager'), deleteStorageCenter);

export default router;
