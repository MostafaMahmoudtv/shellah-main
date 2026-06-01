import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '📢 إشعار جديد'
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null  // null يعني لكل المتبرعين
  },
  isForAll: {
    type: Boolean,
    default: true  // true = لكل المتبرعين, false = لشخص محدد
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;