import express from 'express';
import { getMyNotifications, markAsRead, getUnreadCount } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.get('/unread/count', getUnreadCount);

export default router;