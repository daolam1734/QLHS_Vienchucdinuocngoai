import { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, XCircle, AlertCircle, Eye,
  LayoutDashboard, FolderOpen, FileCheck, Menu, X, Settings, BarChart3,
  Bell, HelpCircle, BookOpen, TrendingUp, Filter
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorkflowTimeline from '../components/WorkflowTimeline';
import './DashboardNguoiDuyet.css';

interface HoSoChoDuyet {
  ma_ho_so: string;
  ma_duyet: string;
  cap_duyet: number;
  vai_tro_duyet: string;
  ten_vien_chuc: string;
  email_vien_chuc: string;
  is_dang_vien: boolean;
  ten_don_vi: string;
  loai_chuyen_di: string;
  quoc_gia_den: string;
  muc_dich: string;
  muc_do_uu_tien: string;
  trang_thai: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  ngay_tao: string;
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  action?: string;
}

interface ThongKe {
  cho_duyet: number;
  da_duyet: number;
  tu_choi: number;
  yeu_cau_bo_sung: number;
  tong_ho_so: number;
}

function DashboardNguoiDuyet() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [thongKe, setThongKe] = useState<ThongKe>({
    cho_duyet: 0,
    da_duyet: 0,
    tu_choi: 0,
    yeu_cau_bo_sung: 0,
    tong_ho_so: 0
  });
  const [hoSoList, setHoSoList] = useState<HoSoChoDuyet[]>([]);
  const [recentHoSo, setRecentHoSo] = useState<HoSoChoDuyet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllHoSo, setShowAllHoSo] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoChoDuyet | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [yKien, setYKien] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
    { icon: FolderOpen, label: 'Hồ sơ chờ duyệt', id: 'pending', path: '/pending' },
    { icon: FileCheck, label: 'Hồ sơ đã duyệt', id: 'approved', path: '/approved' },
    { icon: BarChart3, label: 'Thống kê & Báo cáo', id: 'reports', path: '/reports' },
    { icon: BookOpen, label: 'Hướng dẫn duyệt', id: 'guides', path: '/guides' },
    { icon: Settings, label: 'Cài đặt', id: 'settings', path: '/settings' }
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
      setLoading(true);
      const token = localStorage.getItem('token');

      // Load thống kê
      const thongKeRes = await fetch('http://localhost:3000/api/workflow/thong-ke', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (thongKeRes.ok) {
        const result = await thongKeRes.json();
        if (result.success) {
          setThongKe(result.data);

          // Create notifications from stats
          const newNotifications: Notification[] = [];
          if (result.data.cho_duyet > 0) {
            newNotifications.push({
              id: 1,
              type: 'warning',
              title: 'Hồ sơ chờ duyệt',
              message: `Bạn có ${result.data.cho_duyet} hồ sơ cần xem xét và phê duyệt`,
              time: '5 phút trước',
              action: 'Xem ngay'
            });
          }
          if (result.data.yeu_cau_bo_sung > 0) {
            newNotifications.push({
              id: 2,
              type: 'info',
              title: 'Đã yêu cầu bổ sung',
              message: `${result.data.yeu_cau_bo_sung} hồ sơ đang chờ viên chức bổ sung thông tin`,
              time: '15 phút trước'
            });
          }
          if (result.data.da_duyet > 0) {
            newNotifications.push({
              id: 3,
              type: 'success',
              title: 'Hoàn thành duyệt',
              message: `Bạn đã duyệt thành công ${result.data.da_duyet} hồ sơ`,
              time: '1 giờ trước'
            });
          }
          setNotifications(newNotifications);
        }
      }

      // Load danh sách hồ sơ chờ duyệt
      const hoSoRes = await fetch('http://localhost:3000/api/workflow/cho-duyet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (hoSoRes.ok) {
        const result = await hoSoRes.json();
        if (result.success) {
          setHoSoList(result.data);
          setRecentHoSo(result.data.slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (trang_thai: 'DaDuyet' | 'TuChoi' | 'YeuCauBoSung') => {
    if (!selectedHoSo) return;

    if (trang_thai === 'TuChoi' && !yKien.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (trang_thai === 'YeuCauBoSung' && !yKien.trim()) {
      alert('Vui lòng nhập nội dung cần bổ sung');
      return;
    }

    const confirmMessage =
      trang_thai === 'DaDuyet' ? 'Bạn có chắc muốn phê duyệt hồ sơ này?' :
      trang_thai === 'TuChoi' ? 'Bạn có chắc muốn từ chối hồ sơ này?' :
      'Bạn có chắc muốn yêu cầu bổ sung hồ sơ này?';

    if (!confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/api/workflow/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ma_duyet: selectedHoSo.ma_duyet,
          trang_thai,
          y_kien: yKien.trim() || undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setShowDetailModal(false);
        setSelectedHoSo(null);
        setYKien('');
        loadData();
      } else {
        alert(result.message || 'Lỗi khi xử lý duyệt hồ sơ');
      }
    } catch (error: any) {
      console.error('Error approving:', error);
      alert('Có lỗi xảy ra khi xử lý duyệt hồ sơ');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: any = {
      'KhanCap': { text: 'Khẩn cấp', class: 'badge-urgent' },
      'Cao': { text: 'Cao', class: 'badge-high' },
      'BinhThuong': { text: 'Bình thường', class: 'badge-normal' }
    };
    return badges[priority] || badges['BinhThuong'];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleMenuClick = (itemId: string) => {
    setActiveMenuItem(itemId);
    if (itemId === 'pending') {
      setShowAllHoSo(true);
    }
  };

  const handleViewDetail = (hoSo: HoSoChoDuyet) => {
    setSelectedHoSo(hoSo);
    setShowDetailModal(true);
    setYKien('');
  };

  const getFilteredHoSo = () => {
    if (filterPriority === 'all') {
      return hoSoList;
    }
    return hoSoList.filter(hs => hs.muc_do_uu_tien === filterPriority);
  };

  return (
    <div className="dashboard-nguoiduyet">
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
                <p>Hôm nay bạn có <strong>{thongKe.cho_duyet} hồ sơ</strong> cần xem xét và phê duyệt</p>
              </div>
              <div className="welcome-side">
                <p className="label">Hiệu suất duyệt</p>
                <p className="value">
                  <TrendingUp size={20} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {thongKe.tong_ho_so > 0 
                    ? Math.round((thongKe.da_duyet / thongKe.tong_ho_so) * 100)
                    : 0}%
                </p>
              </div>
            </div>

            {/* Statistics Cards */}
            {loading ? (
              <div className="loading-stats">Đang tải thống kê...</div>
            ) : (
              <>
                <div className="stats-cards">
                  <div className="stat-card-new yellow" onClick={() => setShowAllHoSo(true)}>
                    <div className="stat-content">
                      <p className="stat-label">Chờ duyệt</p>
                      <p className="stat-value">{thongKe.cho_duyet}</p>
                    </div>
                    <span className="stat-icon">⏳</span>
                  </div>

                  <div className="stat-card-new green">
                    <div className="stat-content">
                      <p className="stat-label">Đã duyệt</p>
                      <p className="stat-value">{thongKe.da_duyet}</p>
                    </div>
                    <span className="stat-icon">✅</span>
                  </div>

                  <div className="stat-card-new red">
                    <div className="stat-content">
                      <p className="stat-label">Từ chối</p>
                      <p className="stat-value">{thongKe.tu_choi}</p>
                    </div>
                    <span className="stat-icon">❌</span>
                  </div>

                  <div className="stat-card-new blue">
                    <div className="stat-content">
                      <p className="stat-label">Yêu cầu bổ sung</p>
                      <p className="stat-value">{thongKe.yeu_cau_bo_sung}</p>
                    </div>
                    <span className="stat-icon">📝</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                  <h3>⚡ Hành động nhanh</h3>
                  <div className="quick-actions-grid">
                    <button
                      className="quick-action-btn primary"
                      onClick={() => setShowAllHoSo(true)}
                      disabled={thongKe.cho_duyet === 0}
                    >
                      <Eye size={24} />
                      <span className="action-label">Xem hồ sơ chờ</span>
                      <span className="action-description">Duyệt {thongKe.cho_duyet} hồ sơ đang chờ</span>
                    </button>
                    <button
                      className="quick-action-btn secondary"
                      onClick={() => {}}
                    >
                      <BarChart3 size={24} />
                      <span className="action-label">Xem báo cáo</span>
                      <span className="action-description">Thống kê hiệu suất duyệt</span>
                    </button>
                    <button
                      className="quick-action-btn info"
                      onClick={() => {}}
                    >
                      <HelpCircle size={24} />
                      <span className="action-label">Hướng dẫn</span>
                      <span className="action-description">Quy trình và chính sách</span>
                    </button>
                    <button
                      className="quick-action-btn warning disabled"
                      disabled
                    >
                      <Filter size={24} />
                      <span className="action-label">Bộ lọc nâng cao</span>
                      <span className="action-description">Đang phát triển</span>
                    </button>
                  </div>
                </div>

                {/* Main Grid Layout */}
                <div className="dashboard-grid">
                  {/* Recent Applications */}
                  <div className="recent-profiles-card">
                    <div className="card-header">
                      <h3>📋 Hồ sơ cần xem xét</h3>
                      <button 
                        className="btn-view-all"
                        onClick={() => setShowAllHoSo(true)}
                      >
                        Xem tất cả →
                      </button>
                    </div>
                    <div className="profiles-list">
                      {recentHoSo.length > 0 ? (
                        recentHoSo.map((hoSo) => {
                          const priority = getPriorityBadge(hoSo.muc_do_uu_tien);
                          return (
                            <div 
                              key={hoSo.ma_ho_so} 
                              className="profile-item"
                              onClick={() => handleViewDetail(hoSo)}
                            >
                              <div className="profile-indicator">
                                <div className="status-dot pending"></div>
                              </div>
                              <div className="profile-content">
                                <p className="profile-title">
                                  {hoSo.ten_vien_chuc} - {hoSo.quoc_gia_den}
                                </p>
                                <p className="profile-meta">
                                  {hoSo.ten_don_vi} • {formatDate(hoSo.thoi_gian_bat_dau)}
                                </p>
                              </div>
                              <div className="profile-actions">
                                <span className={`priority-badge ${priority.class}`}>
                                  {priority.text}
                                </span>
                                <Eye size={16} className="icon-view" />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="empty-state">
                          <FileText size={48} />
                          <p>Không có hồ sơ chờ duyệt</p>
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
                              <button 
                                className="notification-action"
                                onClick={() => setShowAllHoSo(true)}
                              >
                                {notif.action}
                              </button>
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
                      <h2>Danh sách hồ sơ chờ duyệt ({getFilteredHoSo().length})</h2>
                      <div className="header-actions">
                        <select 
                          className="filter-select"
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                        >
                          <option value="all">Tất cả mức độ</option>
                          <option value="KhanCap">Khẩn cấp</option>
                          <option value="Cao">Cao</option>
                          <option value="BinhThuong">Bình thường</option>
                        </select>
                        <button 
                          className="btn-close-list"
                          onClick={() => setShowAllHoSo(false)}
                        >
                          Thu gọn
                        </button>
                      </div>
                    </div>
                    <div className="full-hoso-list">
                      {getFilteredHoSo().map((hoSo) => {
                        const priority = getPriorityBadge(hoSo.muc_do_uu_tien);
                        return (
                          <div key={hoSo.ma_ho_so} className="hoso-item">
                            <div className="hoso-header">
                              <div>
                                <h3>{hoSo.ten_vien_chuc}</h3>
                                <span className="hoso-meta">{hoSo.ten_don_vi}</span>
                              </div>
                              <span className={`priority-badge ${priority.class}`}>
                                {priority.text}
                              </span>
                            </div>
                            <div className="hoso-info">
                              <p><strong>Loại chuyến đi:</strong> {hoSo.loai_chuyen_di}</p>
                              <p><strong>Quốc gia:</strong> {hoSo.quoc_gia_den}</p>
                              <p><strong>Mục đích:</strong> {hoSo.muc_dich}</p>
                              <p><strong>Thời gian:</strong> {formatDate(hoSo.thoi_gian_bat_dau)} - {formatDate(hoSo.thoi_gian_ket_thuc)}</p>
                              {hoSo.is_dang_vien && (
                                <span className="dang-vien-badge">🎗️ Đảng viên</span>
                              )}
                            </div>
                            <div className="hoso-footer">
                              <span className="created-date">Nộp ngày: {formatDate(hoSo.ngay_tao)}</span>
                              <div className="hoso-actions">
                                <button 
                                  className="action-btn view"
                                  onClick={() => handleViewDetail(hoSo)}
                                >
                                  <Eye size={16} />
                                  Xem chi tiết
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />

      {/* Detail & Approval Modal */}
      {showDetailModal && selectedHoSo && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết hồ sơ & Phê duyệt</h2>
              <button className="btn-close-modal" onClick={() => setShowDetailModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="info-section">
                <h3>📄 Thông tin chuyến đi</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Viên chức:</label>
                    <span>{selectedHoSo.ten_vien_chuc}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedHoSo.email_vien_chuc}</span>
                  </div>
                  <div className="info-item">
                    <label>Đơn vị:</label>
                    <span>{selectedHoSo.ten_don_vi}</span>
                  </div>
                  <div className="info-item">
                    <label>Loại chuyến đi:</label>
                    <span>{selectedHoSo.loai_chuyen_di}</span>
                  </div>
                  <div className="info-item">
                    <label>Quốc gia:</label>
                    <span>{selectedHoSo.quoc_gia_den}</span>
                  </div>
                  <div className="info-item">
                    <label>Mức độ ưu tiên:</label>
                    <span className={`priority-badge ${getPriorityBadge(selectedHoSo.muc_do_uu_tien).class}`}>
                      {getPriorityBadge(selectedHoSo.muc_do_uu_tien).text}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Thời gian:</label>
                    <span>{formatDate(selectedHoSo.thoi_gian_bat_dau)} → {formatDate(selectedHoSo.thoi_gian_ket_thuc)}</span>
                  </div>
                  <div className="info-item">
                    <label>Đảng viên:</label>
                    <span>{selectedHoSo.is_dang_vien ? '✓ Có' : '✗ Không'}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Mục đích:</label>
                    <span>{selectedHoSo.muc_dich}</span>
                  </div>
                </div>
              </div>

              <div className="timeline-section">
                <h3>📊 Quy trình duyệt</h3>
                <WorkflowTimeline ma_ho_so={selectedHoSo.ma_ho_so} />
              </div>

              <div className="action-section">
                <h3>💬 Ý kiến duyệt</h3>
                <textarea
                  className="y-kien-input"
                  placeholder="Nhập ý kiến của bạn (không bắt buộc khi duyệt, bắt buộc khi từ chối/yêu cầu bổ sung)"
                  value={yKien}
                  onChange={(e) => setYKien(e.target.value)}
                  rows={4}
                />

                <div className="action-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove('DaDuyet')}
                    disabled={actionLoading}
                  >
                    <CheckCircle size={18} />
                    Phê duyệt
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleApprove('YeuCauBoSung')}
                    disabled={actionLoading}
                  >
                    <AlertCircle size={18} />
                    Yêu cầu bổ sung
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleApprove('TuChoi')}
                    disabled={actionLoading}
                  >
                    <XCircle size={18} />
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardNguoiDuyet;
