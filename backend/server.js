import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { exportDonorsToExcel, exportAllUsersToExcel } from './services/exportService.js';
import { protect, restrictTo } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

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
app.use('/api/notifications', notificationRoutes);

// Export routes
app.get('/api/export/donors', protect, restrictTo('super_admin'), exportDonorsToExcel);
app.get('/api/export/all-users', protect, restrictTo('super_admin'), exportAllUsersToExcel);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  // Join admin room (for role-based notifications)
  socket.on('join-admin-room', (role) => {
    if (role === 'admin' || role === 'super_admin') {
      socket.join('admin-room');
      console.log(`👑 Admin joined room: ${socket.id} (${role})`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Blood Bank API is running with MongoDB & Socket.IO!', 
    endpoints: {
      auth: '/api/auth',
      donors: '/api/donors',
      admin: '/api/admin',
      superAdmin: '/api/super-admin',
      locations: '/api/locations',
      notifications: '/api/notifications'
    } 
  });
});

// 404 handler
app.use( (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: MongoDB`);
  console.log(`🔌 Socket.IO enabled for real-time notifications`);
});