import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// جلب كل المتبرعين
export const getAllDonors = catchAsync(async (req, res) => {
  const donors = await User.find({ role: 'donor' }).select('-password');
  res.json({ success: true, count: donors.length, donors });
});

// إحصائيات لوحة التحكم
export const getDashboardStats = catchAsync(async (req, res) => {
  const totalDonors = await User.countDocuments({ role: 'donor' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalSuperAdmins = await User.countDocuments({ role: 'super_admin' });
  const activeDonors = await User.countDocuments({ role: 'donor', isActive: true });
  
  const recentDonors = await User.find({ role: 'donor' })
    .select('name phone bloodType wilaya createdAt')
    .sort('-createdAt')
    .limit(5);
  
  // إحصائيات فصائل الدم
  const bloodTypeStats = await User.aggregate([
    { $match: { role: 'donor' } },
    { $group: { _id: '$bloodType', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  res.json({ 
    success: true, 
    stats: { 
      totalDonors, 
      totalAdmins, 
      totalSuperAdmins,
      activeDonors,
      recentDonors,
      bloodTypeStats
    } 
  });
});

// تحديث بيانات متبرع
export const updateDonor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, bloodType, wilaya, moughataa, baladia, preferredContactTime, contactMethod, notes } = req.body;
  
  const donor = await User.findById(id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  if (donor.role !== 'donor') return next(new AppError('المستخدم ليس متبرعاً', 400));
  
  if (name) donor.name = name;
  if (bloodType) donor.bloodType = bloodType;
  if (wilaya) donor.wilaya = wilaya;
  if (moughataa) donor.moughataa = moughataa;
  if (baladia) donor.baladia = baladia;
  if (preferredContactTime) donor.preferredContactTime = preferredContactTime;
  if (contactMethod) donor.contactMethod = contactMethod;
  if (notes) donor.notes = notes;
  
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