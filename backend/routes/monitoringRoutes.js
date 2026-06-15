import express from 'express';
import { body } from 'express-validator';
import { getMetrics, createMetric } from '../controllers/monitoringController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin', 'Manager'), getMetrics);

router.post(
  '/',
  authorize('Admin'),
  [
    body('cpu_usage').isFloat({ min: 0, max: 100 }).withMessage('CPU usage must be between 0 and 100'),
    body('memory_usage').isFloat({ min: 0, max: 100 }).withMessage('Memory usage must be between 0 and 100'),
    body('disk_usage').isFloat({ min: 0, max: 100 }).withMessage('Disk usage must be between 0 and 100'),
    body('network_usage').optional().isFloat({ min: 0 }).withMessage('Network usage must be a non-negative number'),
    validate
  ],
  createMetric
);

export default router;
