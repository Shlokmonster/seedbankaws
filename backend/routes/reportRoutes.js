import express from 'express';
import { body } from 'express-validator';
import { getReports, generateReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import upload from '../utils/upload.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Manager'));

router.get('/', getReports);

router.post(
  '/',
  upload.single('file'),
  [
    body('report_name').optional().trim().notEmpty().withMessage('Report name cannot be empty'),
    body('report_type').optional().trim().notEmpty().withMessage('Report type cannot be empty'),
    validate
  ],
  generateReport
);

export default router;
