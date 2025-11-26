import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface HoSo {
  id: string;
  maHoSo: string;
  hoTen: string;
  donVi: string;
  loaiHoSo: string;
  quocGia: string;
  ngayNop: string;
  trangThai: 'draft' | 'pending' | 'approved' | 'rejected';
}

const HoSoManagement: React.FC = () => {
  const [hoSoList, setHoSoList] = useState<HoSo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHoSoList();
  }, []);

  const fetchHoSoList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/hoso', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHoSoList(response.data);
    } catch (err: any) {
      console.error('Error fetching hoso list:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/admin/hoso/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setHoSoList(hoSoList.filter(hs => hs.id !== id));
      alert('Xóa hồ sơ thành công');
    } catch (err: any) {
      console.error('Error deleting hoso:', err);
      alert(err.response?.data?.message || 'Không thể xóa hồ sơ');
    }
  };

  const handleView = (id: string) => {
    // TODO: Implement view detail modal or navigate to detail page
    console.log('View hoso:', id);
    alert('Chức năng xem chi tiết đang được phát triển');
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit modal or navigate to edit page
    console.log('Edit hoso:', id);
    alert('Chức năng chỉnh sửa đang được phát triển');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Nháp', class: 'status-draft' },
      pending: { label: 'Chờ duyệt', class: 'status-pending' },
      approved: { label: 'Đã duyệt', class: 'status-approved' },
      rejected: { label: 'Từ chối', class: 'status-rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const filteredHoSo = hoSoList.filter(hs => {
    const matchSearch = hs.maHoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       hs.hoTen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || hs.trangThai === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý hồ sơ</h1>
          <p className="page-description">Quản lý hồ sơ đi nước ngoài của viên chức</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Tạo hồ sơ mới
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <AlertCircle size={48} color="#F44336" />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchHoSoList}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hồ sơ, họ tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        <button className="btn-secondary">
          <Download size={20} />
          Xuất Excel
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã hồ sơ</th>
              <th>Họ tên</th>
              <th>Đơn vị</th>
              <th>Loại hồ sơ</th>
              <th>Quốc gia</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoSo.map(hs => (
              <tr key={hs.id}>
                <td className="font-medium">{hs.maHoSo}</td>
                <td>{hs.hoTen}</td>
                <td>{hs.donVi}</td>
                <td>{hs.loaiHoSo}</td>
                <td>{hs.quocGia}</td>
                <td>
                  <div className="flex-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(hs.ngayNop).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td>{getStatusBadge(hs.trangThai)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Xem chi tiết" onClick={() => handleView(hs.id)}>
                      <Eye size={16} />
                    </button>
                    <button className="btn-icon" title="Chỉnh sửa" onClick={() => handleEdit(hs.id)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon btn-danger" title="Xóa" onClick={() => handleDelete(hs.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHoSo.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <p>Không tìm thấy hồ sơ nào</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="pagination-info">Hiển thị 1-{filteredHoSo.length} của {hoSoList.length} hồ sơ</span>
        <div className="pagination-buttons">
          <button className="btn-secondary" disabled>Trước</button>
          <button className="btn-primary">1</button>
          <button className="btn-secondary" disabled>Sau</button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default HoSoManagement;
