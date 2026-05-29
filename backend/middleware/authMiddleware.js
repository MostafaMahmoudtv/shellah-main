import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  
  }

  if (!token) return next(new AppError('الرجاء تسجيل الدخول أولاً', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError('المستخدم غير موجود', 401));
  if (!user.isActive) return next(new AppError('الحساب معطل، تواصل مع الإدارة', 401));

  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('غير مصرح لك بهذه العملية', 403));
  }
  next();
};