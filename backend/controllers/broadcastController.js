import User from '../models/User.js';
import { sendBroadcastToDonors } from '../utils/notificationService.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    إرسال إشعار جماعي لجميع المتبرعين
// @route   POST /api/admin/broadcast
// @access  Admin / SuperAdmin
export const broadcastToDonors = catchAsync(async (req, res, next) => {
  const { title, message, targetBloodType, targetWilaya, data } = req.body;
  
  if (!title || !message) {
    return next(new AppError('العنوان والرسالة مطلوبين', 400));
  }
  
  const io = req.app.get('io');
  const senderId = req.user._id;
  
  const result = await sendBroadcastToDonors(io, {
    title,
    message,
    targetBloodType: targetBloodType || 'all',
    targetWilaya: targetWilaya || 'all',
    data: data || {}
  }, senderId);
  
  if (!result.success) {
    return next(new AppError(result.error, 500));
  }
  
  res.status(201).json({
    success: true,
    message: `تم إرسال الإشعار إلى ${result.recipientsCount} متبرع`,
    notification: result.notification,
    recipientsCount: result.recipientsCount
  });
});

// @desc    جلب خيارات التصفية للإشعارات (قائمة فصائل الدم والولايات)
// @route   GET /api/admin/broadcast/filters
// @access  Admin / SuperAdmin
export const getBroadcastFilters = catchAsync(async (req, res) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Get unique wilayas from donors
  const wilayas = await User.distinct('wilaya', { role: 'donor', isActive: true });
  
  res.json({
    success: true,
    filters: {
      bloodTypes,
      wilayas: wilayas.filter(w => w)
    }
  });
});

// @desc    معاينة عدد المتبرعين المستهدفين قبل الإرسال
// @route   POST /api/admin/broadcast/preview
// @access  Admin / SuperAdmin
export const previewBroadcast = catchAsync(async (req, res) => {
  const { targetBloodType, targetWilaya } = req.body;
  
  const filter = { role: 'donor', isActive: true };
  if (targetBloodType && targetBloodType !== 'all') filter.bloodType = targetBloodType;
  if (targetWilaya && targetWilaya !== 'all') filter.wilaya = targetWilaya;
  
  const count = await User.countDocuments(filter);
  const sample = await User.find(filter).select('name phone bloodType wilaya').limit(5);
  
  res.json({
    success: true,
    recipientsCount: count,
    sampleRecipients: sample
  });
});