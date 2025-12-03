import React, { useState, useEffect } from 'react';
import { X, LogIn, Shield, Users, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AuthModalBanner from './AuthModalBanner';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onForgotPassword?: () => void;
}

interface MockUser {
  email: string;
  fullName: string;
  role: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onForgotPassword }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockUsers, setMockUsers] = useState<MockUser[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadMockUsers();
      // Reset form when modal opens
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  const loadMockUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/sso/users`);
      if (response.data.success) {
        setMockUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to load mock users:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const redirectUri = 'http://localhost:5173/auth/callback';
      const state = 'state-' + Date.now();

      // Mock SSO login
      const loginResponse = await axios.post(`${API_URL}/auth/sso/mock-login`, {
        email,
        password,
        redirectUri,
        state
      });

      if (loginResponse.data.success) {
        // Parse callback URL to get code
        const callbackUrl = new URL(loginResponse.data.callbackUrl);
        const code = callbackUrl.searchParams.get('code');
        const returnedState = callbackUrl.searchParams.get('state');

        // Exchange code for token
        const tokenResponse = await axios.post(`${API_URL}/auth/sso/callback`, {
          code,
          state: returnedState
        });

        if (tokenResponse.data.success) {
          const userData = {
            ...tokenResponse.data.user,
            isFirstLogin: tokenResponse.data.user.isFirstLogin || false
          };
          
          // Store token and user info FIRST
          localStorage.setItem('token', tokenResponse.data.token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('LoginModal - Data stored in localStorage');
          console.log('LoginModal - Token:', localStorage.getItem('token'));
          console.log('LoginModal - User:', localStorage.getItem('user'));
          
          // Wait a bit to ensure localStorage write completes
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Then close modal
          onClose();
          
          // Finally trigger success callback
          setTimeout(() => {
            console.log('LoginModal - Triggering onLoginSuccess');
            onLoginSuccess(userData);
          }, 100);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield size={16} />;
      case 'VienChuc':
        return <Users size={16} />;
      case 'NguoiDuyet':
        return <Shield size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'Quản trị viên';
      case 'VienChuc':
        return 'Viên chức';
      case 'NguoiDuyet':
        return 'Người duyệt';
      default:
        return role;
    }
  };

  const selectedUser = mockUsers.find(u => u.email === email);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal-content">
        <button
          className="modal-close-btn"
          onClick={onClose}
          disabled={loading}
          aria-label="Đóng"
        >
          <X size={24} />
        </button>

        {/* Left Side - Banner */}
        <AuthModalBanner />

        {/* Right Side - Form */}
        <div className="login-modal-form-container">
          <div className="login-header">
            <LogIn size={32} color="#1976D2" />
            <h3>Đăng nhập hệ thống</h3>
            <p>Quản lý hồ sơ viên chức đi nước ngoài</p>
          </div>

          <form onSubmit={handleLogin} className="sso-form">
            <div className="form-group">
              <label>Email tài khoản TVU:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vd: nguyenvana@tvu.edu.vn"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Đăng nhập
                </>
              )}
            </button>

            {onForgotPassword && (
              <div className="form-actions-center">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="btn-forgot"
                  disabled={loading}
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}
          </form>

          <div className="login-modal-footer">
            <p>&copy; 2025 Trường Đại học Trà Vinh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
