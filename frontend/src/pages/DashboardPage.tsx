import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/ChangePasswordModal';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Auto redirect admin to admin dashboard
  useEffect(() => {
    if (user.ma_vai_tro === 'VT_ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user.ma_vai_tro, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleChangePasswordSuccess = () => {
    // Optional: Show success notification
    alert('Mật khẩu đã được thay đổi thành công!');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src="/logo-tvu.svg" alt="Logo TVU" className="header-logo" />
            <div className="header-title">
              <h1>Hệ thống Quản lý Hồ sơ Đi Nước ngoài</h1>
              <p>Trường Đại học Trà Vinh</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user.ho_ten || user.hoTen || user.username}</span>
              <span className="user-email">{user.email}</span>
              <span className="user-role">{user.ten_vai_tro || user.ma_vai_tro}</span>
            </div>
            <button 
              onClick={() => setShowChangePasswordModal(true)} 
              className="btn-change-password"
            >
              Đổi mật khẩu
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <h2>Chào mừng, {user.ho_ten || user.hoTen || user.username}!</h2>
          <p className="welcome-message">
            Bạn đã đăng nhập thành công vào Hệ thống Quản lý Hồ sơ Đi Nước ngoài.
          </p>
          
          <div className="user-details">
            <h3>Thông tin tài khoản</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="info-item">
                <strong>Vai trò:</strong> {user.ten_vai_tro || user.ma_vai_tro || 'Viên chức'}
              </div>
              <div className="info-item">
                <strong>Đơn vị:</strong> {user.ten_don_vi || 'Chưa cập nhật'}
              </div>
            </div>
          </div>

          <div className="dashboard-note">
            <p><strong>Lưu ý:</strong> Các chức năng quản lý hồ sơ đang được phát triển và sẽ sớm được cập nhật.</p>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    </div>
  );
};

export default DashboardPage;
