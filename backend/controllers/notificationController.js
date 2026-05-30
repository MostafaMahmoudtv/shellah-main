import Notification from '../models/Notification.js';
import { getAdminNotifications, markAsRead as markAsReadService, getUnreadCount as getUnreadCountService } from '../utils/notificationService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// جلب كل الإشعارات للمشرف
export const getNotifications = catchAsync(async (req, res) => {
  const { role } = req.user;
  const { limit = 50 } = req.query;
  
  const notifications = await getAdminNotifications(role, parseInt(limit));
  
  res.json({ 
    success: true, 
    count: notifications.length, 
    notifications 
  });
});

// تحديد إشعار كمقروء
export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  
  const notification = await markAsReadService(id, userId);
  
  if (!notification) {
    return next(new AppError('الإشعار غير موجود', 404));
  }
  
  res.json({ 
    success: true, 
    message: 'تم تحديد الإشعار كمقروء',
    notification 
  });
});

// جلب عدد الإشعارات غير المقروءة
export const getUnreadCount = catchAsync(async (req, res) => {
  const { _id: userId, role } = req.user;
  
  const count = await getUnreadCountService(userId, role);
  
  res.json({ 
    success: true, 
    unreadCount: count 
  });
});