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
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/donvi', {
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
      await axios.delete(`http://localhost:5000/api/v1/admin/donvi/${id}`, {
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
    dv.tenDonVi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dv.maDonVi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý đơn vị</h1>
          <p className="page-description">Quản lý các phòng ban, khoa trong trường</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Thêm đơn vị
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
          <button className="btn-primary" onClick={fetchDonViList}>
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
            placeholder="Tìm kiếm theo mã, tên đơn vị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
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
                <td className="font-medium">{dv.maDonVi}</td>
                <td>{dv.tenDonVi}</td>
                <td>
                  <span className="role-badge role-default">{dv.loaiDonVi}</span>
                </td>
                <td>{dv.truongDonVi}</td>
                <td>
                  <div className="flex-center">
                    <UsersIcon size={14} className="mr-1" />
                    {dv.soNguoi}
                  </div>
                </td>
                <td>{dv.email}</td>
                <td>{dv.dienThoai}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Chỉnh sửa" onClick={() => handleEdit(dv.id)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon btn-danger" title="Xóa" onClick={() => handleDelete(dv.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDonVi.length === 0 && (
          <div className="empty-state">
            <Building2 size={48} />
            <p>Không tìm thấy đơn vị nào</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="pagination-info">Hiển thị 1-{filteredDonVi.length} của {donViList.length} đơn vị</span>
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

export default DonViManagement;
