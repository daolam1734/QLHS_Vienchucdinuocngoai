/**
 * SSO Authentication Controller
 * Xử lý đăng nhập qua SSO (OpenID Connect)
 */

import { Request, Response } from 'express';
import mockSSOService from '../services/mock-sso.service';
import pool from '../config/database';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-2025';
const CLIENT_ID = 'qlhs-dinuocngoai-client';
const CLIENT_SECRET = 'mock-client-secret-2025';
const REDIRECT_URI = process.env.SSO_REDIRECT_URI || 'http://localhost:5173/auth/callback';

/**
 * GET /api/auth/sso/login
 * Redirect user to SSO login page
 */
export const initiateSSO = async (req: Request, res: Response) => {
  try {
    const state = uuidv4(); // CSRF protection
    const scope = 'openid profile email';

    // Store state in session or cookie for verification later
    res.cookie('sso_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600000 // 10 minutes
    });

    const authUrl = mockSSOService.getAuthorizationUrl({
      responseType: 'code',
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scope,
      state
    });

    res.json({ success: true, authUrl });
  } catch (error: any) {
    console.error('SSO initiation error:', error);
    res.status(500).json({ success: false, message: 'Không thể khởi tạo đăng nhập SSO' });
  }
};

/**
 * POST /api/auth/sso/mock-login
 * Mock SSO login endpoint (for development)
 */
export const mockSSOLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, redirectUri, state } = req.body;

    if (!email || !password || !redirectUri || !state) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin đăng nhập' });
      return;
    }

    // Perform mock SSO login
    const callbackUrl = await mockSSOService.login(email, password, redirectUri, state);

    res.json({ success: true, callbackUrl });
  } catch (error: any) {
    console.error('Mock SSO login error:', error);
    res.status(401).json({ success: false, message: error.message || 'Đăng nhập thất bại' });
  }
};

/**
 * POST /api/auth/sso/callback
 * Handle SSO callback (exchange code for token)
 */
