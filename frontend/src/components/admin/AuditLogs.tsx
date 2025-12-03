import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Calendar, User, FileText, Settings, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getLoaiCongViecText } from '../../utils/mappings';

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
      
      const response = await axios.get(`http://localhost:3000/api/admin/audit-logs`, {
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
    const matchSearch = (log.nguoiThucHien?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                       (log.hanhDong?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                       (log.moTa?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || log.loai === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <History size={20} />
          </div>
          <div>
            <h1>Nhật ký hệ thống</h1>
            <p className="admin-page-subtitle">Theo dõi và kiểm tra các hoạt động trong hệ thống</p>
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
          <AlertCircle className="admin-alert-icon" />
          <div className="admin-alert-content">
            <div className="admin-alert-title">Lỗi tải dữ liệu</div>
            <div className="admin-alert-description">{error}</div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={fetchAuditLogs} style={{marginTop: 16}}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search className="admin-search-icon" size={18} />
          <input
            type="text"
            className="admin-input admin-search-input"
            placeholder="Tìm kiếm theo người thực hiện, hành động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <Filter size={20} />
          <select className="admin-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả loại</option>
            <option value="info">Thông tin</option>
            <option value="success">Thành công</option>
            <option value="warning">Cảnh báo</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--admin-spacing-md)'}}>
        {filteredLogs.map(log => (
          <div key={log.id} className="admin-card">
            <div className="admin-card-body" style={{padding: 'var(--admin-spacing-md)'}}>
              <div style={{display: 'flex', gap: 'var(--admin-spacing-md)', alignItems: 'flex-start'}}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--admin-radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: log.loai === 'success' ? 'var(--admin-success-light)' :
                             log.loai === 'error' ? 'var(--admin-danger-light)' :
                             log.loai === 'warning' ? 'var(--admin-warning-light)' : 'var(--admin-info-light)',
                  color: log.loai === 'success' ? 'var(--admin-success)' :
                         log.loai === 'error' ? 'var(--admin-danger)' :
                         log.loai === 'warning' ? 'var(--admin-warning)' : 'var(--admin-info)',
                  flexShrink: 0
                }}>
                  {getLogIcon(log.hanhDong)}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--admin-spacing-sm)', marginBottom: 'var(--admin-spacing-xs)', flexWrap: 'wrap'}}>
                    <span style={{fontWeight: 600, color: 'var(--admin-gray-900)', display: 'flex', alignItems: 'center', gap: 4}}>
                      <User size={14} />
                      {log.nguoiThucHien}
                    </span>
                    <span className={`admin-badge ${
                      log.loai === 'success' ? 'admin-badge-success' :
                      log.loai === 'error' ? 'admin-badge-danger' :
                      log.loai === 'warning' ? 'admin-badge-warning' : 'admin-badge-info'
                    }`}>
                      {getLoaiCongViecText(log.hanhDong)}
                    </span>
                    {log.doiTuong !== 'Hệ thống' && (
                      <span className="admin-badge admin-badge-gray">{log.doiTuong}</span>
                    )}
                  </div>
                  <div style={{color: 'var(--admin-gray-700)', fontSize: '0.875rem', marginBottom: 'var(--admin-spacing-sm)'}}>{log.moTa}</div>
                  <div style={{display: 'flex', gap: 'var(--admin-spacing-lg)', fontSize: '0.75rem', color: 'var(--admin-gray-500)'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 4}}>
                      <Calendar size={12} />
                      {log.thoiGian}
                    </span>
                    <span>IP: {log.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <History size={48} />
            </div>
            <div className="admin-empty-title">Không tìm thấy nhật ký hoạt động nào</div>
            <div className="admin-empty-description">Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc</div>
          </div>
        )}
      </div>

      {filteredLogs.length > 0 && (
      <div className="admin-pagination">
        <span className="admin-pagination-info">Trang {currentPage} / {totalPages}</span>
        <div className="admin-pagination-controls">
          <button 
            className="admin-pagination-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          <button className="admin-pagination-btn active">{currentPage}</button>
          <button 
            className="admin-pagination-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      </div>
      )}
      </>
      )}
    </div>
  );
};

export default AuditLogs;
