import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Filter, Eye, AlertTriangle, AlertCircle as AlertCircleIcon, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getLoaiHoSoText } from '../../utils/mappings';

interface ApprovalItem {
  id: string;
  maHoSo: string;
  hoTen: string;
  donVi: string;
  loaiHoSo: string;
  capDuyet: string;
  ngayNop: string;
  hanXuLy: string;
  doUuTien: 'high' | 'medium' | 'low';
}

const ApprovalQueue: React.FC = () => {
  const [approvalList, setApprovalList] = useState<ApprovalItem[]>([]);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovalQueue();
  }, []);

  const fetchApprovalQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/admin/approval-queue', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApprovalList(response.data);
    } catch (err: any) {
      console.error('Error fetching approval queue:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách phê duyệt');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    console.log('View approval item:', id);
    alert('Chức năng xem chi tiết đang được phát triển');
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium': return <Clock size={16} className="text-orange-500" />;
      case 'low': return <Clock size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredApprovals = approvalList.filter(item => {
    const matchLevel = filterLevel === 'all' || item.capDuyet === filterLevel;
    const matchPriority = filterPriority === 'all' || item.doUuTien === filterPriority;
    return matchLevel && matchPriority;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Phê duyệt hồ sơ</h1>
          <p className="page-description">Danh sách hồ sơ chờ phê duyệt</p>
        </div>
        <div className="stats-mini">
          <div className="stat-item">
            <Clock size={20} />
            <span>{approvalList.length} hồ sơ chờ duyệt</span>
          </div>
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
          <AlertCircleIcon className="admin-alert-icon" />
          <div className="admin-alert-content">
            <div className="admin-alert-title">Lỗi tải dữ liệu</div>
            <div className="admin-alert-description">{error}</div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={fetchApprovalQueue} style={{marginTop: 16}}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="admin-toolbar">
        <div className="admin-filter-group">
          <Filter size={18} />
          <select className="admin-select" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="all">Tất cả cấp duyệt</option>
            <option value="Trưởng khoa">Trưởng khoa</option>
            <option value="TCHC">TCHC</option>
            <option value="BGH">BGH</option>
          </select>
        </div>

        <div className="admin-filter-group">
          <select className="admin-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Độ ưu tiên</th>
              <th>Mã hồ sơ</th>
              <th>Họ tên</th>
              <th>Đơn vị</th>
              <th>Loại hồ sơ</th>
              <th>Cấp duyệt</th>
              <th>Ngày nộp</th>
              <th>Hạn xử lý</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredApprovals.map(item => {
              const daysRemaining = getDaysRemaining(item.hanXuLy);
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                      {getPriorityIcon(item.doUuTien)}
                      <span>{getPriorityLabel(item.doUuTien)}</span>
                    </div>
                  </td>
                  <td style={{fontWeight: 600}}>{item.maHoSo}</td>
                  <td>{item.hoTen}</td>
                  <td>{item.donVi}</td>
                  <td>{getLoaiHoSoText(item.loaiHoSo)}</td>
                  <td>
                    <span className="admin-badge admin-badge-info">{item.capDuyet}</span>
                  </td>
                  <td>{new Date(item.ngayNop).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div style={{color: daysRemaining < 2 ? 'var(--admin-danger)' : 'inherit', fontWeight: daysRemaining < 2 ? 600 : 400}}>
                      {new Date(item.hanXuLy).toLocaleDateString('vi-VN')}
                      <div style={{fontSize: '0.75rem', color: 'var(--admin-gray-500)', marginTop: 2}}>({daysRemaining} ngày)</div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button 
                        className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon" 
                        title="Xem chi tiết"
                        onClick={() => handleView(item.id)}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredApprovals.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <CheckSquare size={48} />
            </div>
            <div className="admin-empty-title">Không có hồ sơ nào chờ phê duyệt</div>
            <div className="admin-empty-description">Tất cả hồ sơ đã được xử lý hoặc thay đổi bộ lọc</div>
          </div>
        )}
      </div>

      {filteredApprovals.length > 0 && (
      <div className="admin-pagination">
        <span className="admin-pagination-info">Hiển thị 1-{filteredApprovals.length} của {approvalList.length} hồ sơ</span>
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

export default ApprovalQueue;
