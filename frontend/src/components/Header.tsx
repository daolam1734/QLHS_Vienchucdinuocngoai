import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Home, Settings, HelpCircle, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import LoadingOverlay from './LoadingOverlay';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(user));
      loadStatsAndNotifications(token);
    }
  }, []);

  const loadStatsAndNotifications = async (token: string) => {
    try {
      // Load stats for notifications only with cache-busting
      const statsResponse = await fetch(`http://localhost:3000/api/ho-so/thong-ke/overview?_=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();

        // Create notifications from stats
        const notifs: any[] = [];
        if (statsData.dangDuyet > 0) {
          notifs.push({
            id: 1,
            type: 'pending',
            message: `Bạn có ${statsData.dangDuyet} hồ sơ đang chờ phê duyệt`,
            time: 'Hôm nay'
          });
        }
        if (statsData.boSung > 0) {
          notifs.push({
            id: 2,
            type: 'warning',
            message: `Bạn có ${statsData.boSung} hồ sơ cần bổ sung thông tin`,
            time: 'Hôm nay'
          });
        }
        setNotifications(notifs);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserDropdown && !target.closest('.user-info-container')) {
        setShowUserDropdown(false);
      }
      if (showNotifications && !target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showNotifications]);

  const handleLoginSuccess = (user: any) => {
    console.log('Header - Login successful:', user);
    // Update local state
    setIsLoggedIn(true);
    setUserInfo(user);
    
    // Reload stats if logged in
    const token = localStorage.getItem('token');
    if (token) {
      loadStatsAndNotifications(token);
    }
    
    // Handle navigation based on role
    setIsNavigating(true);
    setTimeout(() => {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else if (user.role === 'VienChuc') {
        navigate('/vien-chuc');
      } else if (user.role === 'NguoiDuyet') {
        navigate('/duyet-ho-so');
      } else {
        navigate('/');
      }
      
      // Clear loading state after navigation
      setTimeout(() => setIsNavigating(false), 500);
    }, 300);
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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call backend logout endpoint
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).catch(err => console.error('Logout API error:', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserInfo(null);
      setNotifications([]);
      setShowUserDropdown(false);
      // Use window.location for complete state reset
      window.location.href = '/';
    }
  };

  const goToDashboard = () => {
    if (userInfo) {
      if (userInfo.role === 'Admin') {
        navigate('/admin');
      } else if (userInfo.role === 'VienChuc') {
        navigate('/');
      } else if (userInfo.role === 'NguoiDuyet') {
        navigate('/duyet-ho-so');
      }
    }
  };

  return (
    <>
      {isNavigating && <LoadingOverlay message="Đang chuyển hướng..." />}
      
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
                  <p>Quản lý Hồ sơ xin phép đi nước ngoài dành cho Viên chức</p>
                </div>
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
      </header>

      {/* Navigation - Outside header for proper sticky behavior */}
      <nav className={`main-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          <div className="container">
            <ul className="nav-menu">
              <li><Link to="/" className={location.pathname === '/' || location.pathname === '/vien-chuc' ? 'active' : ''}>Trang chủ</Link></li>
              <li><Link to="/gioi-thieu" className={location.pathname === '/gioi-thieu' ? 'active' : ''}>Giới thiệu</Link></li>
              <li><Link to="/quy-trinh" className={location.pathname === '/quy-trinh' ? 'active' : ''}>Quy trình – Thủ tục</Link></li>
              <li><Link to="/tai-bieu-mau" className={location.pathname === '/tai-bieu-mau' ? 'active' : ''}>Tải biểu mẫu</Link></li>
              <li><Link to="/huong-dan" className={location.pathname === '/huong-dan' ? 'active' : ''}>Hướng dẫn sử dụng</Link></li>
              
              {isLoggedIn && (
                <>
                  {/* Notifications */}
                  <li className="nav-notifications">
                    <div className="notification-container">
                      <button 
                        className="notification-button"
                        onClick={() => setShowNotifications(!showNotifications)}
                      >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                          <span className="notification-badge">{notifications.length}</span>
                        )}
                      </button>
                      {showNotifications && (
                        <div className="notification-dropdown">
                          <div className="notification-header">
                            <Bell size={20} />
                            <h4>Thông báo</h4>
                          </div>
                          {notifications.length > 0 ? (
                            <div className="notification-list">
                              {notifications.map(notif => (
                                <div key={notif.id} className={`notification-item ${notif.type}`}>
                                  <p>{notif.message}</p>
                                  <span className="notification-time">{notif.time}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="no-notifications">
                              <p>Không có thông báo mới</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                </>
              )}

              {!isLoggedIn ? (
                <li className="nav-login">
                  <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="btn-login"
                  >
                    🔐 Đăng nhập
                  </button>
                </li>
              ) : (
                <li className="nav-user-menu">
                  <div className="user-info-container">
                    <div 
                      className="user-info-bar"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      <User size={18} />
                      <span className="user-name-text">{userInfo?.fullName || 'User'}</span>
                      <button 
                        className={`dropdown-toggle ${showUserDropdown ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUserDropdown(!showUserDropdown);
                        }}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                    {showUserDropdown && (
                      <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                          <User size={20} />
                          <div className="user-details">
                            <div className="user-name">{userInfo?.fullName}</div>
                            <div className="user-role">
                              {userInfo?.role === 'VienChuc' ? 'Viên chức' : 
                               userInfo?.role === 'NguoiDuyet' ? 'Người duyệt' : 
                               userInfo?.role === 'Admin' ? 'Quản trị viên' : 'Người dùng'}
                            </div>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            setShowUserDropdown(false);
                            goToDashboard();
                          }}
                        >
                          <Home size={18} />
                          <span>Trang làm việc</span>
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/thong-tin-ca-nhan');
                          }}
                        >
                          <Settings size={18} />
                          <span>Thông tin cá nhân</span>
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/huong-dan');
                          }}
                        >
                          <HelpCircle size={18} />
                          <span>Hướng dẫn sử dụng</span>
                        </button>
                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item logout-item"
                          onClick={() => {
                            setShowUserDropdown(false);
                            handleLogout();
                          }}
                        >
                          <LogOut size={18} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )}
            </ul>
            
          </div>
      </nav>

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
