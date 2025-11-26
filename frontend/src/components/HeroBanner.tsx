import { ArrowRight, FileText, BookOpen } from 'lucide-react';
import './HeroBanner.css';

interface HeroBannerProps {
  onLoginClick?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onLoginClick }) => {
  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title">
              Hệ thống trực tuyến phục vụ quản lý hồ sơ đi nước ngoài cho viên chức TVU
            </h1>
            <p className="hero-description">
              Cung cấp các dịch vụ: nộp hồ sơ, xử lý phê duyệt nhiều cấp, ký số, 
              theo dõi tiến độ minh bạch.
            </p>
            <div className="hero-actions">
              <button 
                onClick={onLoginClick}
                className="btn btn-primary"
              >
                <FileText size={20} />
                Đăng nhập để nộp hồ sơ
              </button>
              <a href="#huong-dan" className="btn btn-outline">
                <BookOpen size={20} />
                Xem hướng dẫn
              </a>
            </div>
            
            {/* Quick stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Trực tuyến</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Hỗ trợ</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3-5</div>
                <div className="stat-label">Ngày xử lý</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Khám phá thêm</span>
        <ArrowRight size={20} className="scroll-arrow" />
      </div>
    </section>
  );
};

export default HeroBanner;
