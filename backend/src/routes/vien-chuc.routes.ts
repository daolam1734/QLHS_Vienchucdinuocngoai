/**
 * Vien Chuc Routes
 * Routes for vien chuc self-service operations
 */

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import * as vienChucController from '../controllers/vien-chuc.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * POST /api/vien-chuc/complete-profile
 * Complete vien chuc profile information
 */
router.post('/complete-profile', vienChucController.completeProfile);

/**
 * GET /api/vien-chuc/profile
 * Get current vien chuc profile
 */
router.get('/profile', vienChucController.getProfile);

/**
 * PUT /api/vien-chuc/profile
 * Update vien chuc profile
 */
router.put('/profile', vienChucController.updateProfile);

export default router;
