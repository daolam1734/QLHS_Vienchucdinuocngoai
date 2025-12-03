import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WorkflowTimeline from '../components/WorkflowTimeline';
import DashboardHeader from '../components/DashboardHeader';
import './ApprovalWorkflowPage.css';

interface HoSoChoDuyet {
  ma_ho_so: string;
  ma_duyet: string;
  cap_duyet: number;
  vai_tro_duyet: string;
  ten_vien_chuc: string;
  email_vien_chuc: string;
  is_dang_vien: boolean;
  ten_don_vi: string;
  loai_chuyen_di: string;
  quoc_gia_den: string;
  muc_dich: string;
  muc_do_uu_tien: string;
  trang_thai: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  ngay_tao: string;
}

const ApprovalWorkflowPage: React.FC = () => {
  const [hoSoList, setHoSoList] = useState<HoSoChoDuyet[]>([]);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoChoDuyet | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [yKien, setYKien] = useState('');
  const [thongKe, setThongKe] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hoSoRes, thongKeRes] = await Promise.all([
        axios.get('/api/workflow/cho-duyet'),
        axios.get('/api/workflow/thong-ke')
      ]);

      if (hoSoRes.data.success) {
        setHoSoList(hoSoRes.data.data);
      }

      if (thongKeRes.data.success) {
        setThongKe(thongKeRes.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (trang_thai: 'DaDuyet' | 'TuChoi' | 'YeuCauBoSung') => {
    if (!selectedHoSo) return;

    if (trang_thai === 'TuChoi' && !yKien.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    if (trang_thai === 'YeuCauBoSung' && !yKien.trim()) {
      alert('Vui lòng nhập nội dung cần bổ sung');
      return;
    }

    const confirmMessage =
      trang_thai === 'DaDuyet' ? 'Bạn có chắc muốn phê duyệt hồ sơ này?' :
      trang_thai === 'TuChoi' ? 'Bạn có chắc muốn từ chối hồ sơ này?' :
      'Bạn có chắc muốn yêu cầu bổ sung hồ sơ này?';

    if (!confirm(confirmMessage)) return;

    try {
      setActionLoading(true);

      const response = await axios.post('/api/workflow/approve', {
        ma_duyet: selectedHoSo.ma_duyet,
        trang_thai,
        y_kien: yKien.trim() || undefined
      });

      if (response.data.success) {
        alert(response.data.message);
        setSelectedHoSo(null);
        setYKien('');
        loadData();
      }
    } catch (error: any) {
      console.error('Error approving:', error);
      alert(error.response?.data?.message || 'Lỗi khi xử lý duyệt hồ sơ');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges: { [key: string]: { label: string; className: string } } = {
      'KhanCap': { label: 'Khẩn cấp', className: 'badge-danger' },
      'Cao': { label: 'Cao', className: 'badge-warning' },
      'BinhThuong': { label: 'Bình thường', className: 'badge-info' }
    };
    return badges[priority] || badges['BinhThuong'];
  };

  if (loading) {
    return <div className="approval-page-loading">Đang tải...</div>;
  }

  return (
    <div className="approval-workflow-page">
      <DashboardHeader />
      
      <div className="page-content">
        <div className="page-header">
          <h1>Duyệt hồ sơ</h1>
        
        {thongKe && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Chờ duyệt:</span>
              <span className="stat-value primary">{thongKe.cho_duyet || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã duyệt:</span>
              <span className="stat-value success">{thongKe.da_duyet || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Từ chối:</span>
              <span className="stat-value danger">{thongKe.tu_choi || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="approval-content">
        <div className="ho-so-list">
          <h2>Danh sách hồ sơ chờ duyệt ({hoSoList.length})</h2>
          
          {hoSoList.length === 0 ? (
            <div className="empty-state">
              <p>Không có hồ sơ chờ duyệt</p>
            </div>
          ) : (
            <div className="list-container">
              {hoSoList.map((hoSo) => {
                const priorityBadge = getPriorityBadge(hoSo.muc_do_uu_tien);
                return (
                  <div
                    key={hoSo.ma_ho_so}
                    className={`ho-so-card ${selectedHoSo?.ma_ho_so === hoSo.ma_ho_so ? 'selected' : ''}`}
                    onClick={() => setSelectedHoSo(hoSo)}
                  >
                    <div className="card-header">
                      <h3>{hoSo.ten_vien_chuc}</h3>
                      <span className={`priority-badge ${priorityBadge.className}`}>
                        {priorityBadge.label}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <p><strong>Đơn vị:</strong> {hoSo.ten_don_vi}</p>
                      <p><strong>Loại:</strong> {hoSo.loai_chuyen_di}</p>
                      <p><strong>Đến:</strong> {hoSo.quoc_gia_den}</p>
                      <p><strong>Thời gian:</strong> {new Date(hoSo.thoi_gian_bat_dau).toLocaleDateString('vi-VN')} - {new Date(hoSo.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')}</p>
                      {hoSo.is_dang_vien && (
                        <span className="dang-vien-badge">Đảng viên</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ho-so-detail">
          {selectedHoSo ? (
            <>
              <div className="detail-header">
                <h2>Chi tiết hồ sơ</h2>
                <button className="btn-close" onClick={() => setSelectedHoSo(null)}>×</button>
              </div>

              <div className="detail-content">
                <div className="info-section">
                  <h3>Thông tin chuyến đi</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Viên chức:</label>
                      <span>{selectedHoSo.ten_vien_chuc}</span>
                    </div>
                    <div className="info-item">
                      <label>Đơn vị:</label>
                      <span>{selectedHoSo.ten_don_vi}</span>
                    </div>
                    <div className="info-item">
                      <label>Loại chuyến đi:</label>
                      <span>{selectedHoSo.loai_chuyen_di}</span>
                    </div>
                    <div className="info-item">
                      <label>Quốc gia:</label>
                      <span>{selectedHoSo.quoc_gia_den}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Mục đích:</label>
                      <span>{selectedHoSo.muc_dich}</span>
                    </div>
                  </div>
                </div>

                <WorkflowTimeline ma_ho_so={selectedHoSo.ma_ho_so} />

                <div className="action-section">
                  <h3>Ý kiến duyệt</h3>
                  <textarea
                    className="y-kien-input"
                    placeholder="Nhập ý kiến của bạn (không bắt buộc khi duyệt, bắt buộc khi từ chối/yêu cầu bổ sung)"
                    value={yKien}
                    onChange={(e) => setYKien(e.target.value)}
                    rows={4}
                  />

                  <div className="action-buttons">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove('DaDuyet')}
                      disabled={actionLoading}
                    >
                      ✓ Phê duyệt
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleApprove('YeuCauBoSung')}
                      disabled={actionLoading}
                    >
                      ↻ Yêu cầu bổ sung
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleApprove('TuChoi')}
                      disabled={actionLoading}
                    >
                      ✗ Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Chọn một hồ sơ để xem chi tiết và duyệt</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ApprovalWorkflowPage;
