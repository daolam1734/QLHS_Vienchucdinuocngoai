import React, { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import AuthModalBanner from './AuthModalBanner';
import './ForgotPasswordModal.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Vui lòng nhập địa chỉ email';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email không hợp lệ';
    
    if (!email.endsWith('@tvu.edu.vn')) {
      return 'Chỉ chấp nhận email có đuôi @tvu.edu.vn';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });

      if (response.data.success) {
        setSuccess(response.data.message || 'Đã gửi email chứa link đặt lại mật khẩu.');
        
        // For demo: Display reset link
        if (response.data.resetLink) {
          setResetLink(response.data.resetLink);
        }
        
        setEmail('');
        
        // Don't auto-close if showing reset link
        if (!response.data.resetLink) {
          setTimeout(() => {
            onClose();
            if (onOpenLogin) onOpenLogin();
            setSuccess('');
          }, 5000);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-modal-overlay" onClick={handleOverlayClick}>
      <div className="forgot-password-modal-content">
        <button className="forgot-password-close-btn" onClick={onClose} aria-label="Đóng">
          <X size={24} />
        </button>

        {/* Left Side - Banner */}
        <AuthModalBanner 
          title="Khôi phục mật khẩu"
          subtitle="Lấy lại truy cập tài khoản"
          features={[
            'Email khôi phục nhanh chóng',
            'Quy trình bảo mật cao',
            'Hỗ trợ 24/7',
            'Xác thực an toàn'
          ]}
        />

        {/* Right Side - Forgot Password Form */}
        <div className="forgot-password-form-section">
          <div className="forgot-password-form-container">
            <div className="forgot-password-header">
              <Mail size={32} color="#1976D2" />
              <h2>Quên Mật Khẩu</h2>
              <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
            </div>

            {error && (
              <div className="forgot-password-alert forgot-password-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="forgot-password-alert forgot-password-alert-success">
                <CheckCircle size={18} />
                <div>
                  <div>{success}</div>
                  {resetLink && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px' }}>
                      <strong style={{ color: '#15803d', display: 'block', marginBottom: '12px', fontSize: '14px' }}>Link đặt lại mật khẩu (DEMO):</strong>
                      <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '12px', wordBreak: 'break-all', fontSize: '13px', color: '#1976D2' }}>
                        {resetLink}
                      </div>
                      <button
                        onClick={() => {
                          window.location.href = resetLink;
                        }}
                        style={{ width: '100%', padding: '10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        ➡️ Mở link đổi mật khẩu
                      </button>
                      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>Trong hệ thống thực, link sẽ được gửi qua email</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="forgot-password-form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@tvu.edu.vn"
                  disabled={isLoading}
                  autoFocus
                />
                <span className="forgot-password-input-hint">
                  Chỉ chấp nhận email có đuôi @tvu.edu.vn
                </span>
              </div>

              <button 
                type="submit" 
                className="forgot-password-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="forgot-password-spinner"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Gửi Email Khôi Phục
                  </>
                )}
              </button>

              <div className="forgot-password-back-to-login">
                <button 
                  type="button" 
                  onClick={() => {
                    setSuccess('');
                    setResetLink('');
                    setError('');
                    onClose();
                    if (onOpenLogin) onOpenLogin();
                  }}
                  className="forgot-password-back-link"
                  disabled={isLoading}
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            </form>

            <div className="forgot-password-info">
              <div className="forgot-password-info-box">
                <AlertCircle size={18} />
                <div>
                  <strong>Lưu ý:</strong>
                  <ul>
                    <li>Nhập email tài khoản TVU (@tvu.edu.vn)</li>
                    <li>Link đặt lại mật khẩu sẽ được gửi vào email của bạn</li>
                    <li>Link có hiệu lực trong 1 giờ</li>
                    <li>Kiểm tra cả thư mục spam nếu không thấy email</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="forgot-password-modal-footer">
              <p>&copy; 2025 Trường Đại học Trà Vinh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
