import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  getUnreadCount 
} from '../controllers/notificationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// كل الروتات دي تحتاج تسجيل دخول ودور admin أو super_admin
router.use(protect, restrictTo('admin', 'super_admin'));

// جلب كل الإشعارات
router.get('/', getNotifications);

// تحديد إشعار كمقروء
router.put('/:id/read', markAsRead);

// جلب عدد الإشعارات غير المقروءة
router.get('/unread/count', getUnreadCount);

export default router;