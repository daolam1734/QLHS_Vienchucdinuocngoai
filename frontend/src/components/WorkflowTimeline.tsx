import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WorkflowTimeline.css';

interface WorkflowStep {
  ma_duyet: string;
  cap_duyet: number;
  vai_tro_duyet: string;
  trang_thai: string;
  ten_nguoi_duyet: string;
  chuc_danh: string;
  y_kien?: string;
  ngay_duyet?: string;
  ngay_tao: string;
}

interface WorkflowTimelineProps {
  ma_ho_so: string;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ ma_ho_so }) => {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflow();
  }, [ma_ho_so]);

  const loadWorkflow = async () => {
    try {
      const response = await axios.get(`/api/workflow/ho-so/${ma_ho_so}`);
      if (response.data.success) {
        setWorkflow(response.data.data);
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (trang_thai: string) => {
    switch (trang_thai) {
      case 'DaDuyet':
        return '✓';
      case 'TuChoi':
        return '✗';
      case 'YeuCauBoSung':
        return '↻';
      case 'ChoDuyet':
        return '⋯';
      default:
        return '○';
    }
  };

  const getStepColor = (trang_thai: string) => {
    switch (trang_thai) {
      case 'DaDuyet':
        return 'success';
      case 'TuChoi':
        return 'danger';
      case 'YeuCauBoSung':
        return 'warning';
      case 'ChoDuyet':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const getStepLabel = (vai_tro: string) => {
    const labels: { [key: string]: string } = {
      'BiThuChiBo': 'Chi bộ',
      'BiThuDangUy': 'Đảng ủy',
      'TruongDonVi': 'Đơn vị',
      'TCHC': 'Phòng TCHC',
      'BGH': 'Ban Giám hiệu'
    };
    return labels[vai_tro] || vai_tro;
  };

  if (loading) {
    return <div className="workflow-timeline-loading">Đang tải workflow...</div>;
  }

  return (
    <div className="workflow-timeline">
      <h3 className="timeline-title">Quy trình duyệt</h3>
      <div className="timeline-container">
        {workflow.map((step, index) => (
          <div key={step.ma_duyet} className={`timeline-step ${getStepColor(step.trang_thai)}`}>
            <div className="step-number">
              <span className={`step-icon ${getStepColor(step.trang_thai)}`}>
                {getStepIcon(step.trang_thai)}
              </span>
              <span className="step-level">Bước {step.cap_duyet}</span>
            </div>

            <div className="step-content">
              <div className="step-header">
                <h4 className="step-role">{getStepLabel(step.vai_tro_duyet)}</h4>
                <span className={`step-badge ${getStepColor(step.trang_thai)}`}>
                  {step.trang_thai === 'DaDuyet' ? 'Đã duyệt' :
                   step.trang_thai === 'TuChoi' ? 'Từ chối' :
                   step.trang_thai === 'YeuCauBoSung' ? 'Yêu cầu bổ sung' :
                   step.trang_thai === 'ChoDuyet' ? 'Chờ duyệt' : 'Chưa bắt đầu'}
                </span>
              </div>

              <div className="step-details">
                <p className="approver-info">
                  <strong>{step.chuc_danh} {step.ten_nguoi_duyet}</strong>
                </p>
                
                {step.ngay_duyet && (
                  <p className="approval-date">
                    Ngày duyệt: {new Date(step.ngay_duyet).toLocaleDateString('vi-VN')}
                  </p>
                )}

                {step.y_kien && (
                  <div className="approval-comment">
                    <strong>Ý kiến:</strong>
                    <p>{step.y_kien}</p>
                  </div>
                )}
              </div>
            </div>

            {index < workflow.length - 1 && (
              <div className={`step-connector ${step.trang_thai === 'DaDuyet' ? 'completed' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTimeline;
