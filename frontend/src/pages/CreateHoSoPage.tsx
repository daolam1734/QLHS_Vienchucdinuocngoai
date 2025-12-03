import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  Info
} from 'lucide-react';
import './CreateHoSoPage.css';

interface LoaiChuyenDi {
  ma_loai: string;
  ten_loai: string;
  mo_ta?: string;
}

interface TaiLieuCanNop {
  id: string;
  ten_tai_lieu: string;
  bat_buoc: boolean;
  ghi_chu?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  loai_tai_lieu: string;
}

interface DieuKienTuDong {
  dat: boolean;
  ten_dieu_kien: string;
  ly_do?: string;
}

const CreateHoSoPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isDangVien, setIsDangVien] = useState(false);
  
  // Master data
  const [loaiChuyenDiList, setLoaiChuyenDiList] = useState<LoaiChuyenDi[]>([]);
  const [taiLieuCanNop, setTaiLieuCanNop] = useState<TaiLieuCanNop[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    loai_chuyen_di: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    quoc_gia_den: '',
    to_chuc_moi: '',
    muc_dich: '',
    muc_do_uu_tien: 'BinhThuong'
  });
  
  // Files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Validation & conditions
  const [dieuKienTuDong, setDieuKienTuDong] = useState<DieuKienTuDong[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserInfo();
    loadMasterData();
  }, []);

  useEffect(() => {
    if (formData.thoi_gian_bat_dau && formData.thoi_gian_ket_thuc) {
      kiemTraDieuKienTuDong();
    }
  }, [formData.thoi_gian_bat_dau, formData.thoi_gian_ket_thuc, uploadedFiles]);

  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserInfo(user);
      
      // Load profile to check dang vien status
      const response = await axios.get('http://localhost:3000/api/vien-chuc/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const isDangVienStatus = response.data.data.is_dang_vien || false;
      setIsDangVien(isDangVienStatus);
      
      // Update tai lieu list based on dang vien status
      const baseTaiLieu: TaiLieuCanNop[] = [
        { id: '1', ten_tai_lieu: 'Thư mời từ tổ chức nước ngoài', bat_buoc: true },
        { id: '2', ten_tai_lieu: 'Đề xuất/Kế hoạch chuyến đi', bat_buoc: true },
        { id: '3', ten_tai_lieu: 'Hộ chiếu (bản sao)', bat_buoc: true },
        { id: '4', ten_tai_lieu: 'Đơn xin nghỉ phép', bat_buoc: true, ghi_chu: 'Đơn xin phép vắng mặt trong thời gian đi công tác' }
      ];
      
      if (isDangVienStatus) {
        baseTaiLieu.push({
          id: '5',
          ten_tai_lieu: 'Đơn xin đi nước ngoài việc riêng (Tài liệu đảng viên)',
          bat_buoc: true,
          ghi_chu: 'Dành cho đảng viên - Đơn xin phép của Chi bộ để đi nước ngoài'
        });
      }
      
      baseTaiLieu.push(
        { id: '6', ten_tai_lieu: 'Chương trình chi tiết chuyến đi', bat_buoc: false },
        { id: '7', ten_tai_lieu: 'Tài liệu bổ sung khác', bat_buoc: false }
      );
      
      setTaiLieuCanNop(baseTaiLieu);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const loadMasterData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/master-data/loai-chuyen-di', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoaiChuyenDiList(response.data.data || []);
    } catch (error) {
      console.error('Error loading master data:', error);
    }
  };

  const kiemTraDieuKienTuDong = () => {
    const conditions: DieuKienTuDong[] = [];
    
    // Kiểm tra thời gian
    const batDau = new Date(formData.thoi_gian_bat_dau);
    const ketThuc = new Date(formData.thoi_gian_ket_thuc);
    const soNgay = Math.ceil((ketThuc.getTime() - batDau.getTime()) / (1000 * 60 * 60 * 24));
    
    conditions.push({
      dat: soNgay >= 1 && soNgay <= 365,
      ten_dieu_kien: 'Thời gian chuyến đi hợp lệ',
      ly_do: soNgay < 1 ? 'Thời gian quá ngắn' : soNgay > 365 ? 'Thời gian quá dài' : undefined
    });
    
    // Kiểm tra tài liệu bắt buộc
    const taiLieuBatBuoc = taiLieuCanNop.filter(tl => tl.bat_buoc);
    const daUploadDu = taiLieuBatBuoc.every(tl => 
      uploadedFiles.some(file => file.loai_tai_lieu === tl.id && file.status === 'success')
    );
    
    conditions.push({
      dat: daUploadDu,
      ten_dieu_kien: 'Tài liệu bắt buộc đầy đủ',
      ly_do: !daUploadDu ? 'Còn thiếu tài liệu bắt buộc' : undefined
    });
    
    // Kiểm tra thông tin cơ bản
    conditions.push({
      dat: Boolean(formData.loai_chuyen_di && formData.quoc_gia_den && formData.to_chuc_moi && formData.muc_dich),
      ten_dieu_kien: 'Thông tin cơ bản đầy đủ',
      ly_do: 'Cần điền đầy đủ thông tin bắt buộc'
    });
    
    setDieuKienTuDong(conditions);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, loaiTaiLieu: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const token = localStorage.getItem('token');
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `${Date.now()}-${i}`;
      
      // Add file to list with uploading status
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
        loai_tai_lieu: loaiTaiLieu
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Simulate upload (replace with actual API call)
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('loai_tai_lieu', loaiTaiLieu);
        
        // Simulate progress
        const interval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId && f.progress < 90 
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);
        
        // Upload file (commented out - replace with actual endpoint)
        // await axios.post('http://localhost:3000/api/tai-lieu/upload', formData, {
        //   headers: { 
        //     Authorization: `Bearer ${token}`,
        //     'Content-Type': 'multipart/form-data'
        //   }
        // });
        
        // Simulate success after 2 seconds
        setTimeout(() => {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: 'success' }
              : f
          ));
        }, 2000);
        
      } catch (error) {
        console.error('Upload error:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error' }
            : f
        ));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        trang_thai: 'Nhap'
      };
      
      await axios.post('http://localhost:3000/api/ho-so', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Đã lưu nháp hồ sơ thành công!');
      navigate('/vien-chuc');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      alert(error.response?.data?.message || 'Không thể lưu nháp. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.loai_chuyen_di || !formData.quoc_gia_den || !formData.to_chuc_moi || 
        !formData.thoi_gian_bat_dau || !formData.thoi_gian_ket_thuc || !formData.muc_dich) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    // Check conditions
    const allConditionsMet = dieuKienTuDong.every(dk => dk.dat);
    if (!allConditionsMet) {
      alert('Hồ sơ chưa đáp ứng đầy đủ các điều kiện. Vui lòng kiểm tra lại!');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowConfirmModal(false);
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        trang_thai: 'MoiTao'
      };
      
      await axios.post('http://localhost:3000/api/ho-so', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Gửi hồ sơ thành công! Hồ sơ sẽ được chuyển đến ' + (isDangVien ? 'Chi bộ' : 'Đơn vị quản lý') + ' để xét duyệt.');
      navigate('/vien-chuc');
    } catch (error: any) {
      console.error('Error submitting:', error);
      alert(error.response?.data?.message || 'Không thể gửi hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="form-section">
      <h3 className="section-title">
        <Info size={20} />
        Thông tin chung về chuyến đi
      </h3>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>
            Loại chuyến đi <span className="required">*</span>
          </label>
          <select
            value={formData.loai_chuyen_di}
            onChange={(e) => setFormData({ ...formData, loai_chuyen_di: e.target.value })}
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
            <Calendar size={16} />
            Từ ngày <span className="required">*</span>
          </label>
          <input
            type="date"
            value={formData.thoi_gian_bat_dau}
            onChange={(e) => setFormData({ ...formData, thoi_gian_bat_dau: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <Calendar size={16} />
            Đến ngày <span className="required">*</span>
          </label>
          <input
            type="date"
            value={formData.thoi_gian_ket_thuc}
            onChange={(e) => setFormData({ ...formData, thoi_gian_ket_thuc: e.target.value })}
            min={formData.thoi_gian_bat_dau}
            required
          />
        </div>

        <div className="form-group">
          <label>
            Quốc gia đến <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.quoc_gia_den}
            onChange={(e) => setFormData({ ...formData, quoc_gia_den: e.target.value })}
            placeholder="VD: Nhật Bản"
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
            onChange={(e) => setFormData({ ...formData, to_chuc_moi: e.target.value })}
            placeholder="VD: Tokyo University"
            required
          />
        </div>

        <div className="form-group">
          <label>Mức độ ưu tiên</label>
          <select
            value={formData.muc_do_uu_tien}
            onChange={(e) => setFormData({ ...formData, muc_do_uu_tien: e.target.value })}
          >
            <option value="BinhThuong">Bình thường</option>
            <option value="Cao">Cao</option>
            <option value="KhanCap">Khẩn cấp</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-section">
      <h3 className="section-title">
        <FileText size={20} />
        Lý do và mục đích chuyến đi
      </h3>
      
      <div className="form-group full-width">
        <label>
          Mục đích chi tiết <span className="required">*</span>
        </label>
        <textarea
          value={formData.muc_dich}
          onChange={(e) => setFormData({ ...formData, muc_dich: e.target.value })}
          placeholder="Mô tả chi tiết mục đích, nội dung chuyến đi..."
          rows={6}
          required
        />
        <small className="help-text">
          Vui lòng mô tả rõ ràng mục đích, nội dung công việc, kết quả mong đợi của chuyến đi
        </small>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-section">
      <h3 className="section-title">
        <Upload size={20} />
        Tài liệu đính kèm
      </h3>
      
      <div className="documents-list">
        {taiLieuCanNop.map((taiLieu) => (
          <div key={taiLieu.id} className="document-item">
            <div className="document-header">
              <div className="document-info">
                <FileText size={18} />
                <span className="document-name">
                  {taiLieu.ten_tai_lieu}
                  {taiLieu.bat_buoc && <span className="required"> *</span>}
                </span>
              </div>
              <label className="upload-button">
                <Upload size={16} />
                Tải lên
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, taiLieu.id)}
                  style={{ display: 'none' }}
                  multiple
                />
              </label>
            </div>
            
            {taiLieu.ghi_chu && (
              <small className="document-note">{taiLieu.ghi_chu}</small>
            )}
            
            {/* Display uploaded files for this document type */}
            <div className="uploaded-files">
              {uploadedFiles
                .filter(file => file.loai_tai_lieu === taiLieu.id)
                .map(file => (
                  <div key={file.id} className={`uploaded-file ${file.status}`}>
                    <div className="file-info">
                      <FileText size={16} />
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="progress-text">{file.progress}%</span>
                      </div>
                    )}
                    
                    {file.status === 'success' && (
                      <CheckCircle size={18} className="status-icon success" />
                    )}
                    
                    {file.status === 'error' && (
                      <AlertCircle size={18} className="status-icon error" />
                    )}
                    
                    <button 
                      className="remove-file"
                      onClick={() => removeFile(file.id)}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-section">
      <h3 className="section-title">
        <CheckCircle size={20} />
        Kiểm tra điều kiện tự động
      </h3>
      
      <div className="conditions-check">
        {dieuKienTuDong.map((dk, index) => (
          <div key={index} className={`condition-item ${dk.dat ? 'success' : 'error'}`}>
            <div className="condition-icon">
              {dk.dat ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <div className="condition-content">
              <div className="condition-name">{dk.ten_dieu_kien}</div>
              {!dk.dat && dk.ly_do && (
                <div className="condition-reason">{dk.ly_do}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="workflow-info">
        <div className="info-box">
          <Info size={20} />
          <div>
            <strong>Quy trình duyệt:</strong>
            <p>
              {isDangVien 
                ? 'Vì bạn là đảng viên, hồ sơ sẽ được chuyển đến Chi bộ để xét duyệt trước, sau đó mới đến Đơn vị quản lý.'
                : 'Hồ sơ sẽ được chuyển trực tiếp đến Đơn vị quản lý để xét duyệt.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="create-hoso-page">
        <div className="page-container">
          {/* Header */}
          <div className="page-header">
            <button className="back-button" onClick={() => navigate('/vien-chuc')}>
              <ArrowLeft size={20} />
              Quay lại
            </button>
            <h1>Tạo hồ sơ xin phép đi nước ngoài</h1>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Thông tin chuyến đi</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Mục đích</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Tài liệu</div>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Xác nhận</div>
            </div>
          </div>

          {/* Form Content */}
          <div className="form-content">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <div className="action-left">
              {currentStep > 1 && (
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Quay lại
                </button>
              )}
            </div>
            
            <div className="action-right">
              <button 
                className="btn-outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                <Save size={18} />
                Lưu nháp
              </button>
              
              {currentStep < 4 ? (
                <button 
                  className="btn-primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Tiếp tục
                </button>
              ) : (
                <button 
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !dieuKienTuDong.every(dk => dk.dat)}
                >
                  <Send size={18} />
                  Gửi hồ sơ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận gửi hồ sơ</h3>
              <button onClick={() => setShowConfirmModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Bạn có chắc chắn muốn gửi hồ sơ này không? 
                Sau khi gửi, hồ sơ sẽ được chuyển đến {isDangVien ? 'Chi bộ' : 'Đơn vị quản lý'} để xét duyệt.
              </p>
              <p>
                <strong>Lưu ý:</strong> Bạn sẽ không thể chỉnh sửa hồ sơ sau khi gửi trừ khi được yêu cầu bổ sung.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-primary"
                onClick={confirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Xác nhận gửi'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CreateHoSoPage;
