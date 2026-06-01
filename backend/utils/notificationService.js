import Notification from '../models/Notification.js';
import User from '../models/User.js';

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

// إرسال إشعار جماعي لجميع المتبرعين
export const sendBroadcastToDonors = async (io, notificationData, senderId) => {
  try {
    // Get all donors
    const filter = { role: 'donor', isActive: true };
    
    if (notificationData.targetBloodType && notificationData.targetBloodType !== 'all') {
      filter.bloodType = notificationData.targetBloodType;
    }
    
    if (notificationData.targetWilaya && notificationData.targetWilaya !== 'all') {
      filter.wilaya = notificationData.targetWilaya;
    }
    
    const donors = await User.find(filter).select('_id name phone bloodType wilaya');
    
    // Create notification record
    const notification = await Notification.create({
      type: 'broadcast',
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      forRoles: ['donor'],
      sentBy: senderId,
      isBroadcast: true,
      targetBloodType: notificationData.targetBloodType || 'all',
      targetWilaya: notificationData.targetWilaya || 'all',
      sentTo: donors.map(donor => ({ userId: donor._id, isDelivered: false }))
    });
    
    // Send real-time notification via Socket.IO to all connected donors
    io.to('donors-room').emit('broadcast-notification', {
      notificationId: notification._id,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: notification.createdAt
    });
    
    // Update delivery status for connected donors (we'll mark them as delivered when they connect)
    
    return { success: true, notification, recipientsCount: donors.length };
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return { success: false, error: error.message };
  }
};

// جلب إشعارات المستخدم
export const getUserNotifications = async (userId, role, limit = 50) => {
  const notifications = await Notification.find({
    $or: [
      { forRoles: { $in: [role, 'all'] } },
      { 'sentTo.userId': userId }
    ]
  })
  .sort('-createdAt')
  .limit(limit)
  .populate('sentBy', 'name');
  
  return notifications;
};

// تحديد إشعار كمقروء
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) return null;
  
  const alreadyRead = notification.readBy.some(r => r.userId.toString() === userId.toString());
  if (!alreadyRead) {
    notification.readBy.push({ userId });
    await notification.save();
  }
  
  return notification;
};

// جلب عدد الإشعارات غير المقروءة
export const getUnreadCount = async (userId, role) => {
  const count = await Notification.countDocuments({
    $or: [
      { forRoles: { $in: [role, 'all'] } },
      { 'sentTo.userId': userId }
    ],
    'readBy.userId': { $ne: userId }
  });
  return count;
};

// تحديث حالة التسليم للمتبرع عند الاتصال
export const markAsDelivered = async (userId, notificationIds) => {
  await Notification.updateMany(
    { _id: { $in: notificationIds }, 'sentTo.userId': userId },
    { $set: { 'sentTo.$.isDelivered': true, 'sentTo.$.sentAt': new Date() } }
  );
};