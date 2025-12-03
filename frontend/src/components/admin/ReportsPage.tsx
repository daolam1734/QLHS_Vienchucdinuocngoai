import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, FileText, Users, Globe, Award, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { getLoaiHoSoText } from '../../utils/mappings';
import './AdminLayout.css';

interface ReportStats {
  totalApplications: number;
  approved: number;
  pending: number;
  rejected: number;
  byCountry: { country: string; count: number }[];
  byDepartment: { dept: string; count: number }[];
  byType: { type: string; count: number; percent: number }[];
}

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState<ReportStats>({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    byCountry: [],
    byDepartment: [],
    byType: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:3000/api/admin/reports?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/admin/reports/export?timeRange=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bao-cao-${timeRange}-${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert('Xuất báo cáo thành công');
    } catch (err: any) {
      console.error('Error exporting report:', err);
      alert('Không thể xuất báo cáo');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1>Báo cáo thống kê</h1>
            <p className="admin-page-subtitle">Thống kê và phân tích dữ liệu hồ sơ đi nước ngoài</p>
          </div>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary" onClick={handleExport}>
            <Download size={20} />
            Xuất báo cáo
          </button>
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
          <button className="admin-btn admin-btn-primary" onClick={fetchReportData} style={{marginTop: 16}}>
            <RefreshCw size={20} />
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
      <div className="admin-toolbar" style={{marginBottom: 24}}>
        <div className="admin-filter-group">
          <Calendar size={20} />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
        </div>

        <div className="admin-filter-group">
          <BarChart3 size={20} />
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="overview">Tổng quan</option>
            <option value="department">Theo đơn vị</option>
            <option value="country">Theo quốc gia</option>
            <option value="type">Theo loại hồ sơ</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="admin-stats-grid" style={{marginBottom: '2rem'}}>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-label">Tổng hồ sơ</div>
              <div className="admin-stat-value">{stats.totalApplications}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-label">Đã duyệt</div>
              <div className="admin-stat-value">{stats.approved}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'var(--admin-success-light)', color: 'var(--admin-success)' }}>
              <Award size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-label">Chờ duyệt</div>
              <div className="admin-stat-value">{stats.pending}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'var(--admin-warning-light)', color: 'var(--admin-warning)' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-label">Từ chối</div>
              <div className="admin-stat-value">{stats.rejected}</div>
            </div>
            <div className="admin-stat-icon" style={{ background: 'var(--admin-danger-light)', color: 'var(--admin-danger)' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="reports-grid">
        {/* By Country */}
        <div className="report-card">
          <div className="report-header">
            <h3><Globe size={20} /> Theo quốc gia</h3>
          </div>
          <div className="report-content">
            {(stats.byCountry || []).map((item, index) => (
              <div key={index} className="progress-item">
                <div className="progress-label">
                  <span>{item.country}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${(item.count / stats.totalApplications) * 100}%`, background: '#1976D2'}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Department */}
        <div className="report-card">
          <div className="report-header">
            <h3><Users size={20} /> Theo đơn vị</h3>
          </div>
          <div className="report-content">
            {(stats.byDepartment || []).map((item, index) => (
              <div key={index} className="progress-item">
                <div className="progress-label">
                  <span>{item.dept}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${(item.count / stats.totalApplications) * 100}%`, background: '#4CAF50'}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Type */}
        <div className="report-card" style={{gridColumn: 'span 2'}}>
          <div className="report-header">
            <h3><FileText size={20} /> Theo loại hồ sơ</h3>
          </div>
          <div className="report-content">
            <div className="type-stats">
              {(stats.byType || []).map((item, index) => (
                <div key={index} className="type-stat-item">
                  <div className="type-stat-header">
                    <span className="type-stat-label">{getLoaiHoSoText(item.type)}</span>
                    <span className="type-stat-value">{item.count}</span>
                  </div>
                  <div className="progress-bar" style={{marginTop: '0.5rem'}}>
                    <div 
                      className="progress-fill" 
                      style={{width: `${item.percent}%`, background: '#FF9800'}}
                    ></div>
                  </div>
                  <span className="type-stat-percent">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default ReportsPage;
