import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2, 
  CheckSquare, 
  BarChart3, 
  History,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import './AdminDashboard.css';

// Sub-components
import DashboardOverview from '../components/admin/DashboardOverview';
import HoSoManagement from '../components/admin/HoSoManagement';
import ApprovalQueue from '../components/admin/ApprovalQueue';
import UserManagement from '../components/admin/UserManagement';
import DonViManagement from '../components/admin/DonViManagement';
import ReportsPage from '../components/admin/ReportsPage';
import AuditLogs from '../components/admin/AuditLogs';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Lắng nghe sự kiện thay đổi tab từ DashboardOverview
  useEffect(() => {
    const handleChangeTab = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: string }>;
      setActiveTab(customEvent.detail.tab);
    };

    window.addEventListener('changeAdminTab', handleChangeTab);
    
    return () => {
      window.removeEventListener('changeAdminTab', handleChangeTab);
    };
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      icon: <LayoutDashboard size={20} />,
      component: DashboardOverview
    },
    {
      id: 'hoso',
      label: 'Quản lý hồ sơ',
      icon: <FileText size={20} />,
      component: HoSoManagement
    },
    {
      id: 'approval',
      label: 'Phê duyệt',
      icon: <CheckSquare size={20} />,
      component: ApprovalQueue
    },
    {
      id: 'users',
      label: 'Người dùng',
      icon: <Users size={20} />,
      component: UserManagement
    },
    {
      id: 'donvi',
      label: 'Đơn vị',
      icon: <Building2 size={20} />,
      component: DonViManagement
    },
    {
      id: 'reports',
      label: 'Báo cáo',
      icon: <BarChart3 size={20} />,
      component: ReportsPage
    },
    {
      id: 'audit',
      label: 'Lịch sử',
      icon: <History size={20} />,
      component: AuditLogs
    }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || DashboardOverview;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {!sidebarCollapsed && (
              <>
                <img src="/logo-tvu.svg" alt="TVU" />
                <div className="logo-text">
                  <span className="logo-title">QLHS Admin</span>
                  <span className="logo-subtitle">Trường ĐH Trà Vinh</span>
                </div>
              </>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={sidebarCollapsed ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" title={sidebarCollapsed ? 'Cài đặt' : ''}>
            <span className="nav-icon"><Settings size={20} /></span>
            {!sidebarCollapsed && <span className="nav-label">Cài đặt</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={24} />
            </button>

            <div className="header-search">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm hồ sơ, người dùng..." 
              />
            </div>
          </div>

          <div className="header-right">
            {/* Notifications */}
            <div className="header-notifications">
              <button 
                className="icon-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="notification-badge">5</span>
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="dropdown-header">
                    <h4>Thông báo</h4>
                    <button className="text-button">Đánh dấu đã đọc</button>
                  </div>
                  <div className="notifications-list">
                    <div className="notification-item unread">
                      <div className="notification-icon">
                        <FileText size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">Hồ sơ mới chờ phê duyệt</p>
                        <p className="notification-text">HS001 - Nguyễn Văn A</p>
                        <span className="notification-time">5 phút trước</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon">
                        <CheckSquare size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">Hồ sơ đã được duyệt</p>
                        <p className="notification-text">HS002 - Trần Thị B</p>
                        <span className="notification-time">1 giờ trước</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button className="text-button">Xem tất cả</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="header-user">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user.hoTen?.charAt(0) || 'A'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.hoTen || 'Admin'}</span>
                  <span className="user-role">Quản trị viên</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item">
                    <Users size={16} />
                    <span>Hồ sơ của tôi</span>
                  </div>
                  <div className="dropdown-item">
                    <Settings size={16} />
                    <span>Cài đặt</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <X size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
