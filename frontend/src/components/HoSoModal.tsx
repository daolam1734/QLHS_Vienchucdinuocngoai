import { useState, useEffect } from 'react';
import { X, Save, FileText, Calendar, Globe, Building, Target } from 'lucide-react';
import './HoSoModal.css';

interface HoSoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingHoSo?: any;
}

const HoSoModal: React.FC<HoSoModalProps> = ({ isOpen, onClose, onSuccess, editingHoSo }) => {
  const [formData, setFormData] = useState({
    quocGiaDen: '',
    thanhPho: '',
    toChucMoi: '',
    diaChi: '',
    mucDich: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    ghiChu: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHoSo) {
      setFormData({
        quocGiaDen: editingHoSo.quoc_gia_den || '',
        thanhPho: editingHoSo.thanh_pho || '',
        toChucMoi: editingHoSo.to_chuc_moi || '',
        diaChi: editingHoSo.dia_chi || '',
        mucDich: editingHoSo.muc_dich || '',
        ngayBatDau: editingHoSo.ngay_bat_dau?.split('T')[0] || '',
        ngayKetThuc: editingHoSo.ngay_ket_thuc?.split('T')[0] || '',
        ghiChu: editingHoSo.ghi_chu || ''
      });
    } else {
      // Reset form for new ho so
      setFormData({
        quocGiaDen: '',
        thanhPho: '',
        toChucMoi: '',
        diaChi: '',
        mucDich: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        ghiChu: ''
      });
    }
  }, [editingHoSo, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingHoSo 
        ? `http://localhost:3000/api/ho-so/${editingHoSo.ho_so_id}`
        : 'http://localhost:3000/api/ho-so';
      
      const method = editingHoSo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quoc_gia_den: formData.quocGiaDen,
          thanh_pho: formData.thanhPho,
          to_chuc_moi: formData.toChucMoi,
          dia_chi: formData.diaChi,
          muc_dich: formData.mucDich,
          ngay_bat_dau: formData.ngayBatDau,
          ngay_ket_thuc: formData.ngayKetThuc,
          ghi_chu: formData.ghiChu
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="hoso-modal-overlay" onClick={onClose}>
      <div className="hoso-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="hoso-modal-header">
          <h2>
            <FileText size={24} />
            {editingHoSo ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="hoso-form">
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Globe size={18} />
                Quốc gia đến <span className="required">*</span>
              </label>
              <input
                type="text"
                name="quocGiaDen"
                value={formData.quocGiaDen}
                onChange={handleChange}
                placeholder="Ví dụ: Mỹ, Nhật Bản, Hàn Quốc..."
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Building size={18} />
                Thành phố
              </label>
              <input
                type="text"
                name="thanhPho"
                value={formData.thanhPho}
                onChange={handleChange}
                placeholder="Thành phố/Tỉnh"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <Building size={18} />
                Tổ chức mời <span className="required">*</span>
              </label>
              <input
                type="text"
                name="toChucMoi"
                value={formData.toChucMoi}
                onChange={handleChange}
                placeholder="Tên tổ chức/cơ quan mời"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>
                <Building size={18} />
                Địa chỉ tổ chức
              </label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                placeholder="Địa chỉ chi tiết"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <Target size={18} />
                Mục đích <span className="required">*</span>
              </label>
              <input
                type="text"
                name="mucDich"
                value={formData.mucDich}
                onChange={handleChange}
                placeholder="Mục đích chuyến đi (học tập, nghiên cứu, hội thảo...)"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={18} />
                Ngày bắt đầu <span className="required">*</span>
              </label>
              <input
                type="date"
                name="ngayBatDau"
                value={formData.ngayBatDau}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Calendar size={18} />
                Ngày kết thúc <span className="required">*</span>
              </label>
              <input
                type="date"
                name="ngayKetThuc"
                value={formData.ngayKetThuc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>
                <FileText size={18} />
                Ghi chú
              </label>
              <textarea
                name="ghiChu"
                value={formData.ghiChu}
                onChange={handleChange}
                placeholder="Thông tin bổ sung (nếu có)"
                rows={3}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              <Save size={18} />
              {loading ? 'Đang lưu...' : editingHoSo ? 'Cập nhật' : 'Tạo hồ sơ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HoSoModal;
