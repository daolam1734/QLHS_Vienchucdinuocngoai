import { LogIn, FileText, Building2, Users, CheckSquare, FileCheck } from 'lucide-react';
import './ProcessTimeline.css';

const ProcessTimeline = () => {
  const steps = [
    {
      id: 1,
      icon: <LogIn size={32} />,
      title: 'Đăng nhập hệ thống',
      description: 'Viên chức đăng nhập bằng tài khoản được cấp',
      status: 'required',
      color: '#0066cc'
    },
    {
      id: 2,
      icon: <FileText size={32} />,
      title: 'Tạo hồ sơ – Đính kèm – Ký số',
      description: 'Điền thông tin, tải tài liệu và ký số trực tuyến',
      status: 'active',
      color: '#17a2b8'
    },
    {
      id: 3,
      icon: <Building2 size={32} />,
      title: 'Đơn vị xác nhận',
      description: 'Trưởng khoa/phòng xác nhận hồ sơ',
      status: 'pending',
      color: '#ffc107'
    },
    {
      id: 4,
      icon: <Users size={32} />,
      title: 'Chi bộ – Đảng ủy phê duyệt',
      description: 'Cấp Đảng xem xét và phê duyệt',
      status: 'pending',
      color: '#dc3545'
    },
    {
      id: 5,
      icon: <CheckSquare size={32} />,
      title: 'Ban Giám hiệu duyệt cuối',
      description: 'BGH phê duyệt và xuất kết quả',
      status: 'pending',
      color: '#28a745'
    }
  ];

  return (
    <section className="process-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Quy trình xử lý hồ sơ</h2>
          <p className="section-subtitle">
            5 bước thực hiện đầy đủ từ nộp đơn đến nhận kết quả
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="process-timeline desktop-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className="timeline-step">
              <div 
                className={`step-circle ${step.status}`}
                style={{ backgroundColor: step.color }}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.id}</div>
              </div>
              
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="process-timeline mobile-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className="timeline-item">
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
                  Bước {step.id}
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
            <FileCheck size={40} />
            <div className="info-content">
              <h4>Thời gian xử lý trung bình</h4>
              <p>3-5 ngày làm việc (tùy loại hồ sơ)</p>
            </div>
          </div>
          <div className="info-card">
            <Users size={40} />
            <div className="info-content">
              <h4>Phê duyệt đa cấp</h4>
              <p>Đảm bảo quy trình hành chính và Đảng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
