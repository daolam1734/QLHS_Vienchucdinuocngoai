import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './ResetPasswordPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Validate token on mount
    if (!token) {
      setError('Link không hợp lệ hoặc đã hết hạn');
      setValidatingToken(false);
      return;
    }

    // In production: validate token with backend
    // For demo: just check if token exists
    setTimeout(() => {
      setTokenValid(true);
      setValidatingToken(false);
    }, 500);
  }, [token]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    }
    if (!/[a-z]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    }
    if (!/[0-9]/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ số';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="loading-spinner"></div>
          <p>Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="error-state">
            <AlertCircle size={48} color="#dc2626" />
            <h2>Link không hợp lệ</h2>
            <p>{error || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'}</p>
            <button onClick={() => navigate('/')} className="btn-back">
              <ArrowLeft size={18} />
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="success-state">
            <CheckCircle size={64} color="#22c55e" />
            <h2>Đặt lại mật khẩu thành công!</h2>
            <p>Mật khẩu của bạn đã được cập nhật. Đang chuyển đến trang đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <Lock size={40} color="#1976D2" />
          <h1>Đặt lại mật khẩu</h1>
          <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">
              <Lock size={18} />
              Mật khẩu mới
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <Lock size={18} />
              Xác nhận mật khẩu
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="password-requirements">
            <p>Mật khẩu phải có:</p>
            <ul>
              <li className={newPassword.length >= 8 ? 'valid' : ''}>Ít nhất 8 ký tự</li>
              <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>Ít nhất 1 chữ hoa</li>
              <li className={/[a-z]/.test(newPassword) ? 'valid' : ''}>Ít nhất 1 chữ thường</li>
              <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>Ít nhất 1 chữ số</li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <Lock size={18} />
                Đặt lại mật khẩu
              </>
            )}
          </button>
        </form>

        <div className="reset-password-footer">
          <button onClick={() => navigate('/')} className="btn-back-link" disabled={isLoading}>
            <ArrowLeft size={16} />
            Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
