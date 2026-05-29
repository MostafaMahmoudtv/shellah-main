import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import { exportDonorsToExcel, exportAllUsersToExcel } from './services/exportService.js';
import { protect, restrictTo } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/locations', locationRoutes);

// Export routes (Protected) - SuperAdmin فقط
app.get('/api/export/donors', protect, restrictTo('super_admin'), exportDonorsToExcel);
app.get('/api/export/all-users', protect, restrictTo('super_admin'), exportAllUsersToExcel);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Blood Bank API is running with MongoDB!', 
    endpoints: {
      auth: '/api/auth',
      donors: '/api/donors',
      admin: '/api/admin',
      superAdmin: '/api/super-admin',
      export: '/api/export/donors, /api/export/all-users'
    } 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: MongoDB`);
  console.log(`\n📋 Available APIs:`);
  console.log(`   1. POST   /api/auth/register       - تسجيل متبرع جديد`);
  console.log(`   2. POST   /api/auth/login          - تسجيل دخول`);
  console.log(`   3. GET    /api/auth/me             - بيانات حسابي (需要有 token)`);
  console.log(`   4. GET    /api/donors/search       - البحث عن متبرعين (عام)`);
  console.log(`   5. GET    /api/donors/profile      - بروفايلي (متبرع)`);
  console.log(`   6. PUT    /api/donors/profile      - تحديث بروفايلي (متبرع)`);
  console.log(`   7. GET    /api/admin/donors        - كل المتبرعين (Admin/SuperAdmin)`);
  console.log(`   8. GET    /api/admin/stats         - إحصائيات (Admin/SuperAdmin)`);
  console.log(`   9. PUT    /api/admin/donors/:id    - تعديل متبرع (Admin/SuperAdmin)`);
  console.log(`  10. DELETE /api/admin/donors/:id    - حذف متبرع (Admin/SuperAdmin)`);
  console.log(`  11. GET    /api/super-admin/users   - كل المستخدمين (SuperAdmin only)`);
  console.log(`  12. GET    /api/export/donors       - تصدير المتبرعين Excel (SuperAdmin)`);
  console.log(`  13. GET    /api/export/all-users    - تصدير كل المستخدمين Excel (SuperAdmin)`);
});