import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user);
    // Admin goes to admin dashboard, regular users to user dashboard
    if (user.ma_vai_tro === 'VT_ADMIN') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = () => {
    // Quick fade out LoginModal
    const loginOverlay = document.querySelector('.login-modal-overlay') as HTMLElement;
    if (loginOverlay) {
      loginOverlay.style.transition = 'opacity 0.25s ease-out';
      loginOverlay.style.opacity = '0';
    }
    // Start showing new modal while old one is fading
    setTimeout(() => {
      setShowLoginModal(false);
      setShowForgotPasswordModal(true);
    }, 150);
  };

  const handleBackToLogin = () => {
    // Quick fade out ForgotPasswordModal
    const forgotOverlay = document.querySelector('.forgot-password-modal-overlay') as HTMLElement;
    if (forgotOverlay) {
      forgotOverlay.style.transition = 'opacity 0.25s ease-out';
      forgotOverlay.style.opacity = '0';
    }
    // Start showing new modal while old one is fading
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setShowLoginModal(true);
    }, 150);
  };

  return (
    <>
      <header className="main-header">
        {/* Top bar */}
        <div className="header-top">
          <div className="container">
            <div className="header-contact">
              <span>📞 Hotline: 0294.3855.246</span>
              <span>✉️ Email: tchc@tvu.edu.vn</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="header-main">
          <div className="container">
            <div className="header-content">
              {/* Logo & Title */}
              <div className="header-brand">
                <img 
                  src="/logo-tvu.svg" 
                  alt="Logo Trường ĐH Trà Vinh" 
                  className="header-logo"
                />
                <div className="header-title">
                  <h1>Cổng Dịch vụ Trực tuyến</h1>
                  <p>Quản lý Hồ sơ Xin phép Đi Nước Ngoài dành cho Viên chức</p>
                </div>
              </div>

              {/* Search bar - Desktop */}
              <div className="header-search desktop-only">
                <form onSubmit={handleSearch}>
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Nhập mã hồ sơ để tra cứu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <Search size={20} />
                      Tra cứu
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile menu toggle */}
              <button 
                className="mobile-menu-toggle mobile-only"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`main-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          <div className="container">
            <ul className="nav-menu">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/gioi-thieu">Giới thiệu hệ thống</Link></li>
              <li><Link to="/quy-trinh">Quy trình – Thủ tục</Link></li>
              <li><Link to="/tai-bieu-mau">Tải biểu mẫu</Link></li>
              <li><Link to="/huong-dan">Hướng dẫn sử dụng</Link></li>
              <li className="nav-login">
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="btn-login"
                >
                  🔐 Đăng nhập
                </button>
              </li>
            </ul>

            {/* Mobile search */}
            <div className="header-search mobile-only">
              <form onSubmit={handleSearch}>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Tra cứu mã hồ sơ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit">
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </nav>
      </header>

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Yêu cầu đăng nhập</h3>
              <button onClick={() => setShowLoginPrompt(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>Vui lòng đăng nhập để sử dụng chức năng tra cứu hồ sơ.</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowLoginPrompt(false)}
              >
                Đóng
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowLoginPrompt(false);
                  setShowLoginModal(true);
                }}
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={handleForgotPassword}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onOpenLogin={handleBackToLogin}
      />
    </>
  );
};

export default Header;
