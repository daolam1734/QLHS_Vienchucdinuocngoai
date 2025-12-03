import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle, Edit2, Trash2, 
  Home, ChevronRight, BookOpen, Bell, HelpCircle, Settings, FileBarChart,
  LayoutDashboard, FolderOpen, Download, Menu, X
} from 'lucide-react';
import Header from '../components/Header';
import HoSoModal from '../components/HoSoModal';
import Footer from '../components/Footer';
import './DashboardVienChuc.css';

interface HoSo {
  ho_so_id: number;
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

function DashboardVienChuc() {
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
      
      // Load stats
      const statsResponse = await fetch('http://localhost:3000/api/ho-so/thong-ke/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent ho so
      const hoSoResponse = await fetch('http://localhost:3000/api/ho-so', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (hoSoResponse.ok) {
        const hoSoData = await hoSoResponse.json();
        setAllHoSoList(hoSoData); // Store all
        setHoSoList(hoSoData.slice(0, 5)); // Get latest 5 for preview
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

  const handleDeleteHoSo = async (hoSoId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/ho-so/${hoSoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  return (
    <div className="dashboard-vienchuc">
      <Header />
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          {/* Hero Banner */}
          <div className="hero-banner">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="hero-text">
                <div className="welcome-badge">
                  <span className="badge-icon">👋</span>
                  <span>Chào mừng trở lại</span>
                </div>
                <h1>Xin chào, <span className="highlight">{userInfo?.fullName}</span>!</h1>
                <p className="hero-subtitle">Hệ thống quản lý hồ sơ đi công tác, học tập, nghiên cứu nước ngoài cho viên chức TVU</p>
                <nav className="hero-breadcrumb">
                  <Home size={14} />
                  <ChevronRight size={12} />
                  <span>Trang làm việc của tôi</span>
                </nav>
              </div>
              <div className="hero-actions">
                <button 
                  className="hero-btn primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={20} />
                  <span>
                    <strong>Tạo hồ sơ mới</strong>
                    <small>Nộp đơn xin đi nước ngoài</small>
                  </span>
                </button>
                <button 
                  className="hero-btn secondary"
                  onClick={() => setShowAllHoSo(true)}
                >
                  <FileText size={20} />
                  <span>
                    <strong>Hồ sơ của tôi</strong>
                    <small>Xem và quản lý</small>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {loading ? (
            <div className="loading-stats">Đang tải thống kê...</div>
          ) : (
            <>
              <div className="stats-overview">
                <div className="section-title-wrapper">
                  <h2>Tổng quan hồ sơ</h2>
                  <p className="section-description">Theo dõi trạng thái và tiến độ xử lý của các hồ sơ</p>
                </div>
                <div className="stats-grid">
                  <div className="stat-card total" onClick={() => setShowAllHoSo(true)} style={{ cursor: 'pointer' }}>
                    <div className="stat-icon">
                      <FileText size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.total}</div>
                      <div className="stat-label">Tổng hồ sơ</div>
                    </div>
                  </div>

                  <div className="stat-card new">
                    <div className="stat-icon">
                      <Plus size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.moiTao}</div>
                      <div className="stat-label">Mới tạo</div>
                    </div>
                  </div>

                  <div className="stat-card pending">
                    <div className="stat-icon">
                      <Clock size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.dangDuyet}</div>
                      <div className="stat-label">Đang duyệt</div>
                    </div>
                  </div>

                  <div className="stat-card approved">
                    <div className="stat-icon">
                      <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.daDuyet}</div>
                      <div className="stat-label">Đã duyệt</div>
                    </div>
                  </div>

                  <div className="stat-card rejected">
                    <div className="stat-icon">
                      <XCircle size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.tuChoi}</div>
                      <div className="stat-label">Từ chối</div>
                    </div>
                  </div>

                  <div className="stat-card supplement">
                    <div className="stat-icon">
                      <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{stats.boSung}</div>
                      <div className="stat-label">Cần bổ sung</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Ho So */}
              {hoSoList.length > 0 && (
                <div className="recent-hoso">
                  <div className="section-header">
                    <div>
                      <h2>Hồ sơ gần đây</h2>
                      <p className="section-description">5 hồ sơ được tạo mới nhất</p>
                    </div>
                    <button 
                      className="btn-view-all"
                      onClick={() => setShowAllHoSo(true)}
                    >
                      Xem tất cả
                    </button>
                  </div>
                  <div className="hoso-list">
                    {hoSoList.map((hoSo) => (
                      <div 
                        key={hoSo.ho_so_id} 
                        className="hoso-item"
                      >
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
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHoSo(hoSo.ho_so_id);
                              }}
                              title="Xóa"
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

              {/* All Ho So List Modal/Section */}
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
                    {allHoSoList.map((hoSo) => (
                      <div 
                        key={hoSo.ho_so_id} 
                        className="hoso-item"
                      >
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
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteHoSo(hoSo.ho_so_id);
                              }}
                              title="Xóa"
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

          {/* Quick Guide & Notifications */}
          <div className="info-sections">
            <div className="quick-guide">
              <div className="guide-header">
                <BookOpen size={20} />
                <h3>Quy trình nộp hồ sơ</h3>
              </div>
              <ul className="guide-list">
                <li>
                  <span className="step-number">1</span>
                  <div>
                    <strong>Tạo hồ sơ mới</strong>
                    <span className="step-desc">Click "Tạo hồ sơ mới" và điền đầy đủ thông tin về chuyến công tác/học tập</span>
                  </div>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <div>
                    <strong>Gửi phê duyệt</strong>
                    <span className="step-desc">Hồ sơ sẽ được chuyển đến bộ phận có thẩm quyền để xét duyệt</span>
                  </div>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <div>
                    <strong>Theo dõi tiến độ</strong>
                    <span className="step-desc">Nhận thông báo qua email và xem trạng thái realtime trong hệ thống</span>
                  </div>
                </li>
                <li>
                  <span className="step-number">4</span>
                  <div>
                    <strong>Hoàn tất thủ tục</strong>
                    <span className="step-desc">Sau khi được duyệt, hoàn tất các thủ tục cần thiết trước khi xuất cảnh</span>
                  </div>
                </li>
              </ul>
            </div>

            {stats.dangDuyet > 0 && (
              <div className="notification-box">
                <div className="notification-header">
                  <Bell size={20} />
                  <h3>Thông báo</h3>
                </div>
                <div className="notification-item">
                  <AlertCircle size={18} color="#f59e0b" />
                  <p>Bạn có <strong>{stats.dangDuyet} hồ sơ</strong> đang chờ phê duyệt</p>
                </div>
              </div>
            )}

            {stats.boSung > 0 && (
              <div className="notification-box warning">
                <div className="notification-header">
                  <HelpCircle size={20} />
                  <h3>Cần xử lý</h3>
                </div>
                <div className="notification-item">
                  <XCircle size={18} color="#dc2626" />
                  <p>Bạn có <strong>{stats.boSung} hồ sơ</strong> cần bổ sung thông tin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

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
