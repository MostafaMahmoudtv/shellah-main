import Notification from '../models/Notification.js';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';


// =========================
// إرسال إشعار لكل المتبرعين
// =========================
export const sendNotification = catchAsync(async (req, res) => {
  const { message, title } = req.body;

  const finalMessage =
    message?.trim() || '📢 لديك إشعار جديد من إدارة بنك الدم';

  const finalTitle =
    title?.trim() || '📢 إشعار جديد';

  const io = req.app.get('io');
  const sender = req.user;

  const allDonors = await User.find({
    role: 'donor',
    isActive: true,
  });

  const notification = await Notification.create({
    title: finalTitle,
    message: finalMessage,
    sender: sender._id,
    recipient: null,
    isForAll: true,
  });

  // إرسال real-time لكل المتبرعين
  allDonors.forEach((donor) => {
    io.to(`user-${donor._id}`).emit('new-notification', {
      notificationId: notification._id,
      title: finalTitle,
      message: finalMessage,
      createdAt: notification.createdAt,
    });
  });

  res.status(201).json({
    success: true,
    message: `تم إرسال الإشعار إلى ${allDonors.length} متبرع`,
    notification,
  });
});


// =========================
// إرسال إشعار لمتبرع معين
// =========================
export const sendNotificationToSpecific = catchAsync(async (req, res, next) => {
  const { recipientId } = req.params;
  const { message, title } = req.body;

  const finalMessage =
    message?.trim() || '📢 لديك إشعار جديد من إدارة بنك الدم';

  const finalTitle =
    title?.trim() || '📢 إشعار جديد';

  const io = req.app.get('io');
  const sender = req.user;

  const recipient = await User.findById(recipientId);

  if (!recipient) {
    return next(new AppError('المتبرع غير موجود', 404));
  }

  const notification = await Notification.create({
    title: finalTitle,
    message: finalMessage,
    sender: sender._id,
    recipient: recipientId,
    isForAll: false,
  });

  io.to(`user-${recipientId}`).emit('new-notification', {
    notificationId: notification._id,
    title: finalTitle,
    message: finalMessage,
    createdAt: notification.createdAt,
  });

  res.status(201).json({
    success: true,
    message: `تم إرسال الإشعار إلى ${recipient.name}`,
    notification,
  });
});


// =========================
// جلب إشعارات المستخدم
// =========================
export const getMyNotifications = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const notifications = await Notification.find({
    $or: [
      { isForAll: true },
      { recipient: userId },
    ],
  })
    .sort('-createdAt')
    .populate('sender', 'name');

  res.json({
    success: true,
    count: notifications.length,
    notifications,
  });
});


// =========================
// تعليم إشعار كمقروء
// =========================
export const markAsRead = catchAsync(async (req, res, next) => {
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
    message: 'تم تحديد الإشعار كمقروء',
  });
});


// =========================
// 🔥 الحل الحقيقي لمشكلتك (Mark ALL as read)
// =========================
export const markAllAsRead = catchAsync(async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    {
      $or: [
        { isForAll: true },
        { recipient: userId },
      ],
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
    }
  );

  res.json({
    success: true,
    message: 'تم تحديد كل الإشعارات كمقروءة',
  });
});


// =========================
// عدد الإشعارات غير المقروءة
// =========================
export const getUnreadCount = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const count = await Notification.countDocuments({
    $or: [
      { isForAll: true },
      { recipient: userId },
    ],
    readBy: { $ne: userId },
  });

  res.json({
    success: true,
    unreadCount: count,
  });
});