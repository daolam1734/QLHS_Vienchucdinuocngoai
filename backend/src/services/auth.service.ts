import pool from '../config/database';
import { User, UserCredentials, AuthResponse } from '../types';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

export class AuthService {
  // Login user
  async login(credentials: UserCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    try {
      // Validate email domain
      if (!email.endsWith('@tvu.edu.vn')) {
        return {
          success: false,
          message: 'Email phải có định dạng @tvu.edu.vn',
        };
      }

      // Get user from database
      const query = `
        SELECT
          nd.user_id,
          nd.email,
          nd.full_name,
          nd.role,
          nd.ma_vien_chuc,
          nd.ma_nguoi_duyet,
          nd.is_active,
          nd.ngay_tao
        FROM nguoi_dung nd
        WHERE nd.email = $1
      `;

      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        };
      }

      const user = result.rows[0];

      // Check if user is active
      if (!user.is_active) {
        return {
          success: false,
          message: 'Tài khoản đã bị khóa hoặc chưa được kích hoạt',
        };
      }

      // Note: Schema v4 uses SSO authentication, no password stored
      // This is a mock for development purposes
      // In production, this would redirect to SSO
      // For now, accept any password for testing (REMOVE IN PRODUCTION)
      
      // Update last login
      await pool.query(
        'UPDATE nguoi_dung SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
        [user.user_id]
      );

      // Generate tokens
      const tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        ma_nguoi_duyet: user.ma_nguoi_duyet,
        ma_vien_chuc: user.ma_vien_chuc
      };

      const token = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      return {
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: user,
          token,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đăng nhập',
      };
    }
  }

  // Get user profile
  async getProfile(userId: string): Promise<User | null> {
    try {
      const query = `
        SELECT
          nd.user_id,
          nd.email,
          nd.full_name,
          nd.role,
          nd.ma_vien_chuc,
          nd.ma_nguoi_duyet,
          nd.is_active,
          nd.ngay_tao,
          nd.last_login
        FROM nguoi_dung nd
        WHERE nd.user_id = $1
      `;

      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  // Change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    // Note: Schema v4 uses SSO authentication only
    // Password changes should be done through SSO provider
    return {
      success: false,
      message: 'Vui lòng thay đổi mật khẩu thông qua hệ thống SSO',
    };
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      // Validate email domain
      if (!email.endsWith('@tvu.edu.vn')) {
        return {
          success: false,
          message: 'Email phải có định dạng @tvu.edu.vn',
        };
      }

      // Check if user exists
      const result = await pool.query(
        'SELECT user_id, full_name FROM nguoi_dung WHERE email = $1 AND is_active = $2',
        [email, true]
      );

      if (result.rows.length === 0) {
        // Don't reveal if email exists or not
        return {
          success: true,
          message:
            'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi',
        };
      }

      // TODO: Generate reset token and send email
      // For now, just return success
      return {
        success: true,
        message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn',
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra trong quá trình xử lý',
      };
    }
  }
}

export default new AuthService();
