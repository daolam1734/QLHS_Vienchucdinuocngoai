import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Plus } from 'lucide-react';
import './HoSoManagementPage.css';

interface HoSo {
  ma_ho_so: string;
  loai_chuyen_di: string;
  ten_loai_chuyen_di: string;
  quoc_gia_den: string;
  to_chuc_moi: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  muc_dich: string;
  muc_do_uu_tien: string;
  trang_thai: string;
  ngay_tao: string;
  so_ngay: number;
  buoc_hien_tai?: string;
  nguoi_duyet_hien_tai?: string;
}

interface ThongKe {
  tong_so: number;
  moi_tao: number;
  dang_duyet: number;
  da_duyet: number;
  tu_choi: number;
  bo_sung: number;
}

interface LoaiChuyenDi {
  ma_loai: string;
  ten_loai: string;
}

const HoSoManagementPage: React.FC = () => {
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [thongKe, setThongKe] = useState<ThongKe>({
    tong_so: 0,
    moi_tao: 0,
    dang_duyet: 0,
    da_duyet: 0,
    tu_choi: 0,
    bo_sung: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSo | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [loaiChuyenDiList, setLoaiChuyenDiList] = useState<LoaiChuyenDi[]>([]);
  const [formData, setFormData] = useState({
    loai_chuyen_di: '',
    quoc_gia_den: '',
    to_chuc_moi: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    muc_dich: '',
    muc_do_uu_tien: 'BinhThuong',
  });

  useEffect(() => {
    loadData();
    loadMasterData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Load hồ sơ list
      const hoSoResponse = await axios.get('http://localhost:3000/api/ho-so', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHoSoList(hoSoResponse.data.data);
      
      // Load thống kê
      const thongKeResponse = await axios.get('http://localhost:3000/api/ho-so/thong-ke/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThongKe(thongKeResponse.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const loaiChuyenDiRes = await axios.get('http://localhost:3000/api/master-data/loai-chuyen-di', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setLoaiChuyenDiList(loaiChuyenDiRes.data.data);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const handleCreateHoSo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/ho-so', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Tạo hồ sơ thành công! Hồ sơ sẽ được chuyển vào quy trình duyệt.');
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error creating ho so:', error);
      alert(error.response?.data?.message || 'Không thể tạo hồ sơ. Vui lòng thử lại.');
    }
  };

  const handleUpdateHoSo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHoSo) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/ho-so/${selectedHoSo.ma_ho_so}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      alert('Cập nhật hồ sơ thành công!');
      setShowDetailModal(false);
      setSelectedHoSo(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error updating ho so:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    }
  };

  const handleDeleteHoSo = async (maHoSo: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ này? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/ho-so/${maHoSo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert('Xóa hồ sơ thành công!');
      loadData();
    } catch (error: any) {
      console.error('Error deleting ho so:', error);
      alert(error.response?.data?.message || 'Không thể xóa hồ sơ. Vui lòng thử lại.');
    }
  };

  const handleViewDetail = async (hoSo: HoSo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/ho-so/${hoSo.ma_ho_so}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const detail = response.data.data;
      setSelectedHoSo(detail);
      
      // Populate form for editing
      setFormData({
        loai_chuyen_di: detail.loai_chuyen_di,
        quoc_gia_den: detail.quoc_gia_den,
        to_chuc_moi: detail.to_chuc_moi,
        thoi_gian_bat_dau: detail.thoi_gian_bat_dau.split('T')[0],
        thoi_gian_ket_thuc: detail.thoi_gian_ket_thuc.split('T')[0],
        muc_dich: detail.muc_dich,
        muc_do_uu_tien: detail.muc_do_uu_tien,
      });
      
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading detail:', error);
      alert('Không thể tải chi tiết hồ sơ.');
    }
  };

  const resetForm = () => {
    setFormData({
      loai_chuyen_di: '',
      quoc_gia_den: '',
      to_chuc_moi: '',
      thoi_gian_bat_dau: '',
      thoi_gian_ket_thuc: '',
      muc_dich: '',
      muc_do_uu_tien: 'BinhThuong',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { class: string; text: string } } = {
      MoiTao: { class: 'status-new', text: 'Mới tạo' },
      DangDuyet: { class: 'status-pending', text: 'Đang duyệt' },
      DaDuyet: { class: 'status-approved', text: 'Đã duyệt' },
      TuChoi: { class: 'status-rejected', text: 'Từ chối' },
      BoSung: { class: 'status-supplement', text: 'Cần bổ sung' },
    };
    const badge = badges[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: { class: string; text: string } } = {
      KhanCap: { class: 'priority-urgent', text: 'Khẩn cấp' },
      Cao: { class: 'priority-high', text: 'Cao' },
      BinhThuong: { class: 'priority-normal', text: 'Bình thường' },
    };
    const badge = badges[priority] || { class: 'priority-default', text: priority };
    return <span className={`priority-badge ${badge.class}`}>{badge.text}</span>;
  };

  const canEdit = (hoSo: HoSo) => {
    return hoSo.trang_thai === 'MoiTao' || hoSo.trang_thai === 'BoSung';
  };

  const canDelete = (hoSo: HoSo) => {
    return hoSo.trang_thai === 'MoiTao';
  };

  const filteredHoSoList = hoSoList.filter((hoSo) => {
    const matchStatus = filterStatus === 'all' || hoSo.trang_thai === filterStatus;
    const matchSearch =
      hoSo.quoc_gia_den.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hoSo.to_chuc_moi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hoSo.muc_dich.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="ho-so-management-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-section">
          <div className="container">
            <nav className="breadcrumb">
              <a href="/">Trang chủ</a>
              <span className="separator">›</span>
              <span className="current">Quản lý hồ sơ đi nước ngoài</span>
            </nav>
          </div>
        </div>

        <div className="container">
          <div className="page-content">
            {/* Page Header */}
            <div className="page-header">
              <div className="page-title-section">
                <FileText size={32} className="page-icon" />
                <div>
                  <h1>Quản lý Hồ sơ Đi Nước Ngoài</h1>
                  <p className="page-subtitle">Tạo mới, theo dõi và quản lý hồ sơ xin phép đi nước ngoài</p>
                </div>
              </div>
              <button className="btn-create" onClick={() => setShowCreateModal(true)}>
                <Plus size={20} />
                <span>Tạo hồ sơ mới</span>
              </button>
            </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{thongKe.tong_so}</div>
          <div className="stat-label">Tổng số hồ sơ</div>
        </div>
        <div className="stat-card stat-new">
          <div className="stat-value">{thongKe.moi_tao}</div>
          <div className="stat-label">Mới tạo</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-value">{thongKe.dang_duyet}</div>
          <div className="stat-label">Đang duyệt</div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-value">{thongKe.da_duyet}</div>
          <div className="stat-label">Đã duyệt</div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-value">{thongKe.tu_choi}</div>
          <div className="stat-label">Từ chối</div>
        </div>
        <div className="stat-card stat-supplement">
          <div className="stat-value">{thongKe.bo_sung}</div>
          <div className="stat-label">Cần bổ sung</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option key="all" value="all">Tất cả</option>
            <option key="MoiTao" value="MoiTao">Mới tạo</option>
            <option key="DangDuyet" value="DangDuyet">Đang duyệt</option>
            <option key="DaDuyet" value="DaDuyet">Đã duyệt</option>
            <option key="TuChoi" value="TuChoi">Từ chối</option>
            <option key="BoSung" value="BoSung">Cần bổ sung</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            placeholder="Quốc gia, tổ chức, mục đích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="ho-so-table">
          <thead>
            <tr>
              <th>Loại chuyến đi</th>
              <th>Quốc gia đến</th>
              <th>Tổ chức mời</th>
              <th>Thời gian</th>
              <th>Ưu tiên</th>
              <th>Trạng thái</th>
              <th>Bước hiện tại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoSoList.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  Không có hồ sơ nào
                </td>
              </tr>
            ) : (
              filteredHoSoList.map((hoSo) => (
                <tr key={hoSo.ma_ho_so}>
                  <td>{hoSo.ten_loai_chuyen_di}</td>
                  <td>{hoSo.quoc_gia_den}</td>
                  <td className="org-cell">{hoSo.to_chuc_moi}</td>
                  <td>
                    {new Date(hoSo.thoi_gian_bat_dau).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(hoSo.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')}
                    <br />
                    <small className="text-muted">({hoSo.so_ngay} ngày)</small>
                  </td>
                  <td>{getPriorityBadge(hoSo.muc_do_uu_tien)}</td>
                  <td>{getStatusBadge(hoSo.trang_thai)}</td>
                  <td className="step-cell">
                    {hoSo.buoc_hien_tai || '-'}
                    {hoSo.nguoi_duyet_hien_tai && (
                      <>
                        <br />
                        <small className="text-muted">{hoSo.nguoi_duyet_hien_tai}</small>
                      </>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => handleViewDetail(hoSo)}
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                      {canDelete(hoSo) && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteHoSo(hoSo.ma_ho_so)}
                          title="Xóa hồ sơ"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo hồ sơ mới</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCreateHoSo} className="ho-so-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    Loại chuyến đi <span className="required">*</span>
                  </label>
                  <select
                    value={formData.loai_chuyen_di}
                    onChange={(e) =>
                      setFormData({ ...formData, loai_chuyen_di: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Chọn loại chuyến đi --</option>
                    {loaiChuyenDiList.map((loai) => (
                      <option key={loai.ma_loai} value={loai.ma_loai}>
                        {loai.ten_loai}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Quốc gia đến <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.quoc_gia_den}
                    onChange={(e) =>
                      setFormData({ ...formData, quoc_gia_den: e.target.value })
                    }
                    placeholder="VD: Thái Lan"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Tổ chức mời <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.to_chuc_moi}
                    onChange={(e) =>
                      setFormData({ ...formData, to_chuc_moi: e.target.value })
                    }
                    placeholder="VD: Chulalongkorn University"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Ngày bắt đầu <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.thoi_gian_bat_dau}
                    onChange={(e) =>
                      setFormData({ ...formData, thoi_gian_bat_dau: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Ngày kết thúc <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.thoi_gian_ket_thuc}
                    onChange={(e) =>
                      setFormData({ ...formData, thoi_gian_ket_thuc: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Mức độ ưu tiên <span className="required">*</span>
                  </label>
                  <select
                    value={formData.muc_do_uu_tien}
                    onChange={(e) =>
                      setFormData({ ...formData, muc_do_uu_tien: e.target.value })
                    }
                    required
                  >
                    <option key="BinhThuong" value="BinhThuong">Bình thường</option>
                    <option key="Cao" value="Cao">Cao</option>
                    <option key="KhanCap" value="KhanCap">Khẩn cấp</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label>
                    Mục đích <span className="required">*</span>
                  </label>
                  <textarea
                    value={formData.muc_dich}
                    onChange={(e) => setFormData({ ...formData, muc_dich: e.target.value })}
                    placeholder="Mô tả chi tiết mục đích chuyến đi..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Tạo hồ sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail/Edit Modal */}
      {showDetailModal && selectedHoSo && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {canEdit(selectedHoSo) ? 'Chỉnh sửa hồ sơ' : 'Chi tiết hồ sơ'}
              </h2>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}>
                ×
              </button>
            </div>
            
            <div className="detail-status-bar">
              <div>
                <strong>Trạng thái:</strong> {getStatusBadge(selectedHoSo.trang_thai)}
              </div>
              <div>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(selectedHoSo.ngay_tao).toLocaleDateString('vi-VN')}
              </div>
            </div>

            <form onSubmit={handleUpdateHoSo} className="ho-so-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Loại chuyến đi</label>
                  <select
                    value={formData.loai_chuyen_di}
                    onChange={(e) =>
                      setFormData({ ...formData, loai_chuyen_di: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  >
                    <option value="">-- Chọn loại chuyến đi --</option>
                    {loaiChuyenDiList.map((loai) => (
                      <option key={loai.ma_loai} value={loai.ma_loai}>
                        {loai.ten_loai}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quốc gia đến</label>
                  <input
                    type="text"
                    value={formData.quoc_gia_den}
                    onChange={(e) =>
                      setFormData({ ...formData, quoc_gia_den: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tổ chức mời</label>
                  <input
                    type="text"
                    value={formData.to_chuc_moi}
                    onChange={(e) =>
                      setFormData({ ...formData, to_chuc_moi: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={formData.thoi_gian_bat_dau}
                    onChange={(e) =>
                      setFormData({ ...formData, thoi_gian_bat_dau: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={formData.thoi_gian_ket_thuc}
                    onChange={(e) =>
                      setFormData({ ...formData, thoi_gian_ket_thuc: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mức độ ưu tiên</label>
                  <select
                    value={formData.muc_do_uu_tien}
                    onChange={(e) =>
                      setFormData({ ...formData, muc_do_uu_tien: e.target.value })
                    }
                    disabled={!canEdit(selectedHoSo)}
                    required
                  >
                    <option key="BinhThuong" value="BinhThuong">Bình thường</option>
                    <option key="Cao" value="Cao">Cao</option>
                    <option key="KhanCap" value="KhanCap">Khẩn cấp</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label>Mục đích</label>
                  <textarea
                    value={formData.muc_dich}
                    onChange={(e) => setFormData({ ...formData, muc_dich: e.target.value })}
                    disabled={!canEdit(selectedHoSo)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
                {canEdit(selectedHoSo) && (
                  <button type="submit" className="btn-submit">
                    Cập nhật
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HoSoManagementPage;
