import { LogIn, FileText, Building2, Users, CheckSquare, FileCheck, Shield, UserCheck, Clock, Bell } from 'lucide-react';
import './ProcessTimeline.css';

const ProcessTimeline = () => {
  const steps = [
    {
      id: 1,
      icon: <FileText size={32} />,
      title: 'Nộp hồ sơ online',
      description: 'Chỉ cần 5 phút',
      color: '#0066cc',
      forParty: false
    },
    {
      id: 2,
      icon: <Shield size={32} />,
      title: 'Quy trình Đảng viên',
      description: 'Tự động qua Chi bộ & Đảng ủy',
      color: '#f59e0b',
      forParty: true
    },
    {
      id: 3,
      icon: <Building2 size={32} />,
      title: 'Phê duyệt đa cấp',
      description: 'Đơn vị → TCNS → BGH',
      color: '#6366f1',
      forParty: false
    },
    {
      id: 4,
      icon: <Bell size={32} />,
      title: 'Thông báo kết quả',
      description: 'Nhận email tức thì',
      color: '#17a2b8',
      forParty: false
    },
    {
      id: 5,
      icon: <CheckSquare size={32} />,
      title: 'Hoàn tất',
      description: 'Trong 5-7 ngày làm việc',
      color: '#28a745',
      forParty: false
    }
  ];

  return (
    <section className="process-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Làm thế nào để nộp hồ sơ?</h2>
          <p className="section-subtitle">
            Quy trình đơn giản, nhanh chóng và hoàn toàn minh bạch
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="process-timeline desktop-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className={`timeline-step ${step.forParty ? 'party-step' : ''}`}>
              <div 
                className={`step-circle ${step.status}`}
                style={{ backgroundColor: step.color }}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.id}</div>
              </div>
              
              <div className="step-content">
                <h3 className="step-title">
                  {step.title}
                  {step.forParty && <Shield className="party-badge" size={18} />}
                </h3>
                <p className="step-description">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="process-timeline mobile-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className={`timeline-item ${step.forParty ? 'party-step' : ''}`}>
              <div className="timeline-marker">
                <div 
                  className={`marker-circle ${step.status}`}
                  style={{ backgroundColor: step.color }}
                >
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="marker-line"></div>
                )}
              </div>
              
              <div className="timeline-content">
                <div className="content-badge" style={{ backgroundColor: step.color }}>
                  Bước {step.id} {step.forParty && '🛡️'}
                </div>
                <h3 className="content-title">{step.title}</h3>
                <p className="content-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Process info */}
        <div className="process-info">
          <div className="info-card">
            <Clock size={40} />
            <div className="info-content">
              <h4>5-7 ngày</h4>
              <p>Thời gian xử lý trung bình</p>
            </div>
          </div>
          <div className="info-card party-card">
            <Shield size={40} />
            <div className="info-content">
              <h4>Đảng viên</h4>
              <p>Quy trình riêng qua Chi bộ & Đảng ủy</p>
            </div>
          </div>
          <div className="info-card">
            <Bell size={40} />
            <div className="info-content">
              <h4>Theo dõi 24/7</h4>
              <p>Cập nhật trạng thái mọi lúc mọi nơi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
