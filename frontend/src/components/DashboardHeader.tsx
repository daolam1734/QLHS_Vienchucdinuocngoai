import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, FileText, CheckSquare, Menu, X } from 'lucide-react';
import './DashboardHeader.css';

interface UserInfo {
  email: string;
  fullName: string;
  role: string;
  maVienChuc?: string;
  maNguoiDuyet?: string;
}

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

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
      // Clear local storage and navigate
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const canAccessStaff = user?.role === 'VienChuc' || user?.role === 'Admin';
  const canAccessApproval = user?.role === 'NguoiDuyet' || user?.role === 'Admin';
  const canAccessAdmin = user?.role === 'Admin';

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        {/* Logo & Title */}
        <div className="dashboard-brand">
          <img src="/logo-tvu.svg" alt="Logo TVU" className="dashboard-logo" />
          <div className="dashboard-title">
            <h1>QLHS Đi Nước Ngoài</h1>
            <p>Trường ĐH Trà Vinh</p>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav className={`dashboard-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            {canAccessStaff && (
              <li>
                <Link
                  to="/quan-ly-ho-so"
                  className={isActive('/quan-ly-ho-so')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText size={18} />
                  <span>Quản lý Hồ sơ</span>
                </Link>
              </li>
            )}
            {canAccessApproval && (
              <li>
                <Link
                  to="/duyet-ho-so"
                  className={isActive('/duyet-ho-so')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CheckSquare size={18} />
                  <span>Duyệt Hồ sơ</span>
                </Link>
              </li>
            )}
            {canAccessAdmin && (
              <li>
                <Link
                  to="/admin"
                  className={isActive('/admin')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Quản trị</span>
                </Link>
              </li>
            )}
          </ul>

          {/* User info */}
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-details">
                <div className="user-name">{user?.fullName || 'User'}</div>
                <div className="user-role">
                  {user?.role === 'VienChuc' && 'Viên chức'}
                  {user?.role === 'NguoiDuyet' && 'Người duyệt'}
                  {user?.role === 'Admin' && 'Quản trị viên'}
                </div>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Đăng xuất">
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
