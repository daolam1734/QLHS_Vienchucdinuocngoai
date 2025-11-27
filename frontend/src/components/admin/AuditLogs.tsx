import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Calendar, User, FileText, Settings, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface AuditLog {
  id: string;
  nguoiThucHien: string;
  hanhDong: string;
  doiTuong: string;
  moTa: string;
  thoiGian: string;
  ipAddress: string;
  loai: 'info' | 'warning' | 'success' | 'error';
}

const AuditLogs: React.FC = () => {
  const [logList, setLogList] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAuditLogs();
  }, [currentPage, filterType]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/v1/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 20,
          type: filterType !== 'all' ? filterType : undefined
        }
      });

      setLogList(response.data.logs);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      setError(err.response?.data?.message || 'Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const getLogIcon = (action: string) => {
    if (action.includes('Đăng nhập')) return <Lock size={16} />;
    if (action.includes('hồ sơ')) return <FileText size={16} />;
    if (action.includes('người dùng') || action.includes('tài khoản')) return <User size={16} />;
    if (action.includes('cấu hình')) return <Settings size={16} />;
    return <History size={16} />;
  };

  const getLogTypeClass = (type: string) => {
    const typeClasses = {
      info: 'log-info',
      success: 'log-success',
      warning: 'log-warning',
      error: 'log-error'
    };
    return typeClasses[type as keyof typeof typeClasses] || 'log-info';
  };

  const filteredLogs = logList.filter(log => {
    const matchSearch = log.nguoiThucHien.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.hanhDong.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       log.moTa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || log.loai === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Lịch sử hoạt động</h1>
          <p className="page-description">Theo dõi và kiểm tra các hoạt động trong hệ thống</p>
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
          <AlertCircle size={48} color="#F44336" />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchAuditLogs}>
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
            placeholder="Tìm kiếm theo người thực hiện, hành động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="info">Thông tin</option>
            <option value="success">Thành công</option>
            <option value="warning">Cảnh báo</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
      </div>

      <div className="audit-logs-container">
        {filteredLogs.map(log => (
          <div key={log.id} className={`audit-log-item ${getLogTypeClass(log.loai)}`}>
            <div className="log-icon">
              {getLogIcon(log.hanhDong)}
            </div>
            <div className="log-content">
              <div className="log-header">
                <span className="log-user">
                  <User size={14} />
                  {log.nguoiThucHien}
                </span>
                <span className="log-action">{log.hanhDong}</span>
                {log.doiTuong !== 'Hệ thống' && (
                  <span className="log-object">{log.doiTuong}</span>
                )}
              </div>
              <div className="log-description">{log.moTa}</div>
              <div className="log-footer">
                <span className="log-time">
                  <Calendar size={12} />
                  {log.thoiGian}
                </span>
                <span className="log-ip">IP: {log.ipAddress}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <History size={48} />
            <p>Không tìm thấy lịch sử hoạt động nào</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="pagination-info">Hiển thị 1-{filteredLogs.length} của {logList.length} hoạt động</span>
        <div className="pagination-buttons">
          <button className="btn-secondary" disabled>Trước</button>
          <button className="btn-primary">1</button>
          <button className="btn-secondary" disabled>Sau</button>
        </div>
      </div>

      <div className="pagination">
        <span className="pagination-info">Trang {currentPage} / {totalPages}</span>
        <div className="pagination-buttons">
          <button 
            className="btn-secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          <button className="btn-primary">{currentPage}</button>
          <button 
            className="btn-secondary" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AuditLogs;
