import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Edit, Trash2, Lock, Unlock, Mail, 
  AlertCircle, RefreshCw, ChevronLeft, ChevronRight, Shield, X 
} from 'lucide-react';
import axios from 'axios';
import './AdminLayout.css';

interface User {
  id: string;
  hoTen: string;
  email: string;
  donVi: string;
  vaiTro: string;
  trangThai: 'active' | 'locked';
  ngayTao: string;
}

interface DonVi {
  id: string;
  tenDonVi: string;
  loaiDonVi: string;
}

interface CreateUserData {
  ho_ten: string;
  email: string;
  dien_thoai: string;
  don_vi_id: string;
  ma_vai_tro: string;
  la_dang_vien: boolean;
}

interface EditUserData {
  ho_ten: string;
  email: string;
  dien_thoai: string;
  don_vi_id: string;
  ma_vai_tro: string;
}

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState('');

  // Convert Vietnamese to non-accented
  const removeVietnameseTones = (str: string): string => {
    const from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ";
    const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    
    for (let i = 0; i < from.length; i++) {
      str = str.replace(new RegExp(from[i], 'gi'), to[i]);
    }
    return str;
  };

  // Generate email from full name
  const generateEmailFromName = async (fullName: string): Promise<string> => {
    if (!fullName.trim()) return '';
    
    // Split name into parts and get first name + last name
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length === 0) return '';
    
    // Get last name (first part) and first name (last part)
    const lastName = nameParts[0];
    const firstName = nameParts[nameParts.length - 1];
    
    // Convert to lowercase and remove accents
    const lastNameNormalized = removeVietnameseTones(lastName).toLowerCase();
    const firstNameNormalized = removeVietnameseTones(firstName).toLowerCase();
    
    // Base email: <họ><tên>@tvu.edu.vn
    const baseEmail = `${lastNameNormalized}${firstNameNormalized}@tvu.edu.vn`;
    
    // Check if email exists
    const existingEmails = userList.map(u => u.email.toLowerCase());
    
    if (!existingEmails.includes(baseEmail)) {
      return baseEmail;
    }
    
    // If exists, add middle name or number suffix
    if (nameParts.length > 2) {
      // Try with middle name initials
      const middleInitials = nameParts.slice(1, -1)
        .map(n => removeVietnameseTones(n[0]).toLowerCase())
        .join('');
      const emailWithMiddle = `${lastNameNormalized}${middleInitials}${firstNameNormalized}@tvu.edu.vn`;
      
      if (!existingEmails.includes(emailWithMiddle)) {
        return emailWithMiddle;
      }
    }
    
    // Add number suffix
    let counter = 2;
    let emailWithNumber = `${lastNameNormalized}${firstNameNormalized}${counter}@tvu.edu.vn`;
    
    while (existingEmails.includes(emailWithNumber)) {
      counter++;
      emailWithNumber = `${lastNameNormalized}${firstNameNormalized}${counter}@tvu.edu.vn`;
    }
    
    return emailWithNumber;
  };

  // Handle name change and auto-generate email
  const handleNameChange = async (name: string) => {
    setCreateForm({...createForm, ho_ten: name});
    
    if (name.trim()) {
      const email = await generateEmailFromName(name);
      setGeneratedEmail(email);
      setCreateForm(prev => ({...prev, email}));
    } else {
      setGeneratedEmail('');
      setCreateForm(prev => ({...prev, email: ''}));
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Create Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [createForm, setCreateForm] = useState<CreateUserData>({
    ho_ten: '',
    email: '',
    dien_thoai: '',
    don_vi_id: '',
    ma_vai_tro: 'VT_VIEN_CHUC',
    la_dang_vien: false
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserData>({
    ho_ten: '',
    email: '',
    dien_thoai: '',
    don_vi_id: '',
    ma_vai_tro: 'VT_VIEN_CHUC'
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserList();
    fetchDonViList();
  }, []);

  const fetchUserList = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/admin/users', {
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

  const fetchDonViList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/admin/donvi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Đơn vị list từ API:', response.data);
      setDonViList(response.data);
    } catch (err: any) {
      console.error('Error fetching donvi list:', err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.trangThai === 'active' ? 'locked' : 'active';
    const action = newStatus === 'active' ? 'mở khóa' : 'khóa';
    
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản "${user.hoTen}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3000/api/admin/users/${user.id}/status`,
        { trangThai: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserList(userList.map(u => 
        u.id === user.id ? { ...u, trangThai: newStatus } : u
      ));
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công`);
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      alert(err.response?.data?.message || `Không thể ${action} tài khoản`);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.hoTen}"? Hành động này không thể hoàn tác.`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserList(userList.filter(u => u.id !== user.id));
      alert('Xóa người dùng thành công');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  const handleCreateUser = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      // Validation
      if (!createForm.ho_ten.trim()) {
        setCreateError('Vui lòng nhập họ tên');
        setCreateLoading(false);
        return;
      }

      if (!createForm.email.trim()) {
        setCreateError('Vui lòng nhập email');
        setCreateLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createForm.email)) {
        setCreateError('Email không hợp lệ');
        setCreateLoading(false);
        return;
      }

      // Validate don_vi_id for VienChuc role
      if (createForm.ma_vai_tro === 'VT_VIEN_CHUC' && !createForm.don_vi_id) {
        setCreateError('Vui lòng chọn đơn vị cho Viên chức');
        setCreateLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/admin/users', createForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form
      setCreateForm({
        ho_ten: '',
        email: '',
        dien_thoai: '',
        don_vi_id: '',
        ma_vai_tro: 'VT_VIEN_CHUC',
        la_dang_vien: false
      });

      setShowCreateModal(false);
      alert('Tạo người dùng thành công');
      
      // Refresh user list
      fetchUserList();
    } catch (err: any) {
      console.error('Error creating user:', err);
      setCreateError(err.response?.data?.message || 'Không thể tạo người dùng');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setCreateError(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      ho_ten: '',
      email: '',
      dien_thoai: '',
      don_vi_id: '',
      ma_vai_tro: 'VT_VIEN_CHUC',
      la_dang_vien: false
    });
    setCreateError(null);
  };

  const handleResetPassword = async (user: User) => {
    if (!window.confirm(`Gửi email đặt lại mật khẩu cho ${user.email}?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/admin/users/${user.id}/reset-password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Đã gửi email đặt lại mật khẩu');
    } catch (err: any) {
      console.error('Error resetting password:', err);
      alert(err.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu');
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      ho_ten: user.hoTen,
      email: user.email,
      dien_thoai: '',
      don_vi_id: '',
      ma_vai_tro: user.vaiTro === 'Admin' ? 'VT_ADMIN' : 
                  user.vaiTro === 'NguoiDuyet' ? 'VT_NGUOI_DUYET' : 'VT_VIEN_CHUC'
    });
    setShowEditModal(true);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditForm({
      ho_ten: '',
      email: '',
      dien_thoai: '',
      don_vi_id: '',
      ma_vai_tro: 'VT_VIEN_CHUC'
    });
    setEditError(null);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      setEditLoading(true);
      setEditError(null);

      // Validation
      if (!editForm.ho_ten.trim()) {
        setEditError('Vui lòng nhập họ tên');
        setEditLoading(false);
        return;
      }

      if (!editForm.email.trim()) {
        setEditError('Vui lòng nhập email');
        setEditLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        setEditError('Email không hợp lệ');
        setEditLoading(false);
        return;
      }

      // Validate don_vi_id for VienChuc role
      if (editForm.ma_vai_tro === 'VT_VIEN_CHUC' && !editForm.don_vi_id) {
        setEditError('Vui lòng chọn đơn vị cho Viên chức');
        setEditLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/admin/users/${editingUser.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowEditModal(false);
      alert('Cập nhật người dùng thành công');
      
      // Refresh user list
      fetchUserList();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setEditError(err.response?.data?.message || 'Không thể cập nhật người dùng');
    } finally {
      setEditLoading(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    if (role === 'ADMIN' || role === 'Admin') return 'admin-badge-danger';
    if (role === 'BGH') return 'admin-badge-warning';
    if (role === 'TRUONG_KHOA') return 'admin-badge-info';
    return 'admin-badge-gray';
  };

  // Filter and search
  const filteredUsers = userList.filter(user => {
    const matchSearch = 
      (user.hoTen?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.donVi?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchRole = filterRole === 'all' || 
      (user.vaiTro?.toLowerCase() || '').includes(filterRole.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || user.trangThai === filterStatus;
    
    return matchSearch && matchRole && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <div className="admin-loading-text">Đang tải danh sách người dùng...</div>
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
          <button className="admin-btn admin-btn-primary" onClick={fetchUserList}>
            <RefreshCw size={18} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Create User Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={handleCloseCreateModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Thêm người dùng mới</h3>
              <button 
                className="admin-modal-close" 
                onClick={handleCloseCreateModal}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              {createError && (
                <div className="admin-alert admin-alert-danger" style={{ marginBottom: '1rem' }}>
                  <AlertCircle className="admin-alert-icon" />
                  <div className="admin-alert-content">
                    <div className="admin-alert-description">{createError}</div>
                  </div>
                </div>
              )}
              
              <div className="admin-form">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Họ tên *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={createForm.ho_ten}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Nhập họ tên đầy đủ"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Email * 
                      {generatedEmail && (
                        <span style={{fontSize: '12px', color: '#10b981', marginLeft: '8px'}}>
                          (Tự động: {generatedEmail})
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      className="admin-input"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      placeholder="Email được tạo tự động từ họ tên"
                      disabled
                      style={{backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="admin-input"
                      value={createForm.dien_thoai}
                      onChange={(e) => setCreateForm({...createForm, dien_thoai: e.target.value})}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Vai trò *</label>
                    <select
                      className="admin-select"
                      value={createForm.ma_vai_tro}
                      onChange={(e) => setCreateForm({...createForm, ma_vai_tro: e.target.value})}
                    >
                      <option value="VT_VIEN_CHUC">Viên chức</option>
                      <option value="VT_NGUOI_DUYET">Người duyệt</option>
                      <option value="VT_ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                {createForm.ma_vai_tro === 'VT_VIEN_CHUC' && (
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Đơn vị *</label>
                      <select
                        className="admin-select"
                        value={createForm.don_vi_id}
                        onChange={(e) => setCreateForm({...createForm, don_vi_id: e.target.value})}
                      >
                        <option value="">Chọn đơn vị</option>
                        {donViList.map(donVi => (
                          <option key={donVi.id} value={donVi.id}>
                            {donVi.tenDonVi} ({donVi.loaiDonVi})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={createForm.la_dang_vien}
                      onChange={(e) => setCreateForm({...createForm, la_dang_vien: e.target.checked})}
                    />
                    <span className="admin-checkbox-mark"></span>
                    Là Đảng viên
                  </label>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn admin-btn-outline" 
                onClick={handleCloseCreateModal}
                disabled={createLoading}
              >
                Hủy
              </button>
              <button 
                className="admin-btn admin-btn-primary" 
                onClick={handleCreateUser}
                disabled={createLoading}
              >
                {createLoading ? (
                  <>
                    <div className="admin-spinner-sm"></div>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Tạo người dùng
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="admin-modal-overlay" onClick={handleCloseEditModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Chỉnh sửa người dùng</h3>
              <button 
                className="admin-modal-close" 
                onClick={handleCloseEditModal}
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              {editError && (
                <div className="admin-alert admin-alert-danger" style={{ marginBottom: '1rem' }}>
                  <AlertCircle className="admin-alert-icon" />
                  <div className="admin-alert-content">
                    <div className="admin-alert-description">{editError}</div>
                  </div>
                </div>
              )}
              
              <div className="admin-form">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Họ tên *</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={editForm.ho_ten}
                      onChange={(e) => setEditForm({...editForm, ho_ten: e.target.value})}
                      placeholder="Nhập họ tên đầy đủ"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email *</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="admin-input"
                      value={editForm.dien_thoai}
                      onChange={(e) => setEditForm({...editForm, dien_thoai: e.target.value})}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Vai trò *</label>
                    <select
                      className="admin-select"
                      value={editForm.ma_vai_tro}
                      onChange={(e) => setEditForm({...editForm, ma_vai_tro: e.target.value})}
                    >
                      <option value="VT_VIEN_CHUC">Viên chức</option>
                      <option value="VT_NGUOI_DUYET">Người duyệt</option>
                      <option value="VT_ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                {editForm.ma_vai_tro === 'VT_VIEN_CHUC' && (
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Đơn vị *</label>
                      <select
                        className="admin-select"
                        value={editForm.don_vi_id}
                        onChange={(e) => setEditForm({...editForm, don_vi_id: e.target.value})}
                      >
                        <option value="">Chọn đơn vị</option>
                        {donViList.map(donVi => (
                          <option key={donVi.id} value={donVi.id}>
                            {donVi.tenDonVi} ({donVi.loaiDonVi})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn admin-btn-outline" 
                onClick={handleCloseEditModal}
                disabled={editLoading}
              >
                Hủy
              </button>
              <button 
                className="admin-btn admin-btn-primary" 
                onClick={handleEditUser}
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <div className="admin-spinner-sm"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Cập nhật
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <Users size={20} />
          </div>
          <div>
            <h1>Quản lý người dùng</h1>
            <p className="admin-page-subtitle">
              Quản lý {userList.length} tài khoản trong hệ thống
            </p>
          </div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-outline" onClick={fetchUserList}>
            <RefreshCw size={18} />
            Làm mới
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            Thêm người dùng
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
                placeholder="Tìm kiếm theo tên, email, đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filter-group">
              <Filter size={18} style={{ color: 'var(--admin-gray-500)' }} />
              <select 
                className="admin-select" 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="bgh">Ban Giám Hiệu</option>
                <option value="truong">Trưởng khoa</option>
                <option value="vien_chuc">Viên chức</option>
              </select>
              <select 
                className="admin-select" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="locked">Đã khóa</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ marginTop: 'var(--admin-spacing-lg)' }}>
        {currentItems.length === 0 ? (
          <div className="admin-empty">
            <Users className="admin-empty-icon" />
            <div className="admin-empty-title">Không tìm thấy người dùng</div>
            <div className="admin-empty-description">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có người dùng nào trong hệ thống'}
            </div>
            {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
              <button 
                className="admin-btn admin-btn-outline"
                onClick={() => { 
                  setSearchTerm(''); 
                  setFilterRole('all'); 
                  setFilterStatus('all'); 
                }}
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
                  {currentItems.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--admin-primary-light)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}>
                            {(user.hoTen || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{user.hoTen}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.donVi || (user.vaiTro === 'VienChuc' ? <span style={{color: '#999', fontStyle: 'italic'}}>Chưa có</span> : <span style={{color: '#999'}}>-</span>)}
                      </td>
                      <td>
                        <span className={`admin-badge ${getRoleBadgeClass(user.vaiTro)}`}>
                          <Shield size={12} />
                          {user.vaiTro || 'N/A'}
                        </span>
                      </td>
                      <td>
                        {user.trangThai === 'active' ? (
                          <span className="admin-badge admin-badge-success">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-danger">
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td>{formatDate(user.ngayTao)}</td>
                      <td>
                        <div className="admin-table-actions">
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title={user.trangThai === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.trangThai === 'active' ? (
                              <Lock size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                          </button>
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title="Reset mật khẩu"
                            onClick={() => handleResetPassword(user)}
                          >
                            <Mail size={16} />
                          </button>
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title="Chỉnh sửa"
                            onClick={() => handleOpenEditModal(user)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                            title="Xóa"
                            onClick={() => handleDelete(user)}
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
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} của {filteredUsers.length} người dùng
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
    </div>
  );
};

export default UserManagement;
