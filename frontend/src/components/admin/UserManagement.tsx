import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2, Lock, Unlock, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  hoTen: string;
  email: string;
  donVi: string;
  vaiTro: string;
  trangThai: 'active' | 'locked';
  ngayTao: string;
}

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserList(response.data);
    } catch (err: any) {
      console.error('Error fetching user list:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'locked') => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'locked' : 'active';
      
      await axios.patch(`http://localhost:5000/api/v1/admin/users/${id}/status`, 
        { trangThai: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserList(userList.map(user => 
        user.id === id ? { ...user, trangThai: newStatus } : user
      ));
      
      alert(`${newStatus === 'active' ? 'Mở khóa' : 'Khóa'} tài khoản thành công`);
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      alert(err.response?.data?.message || 'Không thể thay đổi trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserList(userList.filter(user => user.id !== id));
      alert('Xóa người dùng thành công');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit user modal
    console.log('Edit user:', id);
    alert('Chức năng chỉnh sửa đang được phát triển');
  };

  const handleResetPassword = async (id: string, email: string) => {
    if (!window.confirm(`Gửi email đặt lại mật khẩu cho ${email}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/admin/users/${id}/reset-password`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Đã gửi email đặt lại mật khẩu');
    } catch (err: any) {
      console.error('Error resetting password:', err);
      alert(err.response?.data?.message || 'Không thể gửi email');
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: { [key: string]: { class: string } } = {
      'Admin': { class: 'role-admin' },
      'BGH': { class: 'role-bgh' },
      'Trưởng khoa': { class: 'role-truongkhoa' },
      'Viên chức': { class: 'role-vienchuc' }
    };
    const config = roleConfig[role] || { class: 'role-default' };
    return <span className={`role-badge ${config.class}`}>{role}</span>;
  };

  const filteredUsers = userList.filter(user => {
    const matchSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.vaiTro === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p className="page-description">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Thêm người dùng
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
          <button className="btn-primary" onClick={fetchUserList}>
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
            placeholder="Tìm kiếm theo tên, email, username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="BGH">BGH</option>
            <option value="Trưởng khoa">Trưởng khoa</option>
            <option value="Viên chức">Viên chức</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Đơn vị</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="font-medium">{user.username}</td>
                <td>{user.hoTen}</td>
                <td>
                  <div className="flex-center">
                    <Mail size={14} className="mr-1" />
                    {user.email}
                  </div>
                </td>
                <td>{user.donVi}</td>
                <td>{getRoleBadge(user.vaiTro)}</td>
                <td>
                  <span className={`status-badge ${user.trangThai === 'active' ? 'status-approved' : 'status-rejected'}`}>
                    {user.trangThai === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>{new Date(user.ngayTao).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="Chỉnh sửa" onClick={() => handleEdit(user.id)}>
                      <Edit size={16} />
                    </button>
                    {user.trangThai === 'active' ? (
                      <button className="btn-icon" title="Khóa tài khoản" onClick={() => handleToggleStatus(user.id, user.trangThai)}>
                        <Lock size={16} />
                      </button>
                    ) : (
                      <button className="btn-icon btn-success" title="Mở khóa" onClick={() => handleToggleStatus(user.id, user.trangThai)}>
                        <Unlock size={16} />
                      </button>
                    )}
                    <button className="btn-icon" title="Đặt lại mật khẩu" onClick={() => handleResetPassword(user.id, user.email)}>
                      <Mail size={16} />
                    </button>
                    <button className="btn-icon btn-danger" title="Xóa" onClick={() => handleDelete(user.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="pagination-info">Hiển thị 1-{filteredUsers.length} của {userList.length} người dùng</span>
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

export default UserManagement;
