import React, { useState, FormEvent } from 'react';
import { X, Eye, EyeOff, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import axios from 'axios';
import './LoginModal.css';
import './LoginModalBanner.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  onForgotPassword?: () => void;
}

interface LoginForm {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
  type: 'error' | 'warning' | 'info';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onForgotPassword }) => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const maxAttempts = 5;
  const isLocked = loginAttempts >= maxAttempts;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@tvu\.edu\.vn$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError({
        message: 'Vui lòng nhập email công vụ',
        type: 'error'
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError({
        message: 'Email phải có định dạng @tvu.edu.vn',
        type: 'error'
      });
      return false;
    }

    if (!formData.password) {
      setError({
        message: 'Vui lòng nhập mật khẩu',
        type: 'error'
      });
      return false;
    }

    if (formData.password.length < 6) {
      setError({
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
        type: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError({
        message: `Tài khoản đã bị khóa tạm thời do nhập sai quá ${maxAttempts} lần. Vui lòng liên hệ Phòng TCHC để hỗ trợ.`,
        type: 'error'
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call real API
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { user, token, refreshToken } = response.data.data;
        
        // Store tokens and user info
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setLoginAttempts(0);
        onLoginSuccess(user);
        onClose();
      } else {
        setLoginAttempts(prev => prev + 1);
        const remainingAttempts = maxAttempts - loginAttempts - 1;
        
        if (remainingAttempts > 0) {
          setError({
            message: `${response.data.message} Còn ${remainingAttempts} lần thử.`,
            type: 'error'
          });
        } else {
          setError({
            message: `Tài khoản đã bị khóa tạm thời do nhập sai quá ${maxAttempts} lần. Vui lòng liên hệ Phòng TCHC.`,
            type: 'error'
          });
        }
      }
    } catch (err: any) {
      setLoginAttempts(prev => prev + 1);
      const remainingAttempts = maxAttempts - loginAttempts - 1;
      
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      
      if (remainingAttempts > 0) {
        setError({
          message: `${errorMessage} Còn ${remainingAttempts} lần thử.`,
          type: 'error'
        });
      } else {
        setError({
          message: `Tài khoản đã bị khóa tạm thời do nhập sai quá ${maxAttempts} lần. Vui lòng liên hệ Phòng TCHC.`,
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal-content">
        {/* Close Button */}
        <button
          className="login-modal-close"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={24} />
        </button>

        {/* Left Side - Banner */}
        <div className="login-modal-banner">
          <div className="banner-content">
            <div className="banner-logo">
              <img 
                src="https://www.tvu.edu.vn/wp-content/uploads/2017/04/logo-tv-university.png" 
                alt="Logo Trường Đại học Trà Vinh" 
              />
            </div>
            <h1 className="banner-title">Trường Đại học Trà Vinh</h1>
            <h2 className="banner-subtitle">Hệ thống Quản lý Hồ sơ<br/>Đi Nước Ngoài</h2>
            <div className="banner-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Quản lý hồ sơ tập trung</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Theo dõi tiến độ trực tuyến</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Xử lý nhanh chóng, minh bạch</span>
              </div>
            </div>
            <div className="banner-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-modal-form-container">
          <div className="login-header">
            <h3>Đăng nhập hệ thống</h3>
            <p>Sử dụng email công vụ @tvu.edu.vn</p>
          </div>

          {/* User roles info */}
          <div className="login-info">
            <Shield size={16} />
            <span>Dành cho viên chức, cán bộ quản lý và phòng TCHC</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`login-alert login-alert-${error.type}`}>
              <AlertCircle size={20} />
              <span>{error.message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                Email công vụ <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@tvu.edu.vn"
                  disabled={isLocked || isLoading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Mật khẩu <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  disabled={isLocked || isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || isLoading}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <button 
                type="button" 
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Forgot password clicked', { onForgotPassword });
                  if (onForgotPassword) {
                    onForgotPassword();
                  }
                }}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={isLocked || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Đang đăng nhập...</span>
                </>
              ) : isLocked ? (
                'Tài khoản đã bị khóa'
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Demo info */}
            <div className="demo-info">
              <small>
                <strong>Tài khoản demo:</strong> demo@tvu.edu.vn / tvu123456
              </small>
            </div>
          </form>

          {/* Footer */}
          <div className="login-modal-footer">
            <p>
              <Lock size={14} />
              Kết nối được bảo mật và mã hóa
            </p>
            <p className="support-text">
              Cần hỗ trợ? Liên hệ Phòng TCHC: 
              <a href="mailto:dev@tvu.edu.vn"> dev@tvu.edu.vn</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
