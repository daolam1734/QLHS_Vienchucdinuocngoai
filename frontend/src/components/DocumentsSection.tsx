import { Link } from 'react-router-dom';
import { FileText, HelpCircle } from 'lucide-react';
import './DocumentsSection.css';

const DocumentsSection = () => {
  return (
    <section className="cta-section">
      <div className="container">
        <h2>Bắt đầu ngay hôm nay</h2>
        <p>Đăng nhập để nộp hồ sơ hoặc xem hướng dẫn chi tiết</p>
        <div className="cta-buttons">
          <Link to="/tai-bieu-mau" className="cta-btn primary">
            <FileText size={20} />
            Tải biểu mẫu
          </Link>
          <Link to="/huong-dan" className="cta-btn secondary">
            <HelpCircle size={20} />
            Hướng dẫn sử dụng
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
