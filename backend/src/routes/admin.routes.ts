import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = Router();

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(checkRole(['VT_ADMIN']));

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);

// Hồ sơ Management
router.get('/hoso', adminController.getAllHoSo);
router.delete('/hoso/:id', adminController.deleteHoSo);

// User Management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// Đơn vị Management
router.get('/donvi', adminController.getAllDonVi);
router.delete('/donvi/:id', adminController.deleteDonVi);

// Approval Queue
router.get('/approval-queue', adminController.getApprovalQueue);
router.post('/approval/:id/approve', adminController.approveHoSo);
router.post('/approval/:id/reject', adminController.rejectHoSo);

// Reports
router.get('/reports', adminController.getReports);
router.get('/reports/export', adminController.exportReports);

// Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
