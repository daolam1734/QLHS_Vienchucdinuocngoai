import { Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Search, 
  Download, 
  HelpCircle,
  Lock
} from 'lucide-react';
import './ServicesSection.css';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      icon: <FileText size={40} />,
      title: 'Nộp hồ sơ trực tuyến',
      description: 'Viên chức đăng nhập để tạo hồ sơ mới, đính kèm tài liệu và ký số.',
      action: 'Đăng nhập để nộp',
      link: '/login',
      status: 'active',
      color: '#0066cc'
    },
    {
      id: 2,
      icon: <CheckCircle size={40} />,
      title: 'Phê duyệt đa cấp',
      description: 'Đơn vị → Chi bộ → Đảng ủy → Ban Giám hiệu, theo dõi minh bạch từng trạng thái.',
      action: 'Xem quy trình',
      link: '/quy-trinh',
      status: 'active',
      color: '#28a745'
    },
    {
      id: 3,
      icon: <Search size={40} />,
      title: 'Tra cứu hồ sơ',
      description: 'Vui lòng đăng nhập để sử dụng chức năng tra cứu hồ sơ và theo dõi tiến độ.',
      action: 'Yêu cầu đăng nhập',
      link: '/login',
      status: 'locked',
      color: '#ffc107'
    },
    {
      id: 4,
      icon: <Download size={40} />,
      title: 'Tải biểu mẫu',
      description: 'Tải các biểu mẫu PDF/Word: Đơn xin đi, bản cam kết đảng viên và các mẫu theo quy định.',
      action: 'Xem biểu mẫu',
      link: '/tai-bieu-mau',
      status: 'active',
      color: '#dc3545'
    },
    {
      id: 5,
      icon: <HelpCircle size={40} />,
      title: 'Hỗ trợ – Hướng dẫn',
      description: 'FAQ, video hướng dẫn, câu hỏi thường gặp và quy trình nộp hồ sơ chi tiết.',
      action: 'Truy cập hỗ trợ',
      link: '/huong-dan',
      status: 'active',
      color: '#6c757d'
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Dịch vụ trực tuyến</h2>
          <p className="section-subtitle">
            Các chức năng chính của hệ thống quản lý hồ sơ đi nước ngoài
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`service-card ${service.status === 'locked' ? 'locked' : ''}`}
              style={{ '--card-color': service.color } as React.CSSProperties}
            >
              <div className="service-icon" style={{ color: service.color }}>
                {service.icon}
                {service.status === 'locked' && (
                  <div className="lock-badge">
                    <Lock size={16} />
                  </div>
                )}
              </div>
              
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <Link 
                to={service.link} 
                className={`service-link ${service.status === 'locked' ? 'locked-link' : ''}`}
              >
                {service.action}
                <span className="arrow">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="services-note">
          <div className="note-box">
            <strong>📌 Lưu ý:</strong> Các chức năng tra cứu và nộp hồ sơ yêu cầu đăng nhập. 
            Vui lòng sử dụng tài khoản được cấp bởi Phòng Tổ chức - Hành chính.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
