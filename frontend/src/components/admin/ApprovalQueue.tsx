import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, Filter, Eye, CheckCircle, XCircle, AlertTriangle, AlertCircle as AlertCircleIcon, RefreshCw } from 'lucide-react';
import axios from 'axios';

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
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/approval-queue', {
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

  const handleApprove = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn phê duyệt hồ sơ này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/admin/approval/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApprovalList(approvalList.filter(item => item.id !== id));
      alert('Phê duyệt thành công');
    } catch (err: any) {
      console.error('Error approving:', err);
      alert(err.response?.data?.message || 'Không thể phê duyệt');
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Nhập lý do từ chối:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/admin/approval/${id}/reject`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApprovalList(approvalList.filter(item => item.id !== id));
      alert('Đã từ chối hồ sơ');
    } catch (err: any) {
      console.error('Error rejecting:', err);
      alert(err.response?.data?.message || 'Không thể từ chối');
    }
  };

  const handleView = (id: string) => {
    // TODO: Implement view detail
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
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <AlertCircleIcon size={48} color="#F44336" />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchApprovalQueue}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={20} />
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="all">Tất cả cấp duyệt</option>
            <option value="Trưởng khoa">Trưởng khoa</option>
            <option value="TCHC">TCHC</option>
            <option value="BGH">BGH</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
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
                    <div className="flex-center">
                      {getPriorityIcon(item.doUuTien)}
                      <span className="ml-1">{getPriorityLabel(item.doUuTien)}</span>
                    </div>
                  </td>
                  <td className="font-medium">{item.maHoSo}</td>
                  <td>{item.hoTen}</td>
                  <td>{item.donVi}</td>
                  <td>{item.loaiHoSo}</td>
                  <td>
                    <span className="role-badge role-truongkhoa">{item.capDuyet}</span>
                  </td>
                  <td>{new Date(item.ngayNop).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={daysRemaining < 2 ? 'text-red-500 font-medium' : ''}>
                      {new Date(item.hanXuLy).toLocaleDateString('vi-VN')}
                      <div style={{fontSize: '0.75rem', color: '#666'}}>({daysRemaining} ngày)</div>
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon btn-success" title="Phê duyệt">
                        <CheckCircle size={16} />
                      </button>
                      <button className="btn-icon btn-danger" title="Từ chối">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredApprovals.length === 0 && (
          <div className="empty-state">
            <CheckSquare size={48} />
            <p>Không có hồ sơ nào chờ phê duyệt</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="pagination-info">Hiển thị 1-{filteredApprovals.length} của {approvalList.length} hồ sơ</span>
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

export default ApprovalQueue;
