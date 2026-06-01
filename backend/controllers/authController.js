import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';import { validateWilaya, validateMoughataa } from '../utils/mauritanianRegions.js';


const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

export const register = catchAsync(async (req, res, next) => {
  const { 
    phone, name, password, confirmPassword,email, 
    bloodType, wilaya, moughataa, baladia,
    preferredContactTime, contactMethod, notes 
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
    wilaya, moughataa, baladia,
    preferredContactTime, contactMethod, notes, 
    role: 'donor',   
    email
  });
  const validateLocation = (wilaya, moughataa) => {
  if (!wilaya) return true;
  if (!validateWilaya(wilaya)) return false;
  if (moughataa && !validateMoughataa(wilaya, moughataa)) return false;
  return true;
};
  
  const token = signToken(user._id);
  
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
      baladia: user.baladia,
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
    user: { 
      id: user._id, 
      name: user.name, 
      phone: user.phone, 
      role: user.role, 
      bloodType: user.bloodType, 
      wilaya: user.wilaya,
      moughataa: user.moughataa,
      baladia: user.baladia,
      preferredContactTime: user.preferredContactTime,
      contactMethod: user.contactMethod
    }
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});


// في دالة register
