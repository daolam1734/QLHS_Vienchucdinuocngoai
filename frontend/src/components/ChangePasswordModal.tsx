import React, { useState } from 'react';
import { X, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import AuthModalBanner from './AuthModalBanner';
import './ChangePasswordModal.css';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
  isFirstLogin?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userEmail,
  isFirstLogin = false 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }
    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ thường';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải có ít nhất 1 chữ số';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword === currentPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          email: userEmail,
          currentPassword,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setTimeout(() => {
          onSuccess();
          resetForm();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    if (!loading && !isFirstLogin) {
      resetForm();
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading && !isFirstLogin) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal-overlay" onClick={handleOverlayClick}>
      <div className="change-password-modal-content">
        {!isFirstLogin && (
          <button
            className="change-password-modal-close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Đóng"
          >
            <X size={24} />
          </button>
        )}

        {/* Left Side - Banner */}
        <AuthModalBanner 
          title="Bảo mật tài khoản"
          subtitle="Đổi mật khẩu định kỳ"
          features={[
            'Mật khẩu mạnh bảo vệ tài khoản',
            'Đổi mật khẩu định kỳ',
            'Không chia sẻ mật khẩu',
            'Sử dụng mật khẩu phức tạp'
          ]}
        />

        {/* Right Side - Form */}
        <div className="change-password-modal-form-container">
          <div className="change-password-header">
            <Lock size={32} color="#1976D2" />
            <h3>{isFirstLogin ? 'Đổi mật khẩu bắt buộc' : 'Đổi mật khẩu'}</h3>
            <p>
              {isFirstLogin 
                ? 'Vì lý do bảo mật, bạn cần đổi mật khẩu trước khi tiếp tục sử dụng hệ thống'
                : 'Nhập mật khẩu hiện tại và mật khẩu mới của bạn'
              }
            </p>
          </div>
          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-group">
              <label>Mật khẩu hiện tại:</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="password-requirements">
                <p className="requirements-title">Yêu cầu mật khẩu:</p>
                <ul>
                  <li className={newPassword.length >= 8 ? 'valid' : ''}>
                    Ít nhất 8 ký tự
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                    Ít nhất 1 chữ hoa
                  </li>
                  <li className={/[a-z]/.test(newPassword) ? 'valid' : ''}>
                    Ít nhất 1 chữ thường
                  </li>
                  <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>
                    Ít nhất 1 chữ số
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu mới:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="message error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="message success-message">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            >
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>

            {!isFirstLogin && (
              <button
                type="button"
                onClick={handleClose}
                className="btn-cancel"
                disabled={loading}
              >
                Hủy
              </button>
            )}
          </form>

          <div className="change-password-modal-footer">
            <p>&copy; 2025 Trường Đại học Trà Vinh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
