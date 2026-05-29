import express from 'express';
import { searchDonors, getAllDonors, getStats } from '../controllers/donorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// البحث عن متبرعين (أي حد يقدر يستخدمها)
router.get('/search', searchDonors);

// اللي تحتاج تسجيل دخول
router.use(protect);

router.get('/all', restrictTo('admin', 'super_admin'), getAllDonors);
router.get('/stats', restrictTo('admin', 'super_admin'), getStats);

export default router;