import express from 'express';
import { getAllUsers, getUserById, updateUserRole, deleteUser, createAdmin,createSuperAdmin } from '../controllers/superAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { exportDonorsToExcel, exportAllUsersToExcel } from '../services/exportService.js';

const router = express.Router();

router.use(protect, restrictTo('super_admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
// router.patch('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.post('/create-admin', createAdmin);
router.post('/create-super-admin', createSuperAdmin);
// Export
router.get('/export/donors', exportDonorsToExcel);
router.get('/export/all-users', exportAllUsersToExcel);

export default router;