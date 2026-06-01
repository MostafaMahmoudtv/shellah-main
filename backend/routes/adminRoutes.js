import express from 'express';
import { getAllDonors, getDashboardStats, updateDonor, deleteDonor } from '../controllers/adminController.js';
import { sendNotification, sendNotificationToSpecific } from '../controllers/notificationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, restrictTo('admin', 'super_admin'));

// Donor management
router.get('/donors', getAllDonors);
router.get('/stats', getDashboardStats);
router.put('/donors/:id', updateDonor);
router.delete('/donors/:id', deleteDonor);

// Send notification to ALL donors (Body)
router.post('/send-notification', sendNotification);

// Send notification to SPECIFIC donor (Params)
router.post('/send-notification/:recipientId', sendNotificationToSpecific);

export default router;