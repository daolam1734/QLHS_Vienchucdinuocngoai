/**
 * Mock SSO Service
 * Giả lập OpenID Connect/OAuth2 Provider
 * Trong production, thay thế bằng TVU SSO thực tế
 */

import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

interface MockUser {
  userId: string;
  email: string;
  fullName: string;
  role: 'VienChuc' | 'NguoiDuyet' | 'Admin';
  maVienChuc?: string;
  maNguoiDuyet?: string;
  isFirstLogin?: boolean;
}

interface AuthorizationRequest {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
  refresh_token?: string;
}

interface UserInfo {
  sub: string; // userId
  email: string;
  name: string;
  role: string;
  maVienChuc?: string;
  maNguoiDuyet?: string;
}

/**
 * Mock SSO Service - Giả lập OpenID Connect Provider
 */
export class MockSSOService {
  private readonly issuer = 'https://sso.tvu.edu.vn';
  private readonly jwtSecret = process.env.JWT_SECRET || 'mock-sso-secret-key-2025';
  
  // Mock user database
  private mockUsers: Map<string, MockUser & { password: string; isFirstLogin: boolean }> = new Map();
  
  // Authorization codes (temporary)
  private authCodes: Map<string, { userId: string; expiresAt: number; redirectUri: string }> = new Map();
  
  // Access tokens
  private accessTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor() {
    this.initializeMockUsers();
  }

  /**
   * Khởi tạo mock users từ database với password_hash
   */
  private async initializeMockUsers() {
    try {
      const pool = require('../config/database').default;
      const defaultPasswordHash = await bcrypt.hash('123456', 10);
      
      // Load users from database with password fields
      const result = await pool.query(`
        SELECT 
          user_id,
          email,
          full_name,
          role,
          ma_vien_chuc,
          ma_nguoi_duyet,
          password_hash,
          is_first_login,
          password_changed_at
        FROM nguoi_dung
        WHERE is_active = TRUE
      `);

      // Add all database users
      for (const row of result.rows) {
        this.mockUsers.set(row.email, {
          userId: row.user_id,
          email: row.email,
          fullName: row.full_name,
          role: row.role,
          maVienChuc: row.ma_vien_chuc,
          maNguoiDuyet: row.ma_nguoi_duyet,
          password: row.password_hash || defaultPasswordHash,
          isFirstLogin: row.is_first_login !== false // Default to true if null
        });
      }

      console.log(`✅ Mock SSO initialized with ${this.mockUsers.size} users from database`);
    } catch (error) {
      console.error('❌ Error loading users from database:', error);
      
      // Fallback to default users if database load fails
      const passwordHash = await bcrypt.hash('123456', 10);
      
      this.mockUsers.set('admin@tvu.edu.vn', {
        userId: uuidv4(),
        email: 'admin@tvu.edu.vn',
        fullName: 'Quản Trị Viên',
        role: 'Admin',
        password: passwordHash,
        isFirstLogin: true
      });

      this.mockUsers.set('nguyenvana@tvu.edu.vn', {
        userId: uuidv4(),
        email: 'nguyenvana@tvu.edu.vn',
        fullName: 'Nguyễn Văn An',
        role: 'VienChuc',
        maVienChuc: uuidv4(),
        password: passwordHash,
        isFirstLogin: true
      });

      console.log(`⚠️ Mock SSO initialized with ${this.mockUsers.size} fallback users`);
    }
  }

  /**
   * GET /authorize
   * Endpoint authorization (redirect user đến trang đăng nhập SSO)
   */
  getAuthorizationUrl(params: AuthorizationRequest): string {
    const { responseType, clientId, redirectUri, scope, state } = params;

    // Validate parameters
    if (responseType !== 'code') {
      throw new Error('Invalid response_type. Only "code" is supported.');
    }

    if (!this.isValidClientId(clientId)) {
      throw new Error('Invalid client_id');
    }

    if (!this.isValidRedirectUri(redirectUri)) {
      throw new Error('Invalid redirect_uri');
    }

    // Trong mock, redirect đến trang login của chính app
    const loginUrl = new URL('/sso/login', 'http://localhost:3000');
    loginUrl.searchParams.set('client_id', clientId);
    loginUrl.searchParams.set('redirect_uri', redirectUri);
    loginUrl.searchParams.set('scope', scope);
    loginUrl.searchParams.set('state', state);

    return loginUrl.toString();
  }

