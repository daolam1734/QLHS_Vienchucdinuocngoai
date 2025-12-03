import React, { useEffect, useState } from 'react';
import { 
  FileText, Users, CheckCircle, Clock, TrendingUp, TrendingDown,
  AlertCircle, RefreshCw, Download, BarChart3, Activity
} from 'lucide-react';
import axios from 'axios';
import './AdminLayout.css';

interface Stats {
  totalApplications: number;
  totalChange: string;
  totalTrend: 'up' | 'down';
  pendingApplications: number;
  pendingChange: string;
  approvedApplications: number;
  approvedChange: string;
  totalUsers: number;
  usersChange: string;
  usersTrend: 'up' | 'down';
}

interface RecentApplication {
  id: string;
  name: string;
  department: string;
  type: string;
  country: string;
  status: string;
  date: string;
  statusColor: string;
}

const DashboardOverview_v2: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      setStats({
        totalApplications: data.totalApplications,
        totalChange: data.totalChange,
        totalTrend: data.totalTrend,
        pendingApplications: data.pendingApplications,
        pendingChange: data.pendingChange,
        approvedApplications: data.approvedApplications,
        approvedChange: data.approvedChange,
        totalUsers: data.totalUsers,
        usersChange: data.usersChange,
        usersTrend: data.usersTrend
      });

      setRecentApplications(data.recentApplications || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('duyệt') || statusLower.includes('hoàn')) return 'admin-badge-success';
    if (statusLower.includes('chờ') || statusLower.includes('mới')) return 'admin-badge-warning';
    if (statusLower.includes('từ chối')) return 'admin-badge-danger';
    return 'admin-badge-info';
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <div className="admin-loading-text">Đang tải dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-alert admin-alert-danger">
          <AlertCircle className="admin-alert-icon" />
          <div className="admin-alert-content">
            <div className="admin-alert-title">Lỗi tải dữ liệu</div>
            <div className="admin-alert-description">{error}</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="admin-btn admin-btn-primary" onClick={fetchDashboardData}>
            <RefreshCw size={18} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="admin-page-title-icon">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1>Dashboard</h1>
            <p className="admin-page-subtitle">
              Tổng quan hệ thống quản lý hồ sơ đi nước ngoài
            </p>
          </div>
        </div>
        <div className="admin-page-actions">
          <button 
            className="admin-btn admin-btn-outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
          <button className="admin-btn admin-btn-success">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="admin-stats-grid">
          {/* Total Applications */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-label">Tổng hồ sơ</div>
                <div className="admin-stat-value">{stats.totalApplications}</div>
                <div className={`admin-stat-change ${stats.totalTrend === 'up' ? 'positive' : 'negative'}`}>
                  {stats.totalTrend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stats.totalChange}
                </div>
              </div>
              <div 
                className="admin-stat-icon" 
                style={{ background: 'var(--admin-primary-light)', color: 'var(--admin-primary)' }}
              >
                <FileText size={24} />
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-label">Chờ duyệt</div>
                <div className="admin-stat-value">{stats.pendingApplications}</div>
                <div className="admin-stat-change" style={{ color: 'var(--admin-warning)' }}>
                  <Clock size={16} />
                  {stats.pendingChange}
                </div>
              </div>
              <div 
                className="admin-stat-icon" 
                style={{ background: 'var(--admin-warning-light)', color: 'var(--admin-warning)' }}
              >
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Approved Applications */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-label">Đã duyệt</div>
                <div className="admin-stat-value">{stats.approvedApplications}</div>
                <div className="admin-stat-change positive">
                  <TrendingUp size={16} />
                  {stats.approvedChange}
                </div>
              </div>
              <div 
                className="admin-stat-icon" 
                style={{ background: 'var(--admin-success-light)', color: 'var(--admin-success)' }}
              >
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-label">Người dùng</div>
                <div className="admin-stat-value">{stats.totalUsers}</div>
                <div className={`admin-stat-change ${stats.usersTrend === 'up' ? 'positive' : 'negative'}`}>
                  {stats.usersTrend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stats.usersChange}
                </div>
              </div>
              <div 
                className="admin-stat-icon" 
                style={{ background: 'var(--admin-info-light)', color: 'var(--admin-info)' }}
              >
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div className="admin-card" style={{ marginTop: 'var(--admin-spacing-xl)' }}>
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <Activity size={20} style={{ marginRight: '8px' }} />
            Hồ sơ gần đây
          </h2>
          <button 
            className="admin-btn admin-btn-outline admin-btn-sm"
            onClick={() => window.dispatchEvent(new CustomEvent('changeAdminTab', { detail: { tab: 'hoso' } }))}
          >
            Xem tất cả
          </button>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          {recentApplications.length === 0 ? (
            <div className="admin-empty">
              <FileText className="admin-empty-icon" />
              <div className="admin-empty-title">Chưa có hồ sơ nào</div>
              <div className="admin-empty-description">
                Hồ sơ mới tạo sẽ hiển thị ở đây
              </div>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Đơn vị</th>
                    <th>Loại</th>
                    <th>Quốc gia</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--admin-primary-light)',
                            color: 'var(--admin-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}>
                            {(app.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{app.name}</span>
                        </div>
                      </td>
                      <td>{app.department || '-'}</td>
                      <td>
                        <span className="admin-badge admin-badge-gray">
                          {app.type || 'N/A'}
                        </span>
                      </td>
                      <td>{app.country || '-'}</td>
                      <td>
                        <span className={`admin-badge ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>{formatDate(app.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 'var(--admin-spacing-lg)',
        marginTop: 'var(--admin-spacing-xl)'
      }}>
        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('changeAdminTab', { detail: { tab: 'hoso' } }))}>
          <div className="admin-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-spacing-md)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--admin-radius-md)',
                background: 'var(--admin-primary-light)',
                color: 'var(--admin-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)' }}>
                  Quản lý
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-gray-900)' }}>
                  Hồ sơ
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('changeAdminTab', { detail: { tab: 'users' } }))}>
          <div className="admin-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-spacing-md)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--admin-radius-md)',
                background: 'var(--admin-info-light)',
                color: 'var(--admin-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)' }}>
                  Quản lý
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-gray-900)' }}>
                  Người dùng
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('changeAdminTab', { detail: { tab: 'reports' } }))}>
          <div className="admin-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--admin-spacing-md)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--admin-radius-md)',
                background: 'var(--admin-success-light)',
                color: 'var(--admin-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--admin-gray-600)' }}>
                  Xem
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--admin-gray-900)' }}>
                  Báo cáo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview_v2;
