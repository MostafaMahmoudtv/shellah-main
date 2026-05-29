import express from 'express';
import { getAllDonors, updateDonor, deleteDonor } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, restrictTo('admin', 'super_admin'));
// المتبرعين
router.get('/donors', getAllDonors);
// router.get('/stats', getDashboardStats);
router.put('/donors/:id', updateDonor);
router.delete('/donors/:id', deleteDonor);

export default router;