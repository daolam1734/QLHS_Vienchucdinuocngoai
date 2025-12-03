import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, CreditCard, GraduationCap, Briefcase, Edit2, Save, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ProfilePage.css';

interface ProfileData {
  ho_ten: string;
  email: string;
  dien_thoai: string;
  dia_chi: string;
  so_cccd: string;
  trinh_do: string;
  chuyen_mon: string;
  chuc_vu: string;
  don_vi_quan_ly: string;
  vai_tro: string;
  is_profile_completed: boolean;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://localhost:3000/api/vien-chuc/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải thông tin cá nhân');
      }

      const data = await response.json();
      setProfileData(data.data);
      setFormData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      // Validate required fields
      if (!formData.dien_thoai || !formData.dia_chi || !formData.so_cccd) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      const response = await fetch('http://localhost:3000/api/vien-chuc/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dien_thoai: formData.dien_thoai,
          dia_chi: formData.dia_chi,
          so_cccd: formData.so_cccd,
          trinh_do: formData.trinh_do,
          chuyen_mon: formData.chuyen_mon,
          chuc_vu: formData.chuc_vu
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin');
      }

      setSuccess('Cập nhật thông tin thành công!');
      setEditMode(false);
      loadProfile();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData || {});
    setEditMode(false);
    setError(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-page">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Header />
        <div className="profile-page">
          <div className="container">
            <div className="error-state">
              <p>{error || 'Không tìm thấy thông tin cá nhân'}</p>
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="profile-title">
              <User size={32} />
              <div>
                <h1>Thông tin cá nhân</h1>
                <p>Quản lý thông tin tài khoản và hồ sơ cá nhân</p>
              </div>
            </div>
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)} 
                className="btn btn-primary"
              >
                <Edit2 size={18} />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  onClick={handleCancel} 
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  <X size={18} />
                  <span>Hủy</span>
                </button>
                <button 
                  onClick={handleSave} 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={18} />
                  <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
              <span>❌</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              <p>{success}</p>
            </div>
          )}

          <div className="profile-content">
            {/* Thông tin tài khoản */}
            <div className="profile-section">
              <div className="section-header">
                <User size={20} />
                <h2>Thông tin tài khoản</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Họ và tên:</label>
                  <span>{profileData.ho_ten}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{profileData.email}</span>
                </div>
                <div className="info-item">
                  <label>Vai trò:</label>
                  <span>
                    {profileData.vai_tro === 'VienChuc' ? 'Viên chức' : profileData.vai_tro}
                  </span>
                </div>
                <div className="info-item">
                  <label>Đơn vị:</label>
                  <span>{profileData.don_vi_quan_ly}</span>
                </div>
              </div>
            </div>

            {/* Thông tin liên lạc */}
            <div className="profile-section">
              <div className="section-header">
                <Phone size={20} />
                <h2>Thông tin liên lạc</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Số điện thoại: *</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="dien_thoai"
                      value={formData.dien_thoai || ''}
                      onChange={handleChange}
                      placeholder="0901234567"
                      required
                    />
                  ) : (
                    <span>{profileData.dien_thoai || '—'}</span>
                  )}
                </div>
                <div className="info-item full-width">
                  <label>Địa chỉ: *</label>
                  {editMode ? (
                    <textarea
                      name="dia_chi"
                      value={formData.dia_chi || ''}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ liên lạc"
                      rows={2}
                      required
                    />
                  ) : (
                    <span>{profileData.dia_chi || '—'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* CMND/CCCD */}
            <div className="profile-section">
              <div className="section-header">
                <CreditCard size={20} />
                <h2>CMND/CCCD</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Số CMND/CCCD: *</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="so_cccd"
                      value={formData.so_cccd || ''}
                      onChange={handleChange}
                      placeholder="001234567890"
                      required
                    />
                  ) : (
                    <span>{profileData.so_cccd || '—'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Trình độ chuyên môn */}
            <div className="profile-section">
              <div className="section-header">
                <GraduationCap size={20} />
                <h2>Trình độ chuyên môn</h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Trình độ:</label>
                  {editMode ? (
                    <select 
                      name="trinh_do" 
                      value={formData.trinh_do || ''} 
                      onChange={handleChange}
                    >
                      <option value="">Chọn trình độ</option>
                      <option value="Cử nhân">Cử nhân</option>
                      <option value="Thạc sĩ">Thạc sĩ</option>
                      <option value="Tiến sĩ">Tiến sĩ</option>
                      <option value="Giáo sư">Giáo sư</option>
                      <option value="Phó giáo sư">Phó giáo sư</option>
                    </select>
                  ) : (
                    <span>{profileData.trinh_do || '—'}</span>
                  )}
                </div>
                <div className="info-item">
                  <label>Chuyên môn:</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="chuyen_mon"
                      value={formData.chuyen_mon || ''}
                      onChange={handleChange}
                      placeholder="Ví dụ: Công nghệ thông tin"
                    />
                  ) : (
                    <span>{profileData.chuyen_mon || '—'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Chức vụ */}
            <div className="profile-section">
              <div className="section-header">
                <Briefcase size={20} />
                <h2>Chức vụ công tác</h2>
              </div>
              <div className="info-grid">
                <div className="info-item full-width">
                  <label>Chức vụ:</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="chuc_vu"
                      value={formData.chuc_vu || ''}
                      onChange={handleChange}
                      placeholder="Ví dụ: Giảng viên, Nghiên cứu viên"
                    />
                  ) : (
                    <span>{profileData.chuc_vu || '—'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile completion status */}
            {!profileData.is_profile_completed && (
              <div className="alert alert-warning">
                <span>⚠️</span>
                <div>
                  <p><strong>Hồ sơ chưa hoàn thiện</strong></p>
                  <p>Vui lòng cập nhật đầy đủ thông tin để sử dụng đầy đủ chức năng của hệ thống.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;
