import AppError from '../utils/AppError.js';

const handleDuplicateKeyDB = (err) => {
  return new AppError('رقم الهاتف مسجل مسبقاً', 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`بيانات غير صالحة: ${errors.join('. ')}`, 400);
};

const handleCastErrorDB = (err) => {
  return new AppError(`معرف غير صالح: ${err.value}`, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({ success: false, message: 'حدث خطأ ما!' });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'خطأ في الخادم';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, name: err.name, message: err.message };
    if (error.code === 11000) error = handleDuplicateKeyDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};