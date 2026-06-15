import express from 'express';
import { getSeedsByRegion, getSeedsByCategory, getMonthlyGrowth, getStorageUtilization } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/seeds-by-region', getSeedsByRegion);
router.get('/seeds-by-category', getSeedsByCategory);
router.get('/monthly-growth', getMonthlyGrowth);
router.get('/storage-utilization', getStorageUtilization);

export default router;
