import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .select("-password")
    .sort("-createdAt");

  res.json({ success: true, users });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) return next(new AppError("مستخدم غير موجود", 404));

  res.json({ success: true, user });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("مستخدم غير موجود", 404));

  if (user.role === "super_admin" && role !== "super_admin") {
    const superAdminCount = await User.countDocuments({
      role: "super_admin",
    });

    if (superAdminCount === 1)
      return next(
        new AppError("لا يمكن تغيير صلاحية السوبر أدمن الوحيد", 400)
      );
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: "تم تحديث الصلاحية",
    user: { id: user._id, role: user.role },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("مستخدم غير موجود", 404));

  if (user.role === "super_admin") {
    const superAdminCount = await User.countDocuments({
      role: "super_admin",
    });

    if (superAdminCount === 1)
      return next(
        new AppError("لا يمكن حذف السوبر أدمن الوحيد", 400)
      );
  }

  await user.deleteOne();

  res.json({ success: true, message: "تم حذف المستخدم" });
});


// =========================
// CREATE ADMIN (FIXED EMAIL)
// =========================
export const createAdmin = catchAsync(async (req, res, next) => {
  let {
    phone,
    name,
    password,
    email,
    bloodType,
    wilaya,
    moughataa,
  } = req.body;

  const existingUser = await User.findOne({ phone });

  if (existingUser)
    return next(new AppError("رقم الهاتف مسجل مسبقاً", 400));

  // 🔥 أهم إصلاح
  if (!email || email.trim() === "") {
    email = undefined;
  }

  const admin = await User.create({
    phone,
    name,
    password,
    email,
    bloodType,
    wilaya,
    moughataa,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    message: "تم إنشاء المدير بنجاح",
    admin: {
      id: admin._id,
      name: admin.name,
      phone: admin.phone,
      email: admin.email,
    },
  });
});


// =========================
// CREATE SUPER ADMIN (FIXED EMAIL)
// =========================
export const createSuperAdmin = catchAsync(async (req, res, next) => {
  let {
    phone,
    name,
    password,
    email,
    bloodType,
    wilaya,
    moughataa,
  } = req.body;

  const existingUser = await User.findOne({ phone });

  if (existingUser)
    return next(new AppError("رقم الهاتف مسجل مسبقاً", 400));

  // 🔥 أهم إصلاح
  if (!email || email.trim() === "") {
    email = undefined;
  }

  const superAdmin = await User.create({
    phone,
    name,
    password,
    email,
    bloodType,
    wilaya,
    moughataa,
    role: "super_admin",
  });

  res.status(201).json({
    success: true,
    message: "تم إنشاء السوبر أدمن بنجاح",
    superAdmin: {
      id: superAdmin._id,
      name: superAdmin.name,
      phone: superAdmin.phone,
      email: superAdmin.email,
    },
  });
});