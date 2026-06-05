import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  name: { 
    type: String, 
    default: 'فاعل خير ',
    required: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
     select: false
  },
email: { 
  type: String,
  unique: true,
  sparse: true,
  trim: true
},
  bloodType: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',"المستخدم"], 
    required: [true, 'فصيلة الدم مطلوبة'] 
  },
  
  wilaya: { 
    type: String, 
    required: [true, 'الولاية مطلوبة'],
    trim: true 
  },
  moughataa: { 
    type: String, 
    required: [true, 'المقاطعه مطلوبة'],
    trim: true 
  },
 
  role: { 
    type: String, 
    enum: ['donor', 'admin', 'super_admin'], 
    default: 'donor' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  status: { 
    type: String, 
    enum: ['عاجل', 'عادى', 'متوسط'], 
    default: 'عادى' 
  },
  preferredContactTime: { 
    type: String,
    enum: ['صباحا', 'بعد الظهر', 'مساءا', 'أي وقت'],
    trim: true 
  },
  contactMethod: { 
    type: String, 
    enum: ['تليفون', 'واتساب', 'رسائل نصيه', 'أي طريقة'], 
    default: 'تليفون' 
  }, 
  lastDonationDate: { 
    type: Date 
  },
  
}, { 
  timestamps: true 
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;