import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

// جلب كل المتبرعين (للأدمن)
export const getAllDonors = catchAsync(async (req, res) => {
  const donors = await User.find({ role: 'donor' }).select('-password').sort('-createdAt');
  res.json({ success: true, count: donors.length, donors });
});


// البحث عن متبرعين (يدعم العربية والفرنسية)
export const searchDonors = catchAsync(async (req, res) => {
  const { bloodType, wilaya, moughataa} = req.query;
  const filter = { role: 'donor', isActive: true };
  
  if (bloodType) filter.bloodType = bloodType;
  if (wilaya) filter.wilaya = { $regex: wilaya, $options: 'i' };
  if (moughataa) filter.moughataa = { $regex: moughataa, $options: 'i' };

  
  const donors = await User.find(filter)
    .select('name phone bloodType wilaya moughataa ');
    
  res.json({ success: true, count: donors.length, donors });
});

// جلب بروفايل المتبرع
export const getDonorProfile = catchAsync(async (req, res) => {
  const donor = await User.findById(req.user._id).select('-password');
  res.json({ success: true, donor });
});


// تحديث بروفايل المتبرع
export const updateDonorProfile = catchAsync(async (req, res) => {
  const { name,phone, bloodType, wilaya, moughataa, preferredContactTime, contactMethod ,status} = req.body;
  const donor = await User.findById(req.user._id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  
  if (name) donor.name = name;
  if (phone) donor.phone = phone;
  if (bloodType) donor.bloodType = bloodType;
  if (wilaya) donor.wilaya = wilaya;
  if (moughataa) donor.moughataa = moughataa;
  if (preferredContactTime) donor.preferredContactTime = preferredContactTime;
  if (contactMethod) donor.contactMethod = contactMethod;
  if (status) donor.status = status;
  await donor.save();
  
  res.json({ success: true, message: 'تم تحديث البروفايل', donor });
});
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      success: false,
      message: 'كلمتا المرور الجديدتين غير متطابقتين'
    });
  }

  const donor = await User.findById(req.user._id).select('+password');

  const isCorrect = await donor.comparePassword(currentPassword);

  if (!isCorrect) {
    return res.status(400).json({
      success: false,
      message: 'كلمة المرور الحالية غير صحيحة'
    });
  }

  donor.password = newPassword;

  await donor.save();

  res.json({
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح'
  });
});
export const softdeleteDonorProfile = catchAsync(async (req, res) => {
  const donor = await User.findById(req.user._id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  donor.isActive = false;
  await donor.save();
  res.json({ success: true, message: 'تم حذف البروفايل' });
}); 
export const deleteDonorProfile = catchAsync(async (req, res, next) => {
  const donor = await User.findByIdAndDelete(req.user._id);

  if (!donor) {
    return next(new AppError('المتبرع غير موجود', 404));
  }

  res.status(200).json({
    success: true,
    message: 'تم حذف الحساب نهائياً'
  });
});
export const getDonorStats = catchAsync(async (req, res) => {
  const [bloodTypes, wilayas, contactMethods] = await Promise.all([
    User.aggregate([
      { $match: { role: 'donor', isActive: true } },
      { $group: { _id: '$bloodType', count: { $sum: 1 } } }
    ]),

  //   User.aggregate([
  //     { $match: { role: 'donor', isActive: true } },
  //     { $group: { _id: '$wilaya', count: { $sum: 1 } } }
  //   ]),

  //   User.aggregate([
  //     { $match: { role: 'donor', isActive: true } },
  //     { $group: { _id: '$contactMethod', count: { $sum: 1 } } }
  //   ])
  ]);

  res.json({
    success: true,
    bloodTypes,
    // wilayas,
    // contactMethods
  });
});

  