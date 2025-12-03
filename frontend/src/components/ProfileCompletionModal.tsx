import { useState } from 'react';
import { X, User, Phone, CreditCard, GraduationCap, Briefcase } from 'lucide-react';
import './ProfileCompletionModal.css';

interface ProfileData {
  dien_thoai: string;
  so_cccd: string;
  dia_chi: string;
  trinh_do: string;
  chuyen_mon: string;
  chuc_vu: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userEmail: string;
}

function ProfileCompletionModal({ isOpen, onClose, onComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    dien_thoai: '',
    so_cccd: '',
    dia_chi: '',
    trinh_do: '',
    chuyen_mon: '',
    chuc_vu: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.dien_thoai || !formData.so_cccd || !formData.dia_chi) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/vien-chuc/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông tin');
      }

      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.isProfileCompleted = true;
      localStorage.setItem('user', JSON.stringify(user));

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal-container profile-completion-modal">
        <div className="modal-header">
          <div className="modal-title">
            <User size={24} />
            <h2>Hoàn thiện hồ sơ cá nhân</h2>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="alert alert-info">
            <p>Vui lòng cung cấp đầy đủ thông tin cá nhân để hoàn tất việc tạo tài khoản. Các trường đánh dấu (*) là bắt buộc.</p>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            {/* Thông tin liên hệ */}
            <div className="form-section">
              <h3><Phone size={18} /> Thông tin liên hệ</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="dien_thoai"
                    value={formData.dien_thoai}
                    onChange={handleChange}
                    placeholder="0123456789"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    name="dia_chi"
                    value={formData.dia_chi}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    required
                  />
                </div>
              </div>
            </div>

            {/* CMND/CCCD */}
            <div className="form-section">
              <h3><CreditCard size={18} /> CMND/CCCD</h3>
              <div className="form-group">
                <label>Số CMND/CCCD *</label>
                <input
                  type="text"
                  name="so_cccd"
                  value={formData.so_cccd}
                  onChange={handleChange}
                  placeholder="001234567890"
                  required
                />
              </div>
            </div>

            {/* Học vị và chuyên ngành */}
            <div className="form-section">
              <h3><GraduationCap size={18} /> Trình độ chuyên môn</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Trình độ</label>
                  <select name="trinh_do" value={formData.trinh_do} onChange={handleChange}>
                    <option value="">Chọn trình độ</option>
                    <option value="Cử nhân">Cử nhân</option>
                    <option value="Thạc sĩ">Thạc sĩ</option>
                    <option value="Tiến sĩ">Tiến sĩ</option>
                    <option value="Giáo sư">Giáo sư</option>
                    <option value="Phó giáo sư">Phó giáo sư</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Chuyên môn</label>
                  <input
                    type="text"
                    name="chuyen_mon"
                    value={formData.chuyen_mon}
                    onChange={handleChange}
                    placeholder="Ví dụ: Công nghệ thông tin"
                  />
                </div>
              </div>
            </div>

            {/* Chức vụ */}
            <div className="form-section">
              <h3><Briefcase size={18} /> Chức vụ công tác</h3>
              <div className="form-group">
                <label>Chức vụ</label>
                <input
                  type="text"
                  name="chuc_vu"
                  value={formData.chuc_vu}
                  onChange={handleChange}
                  placeholder="Ví dụ: Giảng viên, Nghiên cứu viên"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Bỏ qua (hoàn thiện sau)
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : 'Hoàn tất'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCompletionModal;
