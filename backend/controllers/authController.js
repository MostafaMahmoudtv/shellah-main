import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

import { createNotification } from '../utils/notificationService.js';

// Helper function to get unread count for admins
async function getUnreadCountForAdmins() {
  const Notification = await import('../models/Notification.js').then(m => m.default);
  const count = await Notification.countDocuments({
    forRoles: { $in: ['admin', 'super_admin'] },
    isRead: false
  });
  return count;
}



const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// export const register = catchAsync(async (req, res, next) => {
//   const { phone, name, password, confirmPassword,email, bloodType, wilaya, moughataa, preferredContactTime, contactMethod, lastDonationDate } = req.body;
//   if (password !== confirmPassword) return next(new AppError('كلمتا المرور غير متطابقتين', 400));
//   const existingUser = await User.findOne({ phone });
//   if (existingUser) return next(new AppError('رقم الهاتف مسجل مسبقاً', 400));
//   const user = await User.create({ phone, name, password, email, bloodType, wilaya, moughataa, preferredContactTime, contactMethod, lastDonationDate, role: 'donor' });
//   const token = signToken(user._id);
//   res.status(201).json({
//     success: true,
//     token,
//     user: { id: user._id, name: user.name, phone: user.phone ,email: user.email, role: user.role, bloodType: user.bloodType, wilaya: user.wilaya, moughataa: user.moughataa }
//   });
// });
export const register = catchAsync(async (req, res, next) => {
  const { 
    phone, name, password, confirmPassword, email,
    bloodType, wilaya, moughataa,
    preferredContactTime, contactMethod
  } = req.body;
  
  if (password !== confirmPassword) {
    return next(new AppError('كلمتا المرور غير متطابقتين', 400));
  }
  
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return next(new AppError('رقم الهاتف مسجل مسبقاً', 400));
  }
  
  const user = await User.create({ 
    phone, name, password, bloodType, 
    wilaya, moughataa,email,
    preferredContactTime, contactMethod,
    role: 'donor' 
  });
  
  const token = signToken(user._id);
  
  // ✅ إرسال إشعار للأدمن عن متبرع جديد
  const io = req.app.get('io');
  const notification = await createNotification({
    type: 'new_donor',
    title: '🩸 متبرع جديد',
    message: `تم تسجيل متبرع جديد: ${name} (${phone}) - فصيلة الدم: ${bloodType} - الولاية: ${wilaya}`,
    data: {
      donorId: user._id,
      donorName: name,
      donorPhone: phone,
      donorBloodType: bloodType,
      donorWilaya: wilaya,
      donorMoughataa: moughataa,
   
    },
    forRoles: ['admin', 'super_admin']
  });
  
  // إرسال الإشعار فوراً لكل الأدمن المتصلين
  io.to('admin-room').emit('new-notification', {
    notification,
    unreadCount: await getUnreadCountForAdmins()
  });
  
  res.status(201).json({
    success: true,
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      phone: user.phone, 
      role: user.role, 
      bloodType: user.bloodType, 
      wilaya: user.wilaya,
      moughataa: user.moughataa,
      preferredContactTime: user.preferredContactTime,
      contactMethod: user.contactMethod
    }
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('رقم الهاتف أو كلمة المرور غير صحيحة', 401));
  }
  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, phone: user.phone ,email: user.email, role: user.role, bloodType: user.bloodType, wilaya: user.wilaya, moughataa: user.moughataa, preferredContactTime: user.preferredContactTime, contactMethod: user.contactMethod, lastDonationDate: user.lastDonationDate }
  });
});
export const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});