  /**
   * POST /token
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<TokenResponse> {
    // Validate client credentials
    if (!this.validateClientCredentials(clientId, clientSecret)) {
      throw new Error('Invalid client credentials');
    }

    // Get authorization code
    const authCode = this.authCodes.get(code);
    if (!authCode) {
      throw new Error('Invalid or expired authorization code');
    }

    if (authCode.expiresAt < Date.now()) {
      this.authCodes.delete(code);
      throw new Error('Authorization code expired');
    }

    if (authCode.redirectUri !== redirectUri) {
      throw new Error('Redirect URI mismatch');
    }

    // Delete used code
    this.authCodes.delete(code);

    // Get user
    const user = Array.from(this.mockUsers.values()).find(u => u.userId === authCode.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const idToken = this.generateIdToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store access token
    this.accessTokens.set(accessToken, {
      userId: user.userId,
      expiresAt: Date.now() + 3600000 // 1 hour
    });

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      id_token: idToken,
      refresh_token: refreshToken
    };
  }

  /**
   * POST /sso/login
   * Mock login endpoint (thay thế cho TVU SSO login)
   */
  async login(email: string, password: string, redirectUri: string, state: string): Promise<string> {
    // Find user
    const user = this.mockUsers.get(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate authorization code
    const code = uuidv4();
    this.authCodes.set(code, {
      userId: user.userId,
      expiresAt: Date.now() + 600000, // 10 minutes
      redirectUri
    });

    // Build redirect URL with code
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', code);
    callbackUrl.searchParams.set('state', state);

    return callbackUrl.toString();
  }

  /**
   * GET /userinfo
   * Get user information using access token
   */
  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const tokenData = this.accessTokens.get(accessToken);
    if (!tokenData) {
      throw new Error('Invalid access token');
    }

    if (tokenData.expiresAt < Date.now()) {
      this.accessTokens.delete(accessToken);
      throw new Error('Access token expired');
    }

    const user = Array.from(this.mockUsers.values()).find(u => u.userId === tokenData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      sub: user.userId,
      email: user.email,
      name: user.fullName,
      role: user.role,
      maVienChuc: user.maVienChuc,
      maNguoiDuyet: user.maNguoiDuyet
    };
  }

  /**
   * Verify và decode ID token
   */
  verifyIdToken(idToken: string): UserInfo {
    try {
      const decoded = jwt.verify(idToken, this.jwtSecret) as any;
      return {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        maVienChuc: decoded.maVienChuc,
        maNguoiDuyet: decoded.maNguoiDuyet
      };
    } catch (error) {
      throw new Error('Invalid ID token');
    }
  }

  /**
   * Helper methods
   */
  private generateAccessToken(user: MockUser): string {
    return `access_${uuidv4()}`;
  }

  private generateIdToken(user: MockUser): string {
    return jwt.sign(
      {
        iss: this.issuer,
        sub: user.userId,
        aud: 'qlhs-dinuocngoai',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        email: user.email,
        name: user.fullName,
        role: user.role,
        maVienChuc: user.maVienChuc,
        maNguoiDuyet: user.maNguoiDuyet
      },
      this.jwtSecret
    );
  }

  private generateRefreshToken(user: MockUser): string {
    return `refresh_${uuidv4()}`;
  }

  private isValidClientId(clientId: string): boolean {
    // Mock validation
    return clientId === 'qlhs-dinuocngoai-client';
  }

  private isValidRedirectUri(redirectUri: string): boolean {
    // Mock validation - allow localhost for development
    const allowedUris = [
      'http://localhost:5173/auth/callback',
      'http://localhost:3000/auth/callback',
      'https://qlhs.tvu.edu.vn/auth/callback'
    ];
    return allowedUris.includes(redirectUri);
  }

  private validateClientCredentials(clientId: string, clientSecret: string): boolean {
    // Mock validation
    return clientId === 'qlhs-dinuocngoai-client' && 
           clientSecret === 'mock-client-secret-2025';
  }

  /**
   * Get all mock users (for testing)
   */
  getAllMockUsers(): Array<Omit<MockUser, 'password'>> {
    return Array.from(this.mockUsers.values()).map(({ password, isFirstLogin, ...user }) => user);
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): (MockUser & { isFirstLogin: boolean }) | undefined {
    const user = this.mockUsers.get(email);
    if (!user) return undefined;
    
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, isFirstLogin: user.isFirstLogin };
  }

  /**
   * Change password
   */
  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = this.mockUsers.get(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update in database
    const pool = require('../config/database').default;
    await pool.query(
      `UPDATE nguoi_dung 
       SET password_hash = $1, 
           is_first_login = false, 
           password_changed_at = CURRENT_TIMESTAMP 
       WHERE email = $2`,
      [newPasswordHash, email]
    );

    // Update in memory
    this.mockUsers.set(email, {
      ...user,
      password: newPasswordHash,
      isFirstLogin: false
    });

    console.log(`✅ Password changed successfully for ${email}`);
    return true;
  }

  /**
   * Reload users from database (called after admin creates new user)
   */
  async reloadUsers(): Promise<void> {
    await this.initializeMockUsers();
    console.log('✅ Mock users reloaded from database');
  }
}

export default new MockSSOService();
