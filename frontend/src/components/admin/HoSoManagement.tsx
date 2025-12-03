import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Download, Eye, Trash2, 
  Calendar, AlertCircle, RefreshCw, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import './AdminLayout.css';

interface HoSo {
  id: string;
  maHoSo: string;
  tenChuyenDi: string;
  nguoiTao: string;
  donVi: string;
  loaiHoSo: string;
  quocGia: string;
  ngayDiDuKien: string;
  ngayVeDuKien: string;
  trangThai: string;
  mauSac: string;
  ngayTao: string;
  ngayCapNhat: string;
}

const HoSoManagement: React.FC = () => {
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSo | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHoSoList();
  }, []);

  const fetchHoSoList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/admin/hoso', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Hồ sơ data:', response.data);
      setHoSoList(response.data || []);
    } catch (err: any) {
      console.error('Error fetching hoso list:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/admin/hoso/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHoSoList(hoSoList.filter(hs => hs.id !== id));
      alert('Xóa hồ sơ thành công');
    } catch (err: any) {
      console.error('Error deleting hoso:', err);
      alert(err.response?.data?.message || 'Không thể xóa hồ sơ');
    }
  };

  const handleView = (hoSo: HoSo) => {
    setSelectedHoSo(hoSo);
    setShowViewModal(true);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('duyệt') || statusLower.includes('hoàn')) return 'admin-badge-success';
    if (statusLower.includes('chờ') || statusLower.includes('mới')) return 'admin-badge-warning';
    if (statusLower.includes('từ chối')) return 'admin-badge-danger';
    return 'admin-badge-info';
  };

  // Filter and search
  const validTrangThai = [
    'Mới tạo',
    'Đang kiểm tra',
    'Đang duyệt',
    'Đã duyệt',
    'Từ chối',
    'Đang thực hiện',
    'Hoàn tất',
    'Bổ sung'
  ];
  const filteredHoSo = hoSoList.filter(hs => {
    // Lọc trạng thái không hợp lệ/null/rỗng
    if (!hs.trangThai || !validTrangThai.includes(hs.trangThai)) return false;
    const matchSearch = 
      (hs.maHoSo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (hs.nguoiTao?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (hs.tenChuyenDi?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (hs.donVi?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || 
      (hs.trangThai?.toLowerCase() || '').includes(filterStatus.toLowerCase());
    return matchSearch && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHoSo.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHoSo.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <div className="admin-loading-text">Đang tải danh sách hồ sơ...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-alert admin-alert-danger">
          <AlertCircle className="admin-alert-icon" />
          <div className="admin-alert-content">
            <div className="admin-alert-title">Lỗi tải dữ liệu</div>
            <div className="admin-alert-description">{error}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="admin-btn admin-btn-primary" onClick={fetchHoSoList}>
            <RefreshCw size={18} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <FileText size={20} />
          </div>
          <div>
            <h1>Quản lý hồ sơ</h1>
            <p className="admin-page-subtitle">
              Quản lý {hoSoList.length} hồ sơ đi nước ngoài của viên chức
            </p>
          </div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-outline" onClick={fetchHoSoList}>
            <RefreshCw size={18} />
            Làm mới
          </button>
          <button className="admin-btn admin-btn-success">
            <Download size={18} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="admin-toolbar">
            <div className="admin-search-wrapper">
              <Search className="admin-search-icon" size={18} />
              <input
                type="text"
                className="admin-input admin-search-input"
                placeholder="Tìm kiếm theo mã hồ sơ, tên chuyến đi, người tạo, đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filter-group">
              <Filter size={18} style={{ color: 'var(--admin-gray-500)' }} />
              <select 
                className="admin-select" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="mới tạo">Mới tạo</option>
                <option value="chờ duyệt">Chờ duyệt</option>
                <option value="đã duyệt">Đã duyệt</option>
                <option value="từ chối">Từ chối</option>
                <option value="đang kiểm tra">Đang kiểm tra</option>
                <option value="đang duyệt">Đang duyệt</option>
                <option value="đang thực hiện">Đang thực hiện</option>
                <option value="hoàn tất">Hoàn tất</option>
                <option value="bổ sung">Bổ sung</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ marginTop: 'var(--admin-spacing-lg)' }}>
        {currentItems.length === 0 ? (
          <div className="admin-empty">
            <FileText className="admin-empty-icon" />
            <div className="admin-empty-title">Không tìm thấy hồ sơ</div>
            <div className="admin-empty-description">
              {searchTerm || filterStatus !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có hồ sơ nào trong hệ thống'}
            </div>
            {(searchTerm || filterStatus !== 'all') && (
              <button 
                className="admin-btn admin-btn-outline"
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã hồ sơ</th>
                    <th>Tên chuyến đi</th>
                    <th>Người tạo</th>
                    <th>Đơn vị</th>
                    <th>Loại</th>
                    <th>Quốc gia</th>
                    <th>Ngày đi</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(hs => (
                    <tr key={hs.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>
                          {hs.maHoSo}
                        </span>
                      </td>
                      <td>{hs.tenChuyenDi || '-'}</td>
                      <td>{hs.nguoiTao || '-'}</td>
                      <td>{hs.donVi || '-'}</td>
                      <td>
                        <span className="admin-badge admin-badge-gray">
                          {hs.loaiHoSo || 'N/A'}
                        </span>
                      </td>
                      <td>{hs.quocGia || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} style={{ color: 'var(--admin-gray-500)' }} />
                          {formatDate(hs.ngayDiDuKien)}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${getStatusBadgeClass(hs.trangThai)}`}>
                          {hs.trangThai}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title="Xem chi tiết"
                            onClick={() => handleView(hs)}
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title="Xóa"
                            onClick={() => handleDelete(hs.id)}
                            style={{ color: 'var(--admin-danger)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <div className="admin-pagination-info">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredHoSo.length)} của {filteredHoSo.length} hồ sơ
                </div>
                <div className="admin-pagination-controls">
                  <button 
                    className="admin-pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      className={`admin-pagination-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button 
                    className="admin-pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedHoSo && (
        <div className="admin-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Chi tiết hồ sơ</h2>
              <button 
                className="admin-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gap: 'var(--admin-spacing-lg)' }}>
                <div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: 'var(--admin-gray-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--admin-spacing-xs)'
                  }}>
                    Mã hồ sơ
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-primary)' }}>
                    {selectedHoSo.maHoSo}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-spacing-lg)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Tên chuyến đi
                    </div>
                    <div style={{ fontWeight: 500 }}>{selectedHoSo.tenChuyenDi}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Loại hồ sơ
                    </div>
                    <span className="admin-badge admin-badge-gray">{selectedHoSo.loaiHoSo}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-spacing-lg)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Người tạo
                    </div>
                    <div style={{ fontWeight: 500 }}>{selectedHoSo.nguoiTao}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Đơn vị
                    </div>
                    <div style={{ fontWeight: 500 }}>{selectedHoSo.donVi}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-spacing-lg)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Quốc gia đến
                    </div>
                    <div style={{ fontWeight: 500 }}>{selectedHoSo.quocGia || '-'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Trạng thái
                    </div>
                    <span className={`admin-badge ${getStatusBadgeClass(selectedHoSo.trangThai)}`}>
                      {selectedHoSo.trangThai}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-spacing-lg)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Ngày đi dự kiến
                    </div>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedHoSo.ngayDiDuKien)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)', marginBottom: '4px' }}>
                      Ngày về dự kiến
                    </div>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedHoSo.ngayVeDuKien)}</div>
                  </div>
                </div>

                <div style={{ 
                  borderTop: '1px solid var(--admin-gray-200)',
                  paddingTop: 'var(--admin-spacing-lg)',
                  marginTop: 'var(--admin-spacing-lg)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--admin-spacing-lg)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-gray-500)', marginBottom: '4px' }}>
                        Ngày tạo
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>{formatDate(selectedHoSo.ngayTao)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-gray-500)', marginBottom: '4px' }}>
                        Cập nhật lần cuối
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>{formatDate(selectedHoSo.ngayCapNhat)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => setShowViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoSoManagement;
