import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import './DashboardOverview.css';

interface Stats {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
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

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/v1/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;
      
      // Map API data to stats format
      const mappedStats: Stats[] = [
        {
          title: 'Tổng hồ sơ',
          value: data.totalApplications?.toString() || '0',
          change: data.totalChange || '+0%',
          trend: data.totalTrend || 'up',
          icon: <FileText size={24} />,
          color: '#1976D2'
        },
        {
          title: 'Chờ phê duyệt',
          value: data.pendingApplications?.toString() || '0',
          change: data.pendingChange || '+0',
          trend: 'up',
          icon: <Clock size={24} />,
          color: '#FF9800'
        },
        {
          title: 'Đã duyệt',
          value: data.approvedApplications?.toString() || '0',
          change: data.approvedChange || '+0%',
          trend: 'up',
          icon: <CheckCircle size={24} />,
          color: '#4CAF50'
        },
        {
          title: 'Người dùng',
          value: data.totalUsers?.toString() || '0',
          change: data.usersChange || '+0%',
          trend: data.usersTrend || 'up',
          icon: <Users size={24} />,
          color: '#9C27B0'
        }
      ];

      setStats(mappedStats);
      setRecentApplications(data.recentApplications || []);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="error-container">
          <AlertCircle size={48} color="#F44336" />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchDashboardData}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Tổng quan hệ thống</h1>
          <p>Xin chào! Đây là bảng điều khiển quản lý hồ sơ đi nước ngoài</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary">
            <ArrowUpRight size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-value-row">
                <h2 className="stat-value">{stat.value}</h2>
                <span className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Applications */}
        <div className="dashboard-card recent-applications">
          <div className="card-header">
            <h3>Hồ sơ gần đây</h3>
            <button className="link-button">Xem tất cả</button>
          </div>
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Mã HS</th>
                  <th>Họ tên</th>
                  <th>Đơn vị</th>
                  <th>Loại</th>
                  <th>Nước đến</th>
                  <th>Ngày nộp</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map(app => (
                  <tr key={app.id}>
                    <td className="cell-id">{app.id}</td>
                    <td className="cell-name">{app.name}</td>
                    <td className="cell-dept">{app.department}</td>
                    <td>{app.type}</td>
                    <td>{app.country}</td>
                    <td className="cell-date">{app.date}</td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ 
                          background: `${app.statusColor}15`, 
                          color: app.statusColor 
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show message if no recent applications */}
        {recentApplications.length === 0 && (
          <div className="dashboard-card">
            <div className="empty-state">
              <FileText size={48} />
              <p>Chưa có hồ sơ nào</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card quick-actions">
        <h3>Thao tác nhanh</h3>
        <div className="actions-grid">
          <button className="action-button">
            <FileText size={20} />
            <span>Tạo hồ sơ mới</span>
          </button>
          <button className="action-button">
            <Users size={20} />
            <span>Thêm người dùng</span>
          </button>
          <button className="action-button">
            <CheckCircle size={20} />
            <span>Phê duyệt hồ sơ</span>
          </button>
          <button className="action-button">
            <TrendingUp size={20} />
            <span>Xem báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
