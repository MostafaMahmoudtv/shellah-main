import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

// جلب كل المتبرعين (للأدمن)
export const getAllDonors = catchAsync(async (req, res) => {
  const donors = await User.find({ role: 'donor' }).select('-password').sort('-createdAt');
  res.json({ success: true, count: donors.length, donors });
});


// البحث عن متبرعين (يدعم العربية والفرنسية)
export const searchDonors = catchAsync(async (req, res) => {
  let { bloodType, wilaya, moughataa, contactMethod, search } = req.query;
  const filter = { role: 'donor', isActive: true };
  
  // فلترة حسب فصيلة الدم
  if (bloodType) filter.bloodType = bloodType;
  
  // فلترة حسب الولاية (يدعم عربي وفرنسي)
  if (wilaya) filter.wilaya = { $regex: wilaya, $options: 'i' };
  
  // فلترة حسب المقاطعة (يدعم عربي وفرنسي)
  if (moughataa) filter.moughataa = { $regex: moughataa, $options: 'i' };
  
  
  // فلترة حسب وسيلة الاتصال
  if (contactMethod) filter.contactMethod = contactMethod;
  
  // بحث عام في كل الحقول (يدعم عربي وفرنسي)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { wilaya: { $regex: search, $options: 'i' } },
      { moughataa: { $regex: search, $options: 'i' } },
      { baladia: { $regex: search, $options: 'i' } }
    ];
  }
  
  const donors = await User.find(filter)
    .select('name phone bloodType wilaya moughataa preferredContactTime contactMethod notes')
    .limit(50);
    
  res.json({ 
    success: true, 
    count: donors.length, 
    donors,
    message: 'البحث يدعم اللغة العربية والفرنسية'
  });
});

// جلب بروفايل المتبرع
export const getDonorProfile = catchAsync(async (req, res) => {
  const donor = await User.findById(req.user._id).select('-password');
  res.json({ success: true, donor });
});


// تحديث بروفايل المتبرع
export const updateDonorProfile = catchAsync(async (req, res) => {
  const { name,phone, bloodType, wilaya, moughataa, preferredContactTime, contactMethod } = req.body;
  const donor = await User.findById(req.user._id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  
  if (name) donor.name = name;
  if (phone) donor.phone = phone;
  if (bloodType) donor.bloodType = bloodType;
  if (wilaya) donor.wilaya = wilaya;
  if (moughataa) donor.moughataa = moughataa;
  if (preferredContactTime) donor.preferredContactTime = preferredContactTime;
  if (contactMethod) donor.contactMethod = contactMethod;

  
  await donor.save();
  
  res.json({ success: true, message: 'تم تحديث البروفايل', donor });
});
export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) return next(new AppError('كلمتا المرور الجديدتين غير متطابقتين', 400));
});
export const deleteDonorProfile = catchAsync(async (req, res) => {
  const donor = await User.findById(req.user._id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  donor.isActive = false;
  await donor.save();
  res.json({ success: true, message: 'تم حذف البروفايل' });
}); 
export const getDonorStats = catchAsync(async (req, res) => {
  const [bloodTypes, wilayas, contactMethods] = await Promise.all([
    User.aggregate([
      { $match: { role: 'donor', isActive: true } },
      { $group: { _id: '$bloodType', count: { $sum: 1 } } }
    ]),

    // User.aggregate([
    //   { $match: { role: 'donor', isActive: true } },
    //   { $group: { _id: '$wilaya', count: { $sum: 1 } } }
    // ]),

    // User.aggregate([
    //   { $match: { role: 'donor', isActive: true } },
    //   { $group: { _id: '$contactMethod', count: { $sum: 1 } } }
    // ])
  ]);

  res.json({
    success: true,
    bloodTypes,
    wilayas,
    contactMethods
  });
});

  