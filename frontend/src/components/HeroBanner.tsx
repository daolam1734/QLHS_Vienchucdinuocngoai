import { BookOpen } from 'lucide-react';
import './HeroBanner.css';

interface HeroBannerProps {
  onLoginClick?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onLoginClick }) => {
  return (
    <section className="hero-banner">
      <div className="container">
        <div className="hero-wrapper">
          <div className="hero-text">
            <h1>Hệ thống quản lý hồ sơ <span className="highlight">viên chức đi nước ngoài</span></h1>
            <p className="slogan">Nhanh chóng - Minh bạch - Hiệu quả</p>
          </div>
          
          <div className="hero-actions">
            <a href="/huong-dan" className="btn-guide">
              <BookOpen size={18} />
              Hướng dẫn sử dụng
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
