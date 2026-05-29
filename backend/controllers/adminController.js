import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// جلب كل المتبرعين
export const getAllDonors = catchAsync(async (req, res) => {
  const donors = await User.find({ role: 'donor' }).select('-password');
  res.json({ success: true, donors });
});

// إحصائيات لوحة التحكم (من غير طلبات تبرع)
// export const getDashboardStats = catchAsync(async (req, res) => {
//   const totalDonors = await User.countDocuments({ role: 'donor' });
//   const totalAdmins = await User.countDocuments({ role: 'admin' });
//   const totalSuperAdmins = await User.countDocuments({ role: 'super_admin' });
//   const activeDonors = await User.countDocuments({ role: 'donor', isActive: true });
//   const recentDonors = await User.find({ role: 'donor' })
//     .select('name phone bloodType wilaya createdAt')
//     .sort('-createdAt')
//     .limit(5);
  
//   // إحصائيات فصائل الدم
//   const bloodTypeStats = await User.aggregate([
//     { $match: { role: 'donor' } },
//     { $group: { _id: '$bloodType', count: { $sum: 1 } } },
//     { $sort: { _id: 1 } }
//   ]);
  
//   res.json({ 
//     success: true, 
//     stats: { 
//       totalDonors, 
//       totalAdmins, 
//       totalSuperAdmins,
//       activeDonors,
//       recentDonors,
//       bloodTypeStats
//     } 
//   });
// });

// تحديث بيانات متبرع
export const updateDonor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, bloodType, wilaya, daira, baladia, preferredContactTime } = req.body;
  
  const donor = await User.findById(id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  if (donor.role !== 'donor') return next(new AppError('المستخدم ليس متبرعاً', 400));
  
  donor.name = name || donor.name;
  donor.bloodType = bloodType || donor.bloodType;
  donor.wilaya = wilaya || donor.wilaya;
  donor.daira = daira || donor.daira;
  donor.baladia = baladia || donor.baladia;
  donor.preferredContactTime = preferredContactTime || donor.preferredContactTime;
  
  await donor.save();
  res.json({ success: true, message: 'تم تحديث بيانات المتبرع', donor });
});

// حذف متبرع
export const deleteDonor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const donor = await User.findById(id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  if (donor.role !== 'donor') return next(new AppError('المستخدم ليس متبرعاً', 400));
  
  await donor.deleteOne();
  res.json({ success: true, message: 'تم حذف المتبرع' });
});