export const handleSSOCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      res.status(400).json({ success: false, message: 'Thiếu authorization code hoặc state' });
      return;
    }

    // Verify state (CSRF protection)
    // In demo/mock mode, skip cookie validation since we're using direct API calls
    const storedState = req.cookies.sso_state;
    if (storedState && state !== storedState) {
      res.status(400).json({ success: false, message: 'Invalid state parameter' });
      return;
    }

    // Clear state cookie if exists
    if (storedState) {
      res.clearCookie('sso_state');
    }

    // Exchange code for token
    const tokenResponse = await mockSSOService.exchangeCodeForToken(
      code,
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    // Get user info from ID token
    const userInfo = mockSSOService.verifyIdToken(tokenResponse.id_token);

    // Sync user to database
    const user = await syncUserToDatabase(userInfo);

    // Get isFirstLogin and isProfileCompleted from database
    const pool = require('../config/database').default;
    const dbUserResult = await pool.query(
      `SELECT nd.is_first_login, vc.is_profile_completed
       FROM nguoi_dung nd
       LEFT JOIN vien_chuc vc ON nd.ma_vien_chuc = vc.ma_vien_chuc
       WHERE nd.email = $1`,
      [userInfo.email]
    );
    const isFirstLogin = dbUserResult.rows[0]?.is_first_login ?? false;
    const isProfileCompleted = dbUserResult.rows[0]?.is_profile_completed ?? true;

    // Generate application JWT token
    const appToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Login successful: ${user.email}, isFirstLogin: ${isFirstLogin}, isProfileCompleted: ${isProfileCompleted}`);

    res.json({
      success: true,
      token: appToken,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        maVienChuc: user.maVienChuc,
        maNguoiDuyet: user.maNguoiDuyet,
        isFirstLogin: isFirstLogin,
        isProfileCompleted: isProfileCompleted
      }
    });
  } catch (error: any) {
    console.error('SSO callback error:', error);
    res.status(500).json({ success: false, message: error.message || 'Xử lý callback SSO thất bại' });
  }
};

/**
 * Sync user from SSO to local database
 */
async function syncUserToDatabase(userInfo: any) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists
    let userResult = await client.query(
      'SELECT * FROM nguoi_dung WHERE email = $1',
      [userInfo.email]
    );

    let user;

    if (userResult.rows.length === 0) {
      // User doesn't exist, create new
      console.log(`Creating new user from SSO: ${userInfo.email}`);

      // First, create VienChuc or NguoiDuyet record if needed
      let maVienChuc = userInfo.maVienChuc;
      let maNguoiDuyet = userInfo.maNguoiDuyet;

      if (userInfo.role === 'VienChuc' && !maVienChuc) {
        // Create vien_chuc record
        const vienChucResult = await client.query(
          `INSERT INTO vien_chuc (ho_ten, email, is_dang_vien) 
           VALUES ($1, $2, $3) 
           RETURNING ma_vien_chuc`,
          [userInfo.name, userInfo.email, false]
        );
        maVienChuc = vienChucResult.rows[0].ma_vien_chuc;
      } else if (userInfo.role === 'NguoiDuyet' && !maNguoiDuyet) {
        // Create nguoi_duyet record
        const nguoiDuyetResult = await client.query(
          `INSERT INTO nguoi_duyet (ho_ten, vai_tro, chuc_danh) 
           VALUES ($1, $2, $3) 
           RETURNING ma_nguoi_duyet`,
          [userInfo.name, 'Người duyệt', 'Trưởng phòng']
        );
        maNguoiDuyet = nguoiDuyetResult.rows[0].ma_nguoi_duyet;
      }

      // Create user record
      const insertResult = await client.query(
        `INSERT INTO nguoi_dung (user_id, email, full_name, role, ma_vien_chuc, ma_nguoi_duyet, last_login) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) 
         RETURNING *`,
        [userInfo.sub, userInfo.email, userInfo.name, userInfo.role, maVienChuc, maNguoiDuyet]
      );
      user = insertResult.rows[0];
    } else {
      // User exists, update last login
      const updateResult = await client.query(
        `UPDATE nguoi_dung 
         SET last_login = CURRENT_TIMESTAMP, 
             full_name = $1,
             ngay_cap_nhat = CURRENT_TIMESTAMP
         WHERE email = $2 
         RETURNING *`,
        [userInfo.name, userInfo.email]
      );
      user = updateResult.rows[0];
    }

    await client.query('COMMIT');

    return {
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      maVienChuc: user.ma_vien_chuc,
      maNguoiDuyet: user.ma_nguoi_duyet
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * GET /api/auth/sso/users (Development only)
 * Get list of mock SSO users for testing
 */
export const getMockUsers = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ success: false, message: 'Not available in production' });
    return;
  }

  try {
    const users = mockSSOService.getAllMockUsers();
    res.json({
      success: true,
      users: users.map(u => ({
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        password: '123456' // Show default password for testing
      }))
    });
  } catch (error: any) {
    console.error('Get mock users error:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách users' });
  }
};

/**
 * POST /api/auth/logout
 * Logout (clear session)
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // Clear cookies
    res.clearCookie('sso_state');
    
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Đăng xuất thất bại' });
  }
};

/**
 * POST /api/auth/change-password
 * Change user password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin' });
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 1 chữ hoa' });
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 1 chữ thường' });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 1 chữ số' });
      return;
    }

    // Change password in mock SSO service
    await mockSSOService.changePassword(email, currentPassword, newPassword);

    res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(400).json({ success: false, message: error.message || 'Đổi mật khẩu thất bại' });
  }
};

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
      return;
    }

    // Check if user exists
    const user = mockSSOService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      res.json({ success: true, message: 'Nếu email tồn tại, link đặt lại mật khẩu đã được gửi' });
      return;
    }

    // Generate reset token (random string)
    const resetToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    
    // In real system: Save token to database with expiry
    // For demo: Just log the reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    console.log(`Password reset requested for: ${email}`);
    console.log(`Reset link: ${resetLink}`);
    console.log(`Token expires: ${new Date(resetTokenExpiry).toISOString()}`);

    // In production: Send email with reset link
    // For demo: Return success with link in console
    
    res.json({ 
      success: true, 
      message: 'Đã gửi email chứa link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.',
      // For demo only - show link in response
      resetLink: resetLink
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Không thể xử lý yêu cầu' });
  }
};

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
      return;
    }

    // Validate password
    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' });
      return;
    }

    // In real system: Validate token from database and check expiry
    // For demo: Just accept any token and update mock user
    console.log(`Password reset with token: ${token}`);
    console.log(`New password length: ${newPassword.length}`);

    // In production: 
    // 1. Find token in database
    // 2. Check if token is valid and not expired
    // 3. Hash new password with bcrypt
    // 4. Update user password in database
    // 5. Delete or invalidate the reset token

    res.json({ 
      success: true, 
      message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.'
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Không thể đặt lại mật khẩu' });
  }
};



