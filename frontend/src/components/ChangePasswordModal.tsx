import React, { useState, FormEvent } from 'react';
import { X, Eye, EyeOff, Lock, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import './ChangePasswordModal.css';
import './LoginModalBanner.css';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordError {
  message: string;
  type: 'error' | 'warning' | 'success';
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<PasswordError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ số';
    }
    return null;
  };

  const validateForm = (): boolean => {
    if (!formData.oldPassword) {
      setError({
        message: 'Vui lòng nhập mật khẩu cũ',
        type: 'error'
      });
      return false;
    }

    if (!formData.newPassword) {
      setError({
        message: 'Vui lòng nhập mật khẩu mới',
        type: 'error'
      });
      return false;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError({
        message: passwordError,
        type: 'error'
      });
      return false;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError({
        message: 'Mật khẩu mới phải khác mật khẩu cũ',
        type: 'error'
      });
      return false;
    }

    if (!formData.confirmPassword) {
      setError({
        message: 'Vui lòng xác nhận mật khẩu mới',
        type: 'error'
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError({
        message: 'Mật khẩu xác nhận không khớp',
        type: 'error'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError({
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError({
          message: data.message || 'Đổi mật khẩu thất bại',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Success
      setError({
        message: 'Đổi mật khẩu thành công!',
        type: 'success'
      });

      // Reset form
      setTimeout(() => {
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        onSuccess();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Change password error:', err);
      setError({
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPasswordStrength = (password: string): string => {
    if (!password) return '';
    if (password.length < 6) return 'Yếu';
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'Trung bình';
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 'Mạnh';
    return 'Khá';
  };

  const getPasswordStrengthClass = (password: string): string => {
    const strength = getPasswordStrength(password);
    if (strength === 'Yếu') return 'weak';
    if (strength === 'Trung bình') return 'medium';
    if (strength === 'Khá') return 'good';
    if (strength === 'Mạnh') return 'strong';
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal-overlay" onClick={handleOverlayClick}>
      <div className="change-password-modal-content">
        {/* Close Button */}
        <button
          className="change-password-modal-close"
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
                <span>Bảo mật thông tin tuyệt đối</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Mã hóa mật khẩu chuẩn quốc tế</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Đổi mật khẩu dễ dàng, an toàn</span>
              </div>
            </div>
            <div className="banner-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Change Password Form */}
        <div className="change-password-modal-form-container">
          <div className="change-password-header">
            <h3>Đổi mật khẩu</h3>
            <p>Tạo mật khẩu mới mạnh và an toàn</p>
          </div>

          {/* Security Info */}
          <div className="change-password-info">
            <Shield size={16} />
            <span>Mật khẩu của bạn được mã hóa và bảo mật</span>
          </div>

          {/* Error/Success Message */}
          {error && (
            <div className={`change-password-alert change-password-alert-${error.type}`}>
              {error.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{error.message}</span>
            </div>
          )}

          {/* Change Password Form */}
          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">
                Mật khẩu cũ <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  disabled={isLoading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  disabled={isLoading}
                  aria-label={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                Mật khẩu mới <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                  aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.newPassword && (
                <div className="password-strength">
                  <div className="strength-label">
                    Độ mạnh: <span className={getPasswordStrengthClass(formData.newPassword)}>{getPasswordStrength(formData.newPassword)}</span>
                  </div>
                  <div className="strength-bars">
                    <div className={`strength-bar ${getPasswordStrengthClass(formData.newPassword)}`}></div>
                    <div className={`strength-bar ${getPasswordStrengthClass(formData.newPassword) !== 'weak' ? getPasswordStrengthClass(formData.newPassword) : ''}`}></div>
                    <div className={`strength-bar ${getPasswordStrengthClass(formData.newPassword) === 'good' || getPasswordStrengthClass(formData.newPassword) === 'strong' ? getPasswordStrengthClass(formData.newPassword) : ''}`}></div>
                    <div className={`strength-bar ${getPasswordStrengthClass(formData.newPassword) === 'strong' ? getPasswordStrengthClass(formData.newPassword) : ''}`}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Xác nhận mật khẩu mới <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="password-requirements">
              <p className="requirements-title">Yêu cầu mật khẩu:</p>
              <ul>
                <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
                  ✓ Ít nhất 6 ký tự
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                  ✓ Ít nhất 1 chữ hoa
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                  ✓ Ít nhất 1 chữ số
                </li>
                <li className={formData.newPassword !== formData.oldPassword && formData.newPassword ? 'valid' : ''}>
                  ✓ Khác mật khẩu cũ
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn-change-password-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                'Đổi mật khẩu'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="change-password-modal-footer">
            <p>
              <Lock size={14} />
              Mật khẩu được mã hóa bằng bcrypt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
