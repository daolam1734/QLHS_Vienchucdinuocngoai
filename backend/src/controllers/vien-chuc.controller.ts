/**
 * Vien Chuc Controller
 * Handle vien chuc self-service operations
 */

import { Request, Response } from 'express';
import * as vienChucService from '../services/vien-chuc.service';

/**
 * POST /api/vien-chuc/complete-profile
 * Complete profile information
 */
export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const email = (req as any).user.email;
    const profileData = req.body;

    await vienChucService.completeProfile(userId, email, profileData);

    res.json({ 
      success: true, 
      message: 'Hoàn thiện hồ sơ thành công' 
    });
  } catch (error: any) {
    console.error('Error completing profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Không thể hoàn thiện hồ sơ' 
    });
  }
};

/**
 * GET /api/vien-chuc/profile
 * Get current profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const profile = await vienChucService.getProfile(userId);

    res.json({ 
      success: true, 
      data: profile 
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Không thể lấy thông tin hồ sơ' 
    });
  }
};

/**
 * PUT /api/vien-chuc/profile
 * Update profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const email = (req as any).user.email;
    const profileData = req.body;

    await vienChucService.updateProfile(userId, email, profileData);

    res.json({ 
      success: true, 
      message: 'Cập nhật hồ sơ thành công' 
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Không thể cập nhật hồ sơ' 
    });
  }
};
