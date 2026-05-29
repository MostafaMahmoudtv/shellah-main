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
  daira: { 
    type: String, 
    required: [true, 'الدائرة مطلوبة'],
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
  preferredContactTime: { 
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    trim: true 
  },
  contactMethod: { 
    type: String, 
    enum: ['phone', 'whatsapp', 'sms'], 
    default: 'phone' 
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