import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Plus, Edit2, Trash2,
  LayoutDashboard, FolderOpen, Download, Menu, X, Settings, FileBarChart,
  Bell, HelpCircle, BookOpen
} from 'lucide-react';
import Header from '../components/Header';
import HoSoModal from '../components/HoSoModal';
import Footer from '../components/Footer';
import './DashboardVienChuc.css';

interface HoSo {
  ma_ho_so: string;
  quoc_gia_den: string;
  to_chuc_moi: string;
  muc_dich: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  trang_thai: string;
  created_at: string;
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  action?: string;
}

interface QuickAction {
  icon: any;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
  enabled: boolean;
}

function DashboardVienChuc() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    moiTao: 0,
    dangDuyet: 0,
    daDuyet: 0,
    tuChoi: 0,
    boSung: 0
  });
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [allHoSoList, setAllHoSoList] = useState<HoSo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllHoSo, setShowAllHoSo] = useState(false);
  const [editingHoSo, setEditingHoSo] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
    { icon: FolderOpen, label: 'Hồ sơ của tôi', id: 'my-profiles', path: '/my-profiles' },
    { icon: Plus, label: 'Tạo hồ sơ mới', id: 'create', path: '/create-profile' },
    { icon: FileBarChart, label: 'Báo cáo sau chuyến đi', id: 'reports', path: '/reports' },
    { icon: Download, label: 'Biểu mẫu', id: 'templates', path: '/templates' },
    { icon: BookOpen, label: 'Hướng dẫn', id: 'guides', path: '/guides' },
    { icon: Settings, label: 'Cài đặt', id: 'settings', path: '/settings' }
  ];

  const quickActions: QuickAction[] = [
    {
      icon: Plus,
      label: 'Tạo hồ sơ mới',
      description: 'Đăng ký chuyến đi nước ngoài mới',
      color: 'primary',
      onClick: () => navigate('/tao-ho-so'),
      enabled: true
    },
    {
      icon: Download,
      label: 'Tải biểu mẫu',
      description: 'Download templates và forms',
      color: 'secondary',
      onClick: () => {},
      enabled: true
    },
    {
      icon: HelpCircle,
      label: 'Hướng dẫn',
      description: 'Hướng dẫn nộp hồ sơ',
      color: 'info',
      onClick: () => {},
      enabled: true
    },
    {
      icon: FileBarChart,
      label: 'Báo cáo',
      description: 'Nộp báo cáo sau chuyến đi',
      color: 'warning',
      onClick: () => {},
      enabled: false
    }
  ];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load stats with cache-busting
      const statsResponse = await fetch(`http://localhost:3000/api/ho-so/thong-ke/overview?_=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
        
        // Create notifications from stats
        const newNotifications: Notification[] = [];
        if (statsData.dangDuyet > 0) {
          newNotifications.push({
            id: 1,
            type: 'warning',
            title: 'Hồ sơ đang chờ duyệt',
            message: `Bạn có ${statsData.dangDuyet} hồ sơ đang chờ phê duyệt`,
            time: '5 phút trước'
          });
        }
        if (statsData.boSung > 0) {
          newNotifications.push({
            id: 2,
            type: 'error',
            title: 'Cần bổ sung thông tin',
            message: `${statsData.boSung} hồ sơ cần bổ sung thông tin`,
            time: '10 phút trước',
            action: 'Xem chi tiết'
          });
        }
        if (statsData.daDuyet > 0) {
          newNotifications.push({
            id: 3,
            type: 'success',
            title: 'Hồ sơ đã được duyệt',
            message: `${statsData.daDuyet} hồ sơ đã được phê duyệt thành công`,
            time: '1 giờ trước'
          });
        }
        setNotifications(newNotifications);
      }

      // Load recent ho so with cache-busting
      const hoSoResponse = await fetch(`http://localhost:3000/api/ho-so?limit=5&_=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (hoSoResponse.ok) {
        const hoSoData = await hoSoResponse.json();
        setHoSoList(hoSoData.data || []);
      }

      // Load all ho so with cache-busting
      const allHoSoResponse = await fetch(`http://localhost:3000/api/ho-so?_=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (allHoSoResponse.ok) {
        const allHoSoData = await allHoSoResponse.json();
        setAllHoSoList(allHoSoData.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      'MoiTao': { text: 'Mới tạo', class: 'badge-new' },
      'DangDuyet': { text: 'Đang duyệt', class: 'badge-pending' },
      'DaDuyet': { text: 'Đã duyệt', class: 'badge-approved' },
      'TuChoi': { text: 'Từ chối', class: 'badge-rejected' },
      'BoSung': { text: 'Cần bổ sung', class: 'badge-supplement' }
    };
    const statusInfo = statusMap[status] || { text: status, class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleCreateSuccess = () => {
    loadData();
  };

  const handleEditHoSo = (hoSo: HoSo) => {
    setEditingHoSo(hoSo);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingHoSo(null);
  };

  const handleDeleteHoSo = async (hoSoId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/ho-so/${hoSoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadData();
      } else {
        alert('Không thể xóa hồ sơ');
      }
    } catch (error) {
      console.error('Error deleting ho so:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleMenuClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (itemId === 'create') {
      setShowCreateModal(true);
    } else if (itemId === 'my-profiles') {
      setShowAllHoSo(true);
    }
  };

  const handleStatClick = () => {
    setShowAllHoSo(true);
    // TODO: Filter by status in future
  };

  return (
    <div className="dashboard-vienchuc-new">
      <Header />
      
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeMenuItem === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-container">
            {/* Welcome Stats */}
            <div className="welcome-stats">
              <div className="welcome-content">
                <h1>Chào buổi sáng, <span className="highlight">{userInfo?.fullName}</span>! 👋</h1>
                <p>Hôm nay bạn có <strong>{stats.dangDuyet} hồ sơ</strong> đang chờ xử lý</p>
              </div>
              <div className="welcome-side">
                <p className="label">Hồ sơ sắp khởi hành</p>
                <p className="value">{stats.daDuyet} chuyến đi</p>
              </div>
            </div>

            {/* Statistics Cards */}
            {loading ? (
              <div className="loading-stats">Đang tải thống kê...</div>
            ) : (
              <>
                <div className="stats-cards">
                  <div 
                    className="stat-card-new blue" 
                    onClick={handleStatClick}
                  >
                    <div className="stat-content">
                      <p className="stat-label">Mới tạo</p>
                      <p className="stat-value">{stats.moiTao}</p>
                    </div>
                    <span className="stat-icon">🆕</span>
                  </div>

                  <div 
                    className="stat-card-new yellow" 
                    onClick={handleStatClick}
                  >
                    <div className="stat-content">
                      <p className="stat-label">Đang xử lý</p>
                      <p className="stat-value">{stats.dangDuyet}</p>
                    </div>
                    <span className="stat-icon">⏳</span>
                  </div>

                  <div 
                    className="stat-card-new green" 
                    onClick={handleStatClick}
                  >
                    <div className="stat-content">
                      <p className="stat-label">Đã duyệt</p>
                      <p className="stat-value">{stats.daDuyet}</p>
                    </div>
                    <span className="stat-icon">✅</span>
                  </div>

                  <div 
                    className="stat-card-new red" 
                    onClick={handleStatClick}
                  >
                    <div className="stat-content">
                      <p className="stat-label">Từ chối</p>
                      <p className="stat-value">{stats.tuChoi}</p>
                    </div>
                    <span className="stat-icon">❌</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                  <h3>🚀 Hành động nhanh</h3>
                  <div className="quick-actions-grid">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        className={`quick-action-btn ${action.color} ${!action.enabled ? 'disabled' : ''}`}
                        onClick={action.onClick}
                        disabled={!action.enabled}
                      >
                        <action.icon size={24} />
                        <span className="action-label">{action.label}</span>
                        <span className="action-description">{action.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Grid Layout */}
                <div className="dashboard-grid">
                  {/* Recent Profiles */}
                  <div className="recent-profiles-card">
                    <div className="card-header">
                      <h3>📋 Hồ sơ gần đây</h3>
                      <button 
                        className="btn-view-all"
                        onClick={() => setShowAllHoSo(true)}
                      >
                        Xem tất cả →
                      </button>
                    </div>
                    <div className="profiles-list">
                      {hoSoList.length > 0 ? (
                        hoSoList.map((hoSo, index) => (
                          <div 
                            key={hoSo.ma_ho_so || `profile-${index}`}
                            className="profile-item"
                            onClick={() => handleEditHoSo(hoSo)}
                          >
                            <div className="profile-indicator">
                              <div className={`status-dot ${hoSo.trang_thai.toLowerCase()}`}></div>
                            </div>
                            <div className="profile-content">
                              <p className="profile-title">{hoSo.quoc_gia_den}</p>
                              <p className="profile-meta">
                                {formatDate(hoSo.ngay_bat_dau)} → {formatDate(hoSo.ngay_ket_thuc)}
                              </p>
                            </div>
                            <div className="profile-actions">
                              {getStatusBadge(hoSo.trang_thai)}
                              <span className="arrow">→</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <FileText size={48} />
                          <p>Chưa có hồ sơ nào</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notifications Panel */}
                  <div className="notifications-panel">
                    <h3>🔔 Thông báo</h3>
                    <div className="notifications-list">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`notification-item ${notif.type}`}
                          >
                            <div className="notification-content">
                              <p className="notification-title">{notif.title}</p>
                              <p className="notification-message">{notif.message}</p>
                              <span className="notification-time">{notif.time}</span>
                            </div>
                            {notif.action && (
                              <button className="notification-action">{notif.action}</button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <Bell size={48} />
                          <p>Không có thông báo mới</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* All Ho So List */}
                {showAllHoSo && (
                  <div className="all-hoso-section">
                    <div className="section-header">
                      <h2>Tất cả hồ sơ ({allHoSoList.length})</h2>
                      <button 
                        className="btn-close-list"
                        onClick={() => setShowAllHoSo(false)}
                      >
                        Thu gọn
                      </button>
                    </div>
                    <div className="full-hoso-list">
                      {allHoSoList.map((hoSo, index) => (
                        <div key={hoSo.ma_ho_so || `all-${index}`} className="hoso-item">
                          <div className="hoso-header">
                            <h3>{hoSo.quoc_gia_den}</h3>
                            {getStatusBadge(hoSo.trang_thai)}
                          </div>
                          <div className="hoso-info">
                            <p><strong>Tổ chức:</strong> {hoSo.to_chuc_moi}</p>
                            <p><strong>Mục đích:</strong> {hoSo.muc_dich}</p>
                            <p><strong>Thời gian:</strong> {formatDate(hoSo.ngay_bat_dau)} - {formatDate(hoSo.ngay_ket_thuc)}</p>
                          </div>
                          <div className="hoso-footer">
                            <span className="created-date">Tạo ngày: {formatDate(hoSo.created_at)}</span>
                            <div className="hoso-actions">
                              <button 
                                className="action-btn edit"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditHoSo(hoSo);
                                }}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                className="action-btn delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHoSo(hoSo.ma_ho_so);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Create/Edit Modal */}
      <HoSoModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleCreateSuccess}
        editingHoSo={editingHoSo}
      />
    </div>
  );
}

export default DashboardVienChuc;
