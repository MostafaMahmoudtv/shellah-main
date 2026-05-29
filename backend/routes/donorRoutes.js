import express from 'express';
import { searchDonors, getAllDonors,updateDonorProfile,deleteDonorProfile} from '../controllers/donorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// البحث عن متبرعين (أي حد يقدر يستخدمها)
router.get('/search', searchDonors);

// اللي تحتاج تسجيل دخول
router.use(protect);

router.get('/all',  getAllDonors);
router.put('/update', restrictTo('donor'),updateDonorProfile);
router.delete('/delete', restrictTo('donor'), deleteDonorProfile);

export default router;