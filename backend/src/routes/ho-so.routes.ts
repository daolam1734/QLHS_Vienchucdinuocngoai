import { Router } from 'express';
import hoSoController from '../controllers/ho-so.controller';
import { authenticateToken as authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware);

// Middleware to disable caching for statistics endpoints
const noCacheForStats = (req: any, res: any, next: any) => {
  if (req.path.includes('/thong-ke')) {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
  }
  next();
};

router.use(noCacheForStats);

/**
 * GET /api/ho-so/thong-ke/overview
 * Lấy thống kê hồ sơ
 */
router.get('/thong-ke/overview', hoSoController.getThongKe);

/**
 * POST /api/ho-so
 * Tạo hồ sơ mới
 */
router.post('/', hoSoController.createHoSo);

/**
 * GET /api/ho-so
 * Lấy danh sách hồ sơ
 */
router.get('/', hoSoController.getHoSoList);

/**
 * GET /api/ho-so/:ma_ho_so
 * Lấy chi tiết hồ sơ
 */
router.get('/:ma_ho_so', hoSoController.getHoSoById);

/**
 * PUT /api/ho-so/:ma_ho_so
 * Cập nhật hồ sơ
 */
router.put('/:ma_ho_so', hoSoController.updateHoSo);

/**
 * DELETE /api/ho-so/:ma_ho_so
 * Xóa hồ sơ
 */
router.delete('/:ma_ho_so', hoSoController.deleteHoSo);

export default router;
