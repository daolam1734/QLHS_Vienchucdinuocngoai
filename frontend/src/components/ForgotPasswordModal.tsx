import React, { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import './ForgotPasswordModal.css';
import './LoginModalBanner.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      const response = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
        setEmail('');
        
        // Close modal after 5 seconds
        setTimeout(() => {
          onClose();
          if (onOpenLogin) onOpenLogin();
          setSuccess('');
        }, 5000);
      } else {
        setError(data.message || 'Không thể gửi email. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
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
        {/* Left Side - Banner */}
        <div className="login-modal-banner">
          <div className="banner-background">
            <div className="banner-circle banner-circle-1"></div>
            <div className="banner-circle banner-circle-2"></div>
            <div className="banner-circle banner-circle-3"></div>
          </div>
          
          <div className="banner-content">
            <div className="banner-logo">
              <img src="/logo-tvu.svg" alt="Logo TVU" />
            </div>
            
            <h2 className="banner-title">Quên Mật Khẩu</h2>
            <p className="banner-subtitle">Hệ thống Quản lý Hồ sơ Đi Nước ngoài</p>
            
            <div className="banner-features">
              <div className="banner-feature">
                <div className="feature-icon">
                  <Mail size={20} />
                </div>
                <div className="feature-text">
                  <h4>Email khôi phục</h4>
                  <p>Nhận hướng dẫn qua email</p>
                </div>
              </div>
              
              <div className="banner-feature">
                <div className="feature-icon">
                  <CheckCircle size={20} />
                </div>
                <div className="feature-text">
                  <h4>An toàn & Bảo mật</h4>
                  <p>Quy trình xác thực chặt chẽ</p>
                </div>
              </div>
              
              <div className="banner-feature">
                <div className="feature-icon">
                  <AlertCircle size={20} />
                </div>
                <div className="feature-text">
                  <h4>Hỗ trợ 24/7</h4>
                  <p>Liên hệ IT nếu cần hỗ trợ</p>
                </div>
              </div>
            </div>
            
            <div className="banner-footer">
              <p>© 2025 Trường Đại học Trà Vinh</p>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="forgot-password-form-section">
          <button className="forgot-password-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={24} />
          </button>

          <div className="forgot-password-form-container">
            <div className="forgot-password-header">
              <h2>Quên Mật Khẩu</h2>
              <p>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</p>
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
                <span>{success}</span>
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
                    <li>Kiểm tra cả hộp thư spam/junk nếu không thấy email</li>
                    <li>Link khôi phục có hiệu lực trong 1 giờ</li>
                    <li>Liên hệ IT Support nếu không nhận được email sau 5 phút</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
