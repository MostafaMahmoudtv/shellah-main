import express from 'express';
import {
  searchDonors,
  getAllDonors,
  updateDonorProfile,
  deleteDonorProfile,
  getDonorStats,
  softdeleteDonorProfile,
  changePassword
} from '../controllers/donorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// البحث عن متبرعين (أي حد يقدر يستخدمها)
router.get('/search', searchDonors);

// اللي تحتاج تسجيل دخول
router.use(protect);

router.get('/all',  getAllDonors);
router.get("/DonorStats", getDonorStats);
router.put('/update', restrictTo('donor', 'admin'), updateDonorProfile);
router.delete('/delete', restrictTo('donor', 'admin'), deleteDonorProfile);
router.delete('/soft-delete', restrictTo('donor', 'admin'), softdeleteDonorProfile);
router.put(
  '/change-password',
  restrictTo('donor', 'admin'),
  changePassword
);
export default router;