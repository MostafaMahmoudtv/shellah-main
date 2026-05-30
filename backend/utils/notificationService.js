import Notification from '../models/Notification.js';

// إنشاء إشعار جديد
export const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// جلب إشعارات المشرفين
export const getAdminNotifications = async (role, limit = 50) => {
  const notifications = await Notification.find({
    forRoles: { $in: [role] }
  })
  .sort('-createdAt')
  .limit(limit)
  .populate('readBy.userId', 'name');
  
  return notifications;
};

// تحديد الإشعار كمقروء
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) return null;
  
  // Check if already read by this user
  const alreadyRead = notification.readBy.some(r => r.userId.toString() === userId.toString());
  if (!alreadyRead) {
    notification.readBy.push({ userId });
    notification.isRead = false; // Still unread for other admins
    await notification.save();
  }
  
  return notification;
};

// جلب عدد الإشعارات غير المقروءة للمشرف
export const getUnreadCount = async (userId, role) => {
  const count = await Notification.countDocuments({
    forRoles: { $in: [role] },
    'readBy.userId': { $ne: userId }
  });
  return count;
};