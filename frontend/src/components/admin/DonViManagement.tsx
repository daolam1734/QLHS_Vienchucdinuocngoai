import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Users as UsersIcon, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface DonVi {
  id: string;
  maDonVi: string;
  tenDonVi: string;
  loaiDonVi: string;
  truongDonVi: string;
  soNguoi: number;
  email: string;
  dienThoai: string;
}

const DonViManagement: React.FC = () => {
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDonViList();
  }, []);

  const fetchDonViList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/admin/donvi', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDonViList(response.data);
    } catch (err: any) {
      console.error('Error fetching donvi list:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn vị');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/admin/donvi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDonViList(donViList.filter(dv => dv.id !== id));
      alert('Xóa đơn vị thành công');
    } catch (err: any) {
      console.error('Error deleting donvi:', err);
      alert(err.response?.data?.message || 'Không thể xóa đơn vị');
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit modal
    console.log('Edit donvi:', id);
    alert('Chức năng chỉnh sửa đang được phát triển');
  };

  const filteredDonVi = donViList.filter(dv =>
    dv.tenDonVi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dv.maDonVi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dv.loaiDonVi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <Building2 size={20} />
          </div>
          <div>
            <h1>Quản lý đơn vị</h1>
            <p className="admin-page-subtitle">Quản lý các phòng ban, khoa trong trường</p>
          </div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary">
            <Plus size={20} />
            Thêm đơn vị
          </button>
        </div>
      </div>

      {loading && (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <div className="admin-loading-text">Đang tải dữ liệu...</div>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-danger">
          <AlertCircle className="admin-alert-icon" />
          <div className="admin-alert-content">
            <div className="admin-alert-title">Lỗi tải dữ liệu</div>
            <div className="admin-alert-description">{error}</div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={fetchDonViList} style={{marginTop: 16}}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search className="admin-search-icon" size={18} />
          <input
            type="text"
            className="admin-input admin-search-input"
            placeholder="Tìm kiếm theo mã, tên đơn vị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn vị</th>
              <th>Tên đơn vị</th>
              <th>Loại</th>
              <th>Trưởng đơn vị</th>
              <th>Số người</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonVi.map(dv => (
              <tr key={dv.id}>
                <td style={{fontWeight: 600}}>{dv.maDonVi || dv.id.substring(0, 8)}</td>
                <td>{dv.tenDonVi}</td>
                <td>
                  <span className="admin-badge admin-badge-info">{dv.loaiDonVi}</span>
                </td>
                <td>{dv.truongDonVi || 'Chưa có'}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                    <UsersIcon size={14} />
                    {dv.soNguoi || 0}
                  </div>
                </td>
                <td>{dv.email || '-'}</td>
                <td>{dv.dienThoai || '-'}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Chỉnh sửa" onClick={() => handleEdit(dv.id)}>
                      <Edit size={16} />
                    </button>
                    <button className="admin-btn admin-btn-ghost admin-btn-icon" title="Xóa" onClick={() => handleDelete(dv.id)} style={{color: 'var(--admin-danger)'}}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDonVi.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <Building2 size={48} />
            </div>
            <div className="admin-empty-title">Không tìm thấy đơn vị nào</div>
            <div className="admin-empty-description">Thử tìm kiếm với từ khóa khác hoặc thêm đơn vị mới</div>
          </div>
        )}
      </div>

      {filteredDonVi.length > 0 && (
      <div className="admin-pagination">
        <span className="admin-pagination-info">Hiển thị 1-{filteredDonVi.length} của {donViList.length} đơn vị</span>
        <div className="admin-pagination-controls">
          <button className="admin-pagination-btn" disabled>Trước</button>
          <button className="admin-pagination-btn active">1</button>
          <button className="admin-pagination-btn" disabled>Sau</button>
        </div>
      </div>
      )}
      </>
      )}
    </div>
  );
};

export default DonViManagement;
