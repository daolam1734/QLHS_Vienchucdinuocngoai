import { Router } from 'express';
import workflowController from '../controllers/workflow.controller';
import { authenticateToken as authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware);

/**
 * GET /api/workflow/ho-so/:ma_ho_so
 * Lấy workflow của hồ sơ
 */
router.get('/ho-so/:ma_ho_so', workflowController.getWorkflow);

/**
 * GET /api/workflow/cho-duyet
 * Lấy danh sách hồ sơ chờ duyệt
 */
router.get('/cho-duyet', workflowController.getHoSoChoDuyet);

/**
 * POST /api/workflow/approve
 * Thực hiện duyệt hồ sơ
 */
router.post('/approve', workflowController.approveHoSo);

/**
 * GET /api/workflow/lich-su/:ma_ho_so
 * Lấy lịch sử hồ sơ
 */
router.get('/lich-su/:ma_ho_so', workflowController.getLichSu);

/**
 * GET /api/workflow/buoc-hien-tai/:ma_ho_so
 * Lấy bước duyệt hiện tại
 */
router.get('/buoc-hien-tai/:ma_ho_so', workflowController.getBuocHienTai);

/**
 * GET /api/workflow/thong-ke
 * Lấy thống kê workflow
 */
router.get('/thong-ke', workflowController.getThongKe);

export default router;
