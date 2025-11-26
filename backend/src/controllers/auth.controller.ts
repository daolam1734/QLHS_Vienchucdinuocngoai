import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../types';

export class AuthController {
  // POST /api/v1/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đăng nhập',
      });
    }
  }

  // GET /api/v1/auth/profile
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực',
        });
        return;
      }

      const user = await authService.getProfile(req.user.ma_nguoi_dung);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin người dùng',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Lấy thông tin thành công',
        data: user,
      });
    } catch (error) {
      console.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra',
      });
    }
  }

  // POST /api/v1/auth/change-password
  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực',
        });
        return;
      }

      const { oldPassword, newPassword } = req.body;

      const result = await authService.changePassword(
        req.user.ma_nguoi_dung,
        oldPassword,
        newPassword
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra',
      });
    }
  }

  // POST /api/v1/auth/forgot-password
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const result = await authService.requestPasswordReset(email);

      res.status(200).json(result);
    } catch (error) {
      console.error('Forgot password controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra',
      });
    }
  }

  // POST /api/v1/auth/logout
  async logout(_req: AuthRequest, res: Response): Promise<void> {
    try {
      // For JWT, logout is handled on client side by removing token
      // Here we could add token to blacklist if needed
      res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công',
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra',
      });
    }
  }
}

export default new AuthController();
