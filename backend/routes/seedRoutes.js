import express from 'express';
import { body } from 'express-validator';
import { getSeeds, getSeedById, createSeed, updateSeed, deleteSeed } from '../controllers/seedController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSeeds);
router.get('/:id', getSeedById);

// Staff can add/update seeds, but only Admin and Manager can delete
router.post(
  '/',
  authorize('Admin', 'Manager', 'Staff'),
  [
    body('seed_name').trim().notEmpty().withMessage('Seed name is required'),
    body('species').trim().notEmpty().withMessage('Species scientific name is required'),
    body('genetic_category').trim().notEmpty().withMessage('Genetic category is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('region').trim().notEmpty().withMessage('Region is required'),
    body('preservation_status').trim().notEmpty().withMessage('Preservation status is required'),
    body('status').optional().isIn(['Active', 'Endangered', 'Critical', 'Archived']).withMessage('Invalid seed status'),
    body('description').optional().trim(),
    validate
  ],
  createSeed
);

router.put(
  '/:id',
  authorize('Admin', 'Manager', 'Staff'),
  [
    body('seed_name').trim().notEmpty().withMessage('Seed name is required'),
    body('species').trim().notEmpty().withMessage('Species scientific name is required'),
    body('genetic_category').trim().notEmpty().withMessage('Genetic category is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('region').trim().notEmpty().withMessage('Region is required'),
    body('preservation_status').trim().notEmpty().withMessage('Preservation status is required'),
    body('status').isIn(['Active', 'Endangered', 'Critical', 'Archived']).withMessage('Invalid seed status'),
    body('description').optional().trim(),
    validate
  ],
  updateSeed
);

router.delete('/:id', authorize('Admin', 'Manager'), deleteSeed);

export default router;
