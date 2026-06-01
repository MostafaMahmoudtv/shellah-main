import Notification from '../models/Notification.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    إرسال إشعار لكل المتبرعين (recipientId في الـ Body)
export const sendNotification = catchAsync(async (req, res, next) => {
  const { message, title } = req.body;
  
  const finalMessage = message || '📢 لديك إشعار جديد من إدارة بنك الدم';
  const finalTitle = title || '📢 إشعار جديد';
  
  const io = req.app.get('io');
  const sender = req.user;
  
  const allDonors = await User.find({ role: 'donor', isActive: true });
  
  const notification = await Notification.create({
    title: finalTitle,
    message: finalMessage,
    sender: sender._id,
    recipient: null,
    isForAll: true
  });
  
  // إرسال إشعار لكل متبرع
  allDonors.forEach(donor => {
    io.to(`user-${donor._id}`).emit('new-notification', {
      notificationId: notification._id,
      title: finalTitle,
      message: finalMessage,
      createdAt: notification.createdAt
    });
  });
  
  res.status(201).json({
    success: true,
    message: `تم إرسال الإشعار إلى ${allDonors.length} متبرع`,
    notification
  });
});

// @desc    إرسال إشعار لمتبرع معين (recipientId في الـ Params)
export const sendNotificationToSpecific = catchAsync(async (req, res, next) => {
  const { recipientId } = req.params;  // ✅ من الـ Params مش Body
  const { message, title } = req.body;
  
  const finalMessage = message || '📢 لديك إشعار جديد من إدارة بنك الدم';
  const finalTitle = title || '📢 إشعار جديد';
  
  const io = req.app.get('io');
  const sender = req.user;
  
  // التحقق من وجود المتبرع
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new AppError('المتبرع غير موجود', 404));
  }
  
  const notification = await Notification.create({
    title: finalTitle,
    message: finalMessage,
    sender: sender._id,
    recipient: recipientId,
    isForAll: false
  });
  
  // إرسال إشعار للمتبرع المحدد فقط
  io.to(`user-${recipientId}`).emit('new-notification', {
    notificationId: notification._id,
    title: finalTitle,
    message: finalMessage,
    createdAt: notification.createdAt
  });
  
  res.status(201).json({
    success: true,
    message: `تم إرسال الإشعار إلى ${recipient.name}`,
    notification
  });
});

// باقي الدوال كما هي (getMyNotifications, markAsRead, getUnreadCount)
export const getMyNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;
  
  const notifications = await Notification.find({
    $or: [
      { isForAll: true },
      { recipient: userId }
    ]
  })
  .sort('-createdAt')
  .populate('sender', 'name');
  
  res.json({
    success: true,
    count: notifications.length,
    notifications
  });
});

export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const notification = await Notification.findById(id);
  if (!notification) {
    return next(new AppError('الإشعار غير موجود', 404));
  }
  
  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }
  
  res.json({
    success: true,
    message: 'تم تحديد الإشعار كمقروء'
  });
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const userId = req.user._id;
  
  const count = await Notification.countDocuments({
    $or: [
      { isForAll: true },
      { recipient: userId }
    ],
    readBy: { $ne: userId }
  });
  
  res.json({
    success: true,
    unreadCount: count
  });
});