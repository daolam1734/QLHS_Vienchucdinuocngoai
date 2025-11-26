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

      // Get user from database with roles
      const query = `
        SELECT 
          nd.id,
          nd.username,
          nd.password_hash,
          nd.ho_ten,
          nd.email,
          nd.don_vi_id,
          dv.ten_don_vi,
          nd.is_active,
          nd.is_locked,
          nd.ngay_tao,
          vt.ma_vai_tro,
          vt.ten_vai_tro
        FROM nguoi_dung nd
        LEFT JOIN dm_don_vi dv ON nd.don_vi_id = dv.id
        LEFT JOIN phan_quyen pq ON nd.id = pq.nguoi_dung_id
        LEFT JOIN dm_vai_tro vt ON pq.vai_tro_id = vt.id
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
      if (!user.is_active || user.is_locked) {
        return {
          success: false,
          message: 'Tài khoản đã bị khóa hoặc chưa được kích hoạt',
        };
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        };
      }

      // Update last login
      await pool.query(
        'UPDATE nguoi_dung SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      // Generate tokens with user's actual role
      const tokenPayload = {
        ma_nguoi_dung: user.id,
        email: user.email,
        ma_vai_tro: user.ma_vai_tro || 'VT_VIEN_CHUC', // Use actual role or default
      };

      const token = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Remove password from user object
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: userWithoutPassword,
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
  async getProfile(maNguoiDung: number): Promise<User | null> {
    try {
      const query = `
        SELECT 
          nd.id as ma_nguoi_dung,
          nd.username,
          nd.email,
          nd.ho_ten,
          nd.don_vi_id as ma_don_vi,
          dv.ten_don_vi,
          nd.is_active,
          nd.ngay_tao
        FROM nguoi_dung nd
        LEFT JOIN dm_don_vi dv ON nd.don_vi_id = dv.id
        WHERE nd.id = $1
      `;

      const result = await pool.query(query, [maNguoiDung]);

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
    maNguoiDung: number,
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      // Get current password
      const result = await pool.query(
        'SELECT password_hash FROM nguoi_dung WHERE id = $1',
        [maNguoiDung]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Người dùng không tồn tại',
        };
      }

      // Verify old password
      const isPasswordValid = await comparePassword(
        oldPassword,
        result.rows[0].password_hash
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Mật khẩu cũ không đúng',
        };
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await pool.query(
        'UPDATE nguoi_dung SET password_hash = $1, ngay_cap_nhat = NOW() WHERE id = $2',
        [hashedPassword, maNguoiDung]
      );

      return {
        success: true,
        message: 'Đổi mật khẩu thành công',
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Có lỗi xảy ra trong quá trình đổi mật khẩu',
      };
    }
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
        'SELECT id, ho_ten FROM nguoi_dung WHERE email = $1 AND is_active = $2',
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
