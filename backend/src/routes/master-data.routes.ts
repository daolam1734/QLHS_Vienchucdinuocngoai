import { Router } from 'express';
import masterDataController from '../controllers/master-data.controller';
import { authenticateToken as authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware);

/**
 * GET /api/master-data/loai-chuyen-di
 */
router.get('/loai-chuyen-di', masterDataController.getLoaiChuyenDi);

/**
 * GET /api/master-data/don-vi
 */
router.get('/don-vi', masterDataController.getDonVi);

/**
 * GET /api/master-data/chi-bo
 */
router.get('/chi-bo', masterDataController.getChiBo);

/**
 * GET /api/master-data/nguoi-duyet
 */
router.get('/nguoi-duyet', masterDataController.getNguoiDuyet);

/**
 * GET /api/master-data/roles
 */
router.get('/roles', masterDataController.getRoles);

/**
 * GET /api/master-data/vien-chuc/:ma_vien_chuc?
 */
router.get('/vien-chuc/:ma_vien_chuc?', masterDataController.getVienChuc);

export default router;
