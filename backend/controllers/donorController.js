import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

// جلب كل المتبرعين (للأدمن)
export const getAllDonors = catchAsync(async (req, res) => {
  const donors = await User.find({ role: 'donor' }).select('-password').sort('-createdAt');
  res.json({ success: true, count: donors.length, donors });
});

// جلب إحصائيات سريعة
export const getStats = catchAsync(async (req, res) => {
  const totalDonors = await User.countDocuments({ role: 'donor', isActive: true });
  const donorsByBloodType = await User.aggregate([
    { $match: { role: 'donor', isActive: true } },
    { $group: { _id: '$bloodType', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  
  res.json({ success: true, stats: { totalDonors, donorsByBloodType } });
});

// البحث عن متبرعين (يدعم العربية والفرنسية)
export const searchDonors = catchAsync(async (req, res) => {
  let { bloodType, wilaya, moughataa, baladia, contactMethod, search } = req.query;
  const filter = { role: 'donor', isActive: true };
  
  // فلترة حسب فصيلة الدم
  if (bloodType) filter.bloodType = bloodType;
  
  // فلترة حسب الولاية (يدعم عربي وفرنسي)
  if (wilaya) filter.wilaya = { $regex: wilaya, $options: 'i' };
  
  // فلترة حسب المقاطعة (يدعم عربي وفرنسي)
  if (moughataa) filter.moughataa = { $regex: moughataa, $options: 'i' };
  
  // فلترة حسب البلدية (يدعم عربي وفرنسي)
  if (baladia) filter.baladia = { $regex: baladia, $options: 'i' };
  
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
    .select('name phone bloodType wilaya moughataa baladia preferredContactTime contactMethod notes')
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
  const { name, bloodType, wilaya, moughataa, baladia, preferredContactTime, contactMethod, notes } = req.body;
  
  const donor = await User.findById(req.user._id);
  if (!donor) return next(new AppError('المتبرع غير موجود', 404));
  
  if (name) donor.name = name;
  if (bloodType) donor.bloodType = bloodType;
  if (wilaya) donor.wilaya = wilaya;
  if (moughataa) donor.moughataa = moughataa;
  if (baladia) donor.baladia = baladia;
  if (preferredContactTime) donor.preferredContactTime = preferredContactTime;
  if (contactMethod) donor.contactMethod = contactMethod;
  if (notes) donor.notes = notes;
  
  await donor.save();
  
  res.json({ success: true, message: 'تم تحديث البروفايل', donor });
});