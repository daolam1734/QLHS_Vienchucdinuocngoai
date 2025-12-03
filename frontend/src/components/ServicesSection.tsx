import { Link } from 'react-router-dom';
import { FileText, Shield, Clock, CheckCircle } from 'lucide-react';
import './ServicesSection.css';

const ServicesSection = () => {
  const features = [
    {
      icon: <FileText size={40} />,
      title: 'Nộp hồ sơ online',
      description: 'Điền form trực tuyến, tải tài liệu dễ dàng',
      color: '#0066cc'
    },
    {
      icon: <Shield size={40} />,
      title: 'Quy trình Đảng viên',
      description: 'Tự động xử lý 7 cấp duyệt',
      color: '#f59e0b'
    },
    {
      icon: <Clock size={40} />,
      title: 'Theo dõi tiến độ',
      description: 'Cập nhật trạng thái thời gian thực',
      color: '#17a2b8'
    },
    {
      icon: <CheckCircle size={40} />,
      title: 'Thông báo tức thì',
      description: 'Email và hệ thống khi có kết quả',
      color: '#28a745'
    }
  ];

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">Tính năng nổi bật</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
