import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  getUnreadCount,
  markAllAsRead
} from '../controllers/notificationController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// =========================
// Routes
// =========================
router.get('/', getMyNotifications);

router.get('/unread/count', getUnreadCount);

router.put('/:id/read', markAsRead);

router.put('/mark-all-read', markAllAsRead);

export default router;