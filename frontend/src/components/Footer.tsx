import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Facebook,
  Youtube,
  Shield,
  FileText,
  ChevronRight
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: About */}
            <div className="footer-col">
              <h3 className="footer-title">Hệ thống quản lý hồ sơ</h3>
              <p className="footer-text">
                Cổng dịch vụ trực tuyến phục vụ quản lý hồ sơ xin phép đi nước ngoài 
                của viên chức Trường Đại học Trà Vinh.
              </p>
              <div className="footer-badges">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40'%3E%3Crect fill='%23fff' width='100' height='40' rx='5'/%3E%3Ctext x='50' y='25' font-size='12' fill='%230066cc' text-anchor='middle' font-weight='bold'%3ECông DVC%3C/text%3E%3C/svg%3E"
                  alt="Dịch vụ công"
                  className="badge-img"
                />
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40'%3E%3Crect fill='%23fff' width='100' height='40' rx='5'/%3E%3Ctext x='50' y='25' font-size='12' fill='%23dc3545' text-anchor='middle' font-weight='bold'%3EChuyển đổi số%3C/text%3E%3C/svg%3E"
                  alt="Chuyển đổi số"
                  className="badge-img"
                />
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h3 className="footer-title">Liên kết nhanh</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/gioi-thieu">
                    <ChevronRight size={16} />
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link to="/quy-trinh">
                    <ChevronRight size={16} />
                    Quy trình – Thủ tục
                  </Link>
                </li>
                <li>
                  <Link to="/tai-bieu-mau">
                    <ChevronRight size={16} />
                    Tải biểu mẫu
                  </Link>
                </li>
                <li>
                  <Link to="/huong-dan">
                    <ChevronRight size={16} />
                    Hướng dẫn sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/login">
                    <ChevronRight size={16} />
                    Đăng nhập
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="footer-col">
              <h3 className="footer-title">Chính sách & Điều khoản</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/chinh-sach">
                    <Shield size={16} />
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link to="/dieu-khoan">
                    <FileText size={16} />
                    Điều khoản sử dụng
                  </Link>
                </li>
                <li>
                  <Link to="/quy-dinh">
                    <FileText size={16} />
                    Quy định chung
                  </Link>
                </li>
                <li>
                  <Link to="/huong-dan-bao-mat">
                    <Shield size={16} />
                    Hướng dẫn bảo mật
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col">
              <h3 className="footer-title">Thông tin liên hệ</h3>
              <ul className="footer-contact">
                <li>
                  <MapPin size={18} />
                  <div>
                    <strong>Địa chỉ:</strong><br />
                    126 Nguyễn Thiện Thành, Khóm 4,<br />
                    Phường 5, TP. Trà Vinh
                  </div>
                </li>
                <li>
                  <Phone size={18} />
                  <div>
                    <strong>Hotline:</strong><br />
                    0294.3855.246
                  </div>
                </li>
                <li>
                  <Mail size={18} />
                  <div>
                    <strong>Email:</strong><br />
                    tchc@tvu.edu.vn
                  </div>
                </li>
                <li>
                  <Globe size={18} />
                  <div>
                    <strong>Website:</strong><br />
                    <a href="https://tvu.edu.vn" target="_blank" rel="noopener noreferrer">
                      www.tvu.edu.vn
                    </a>
                  </div>
                </li>
              </ul>

              {/* Social Media */}
              <div className="footer-social">
                <a href="https://facebook.com/tvu.edu.vn" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://youtube.com/@tvu" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Trường Đại học Trà Vinh. Tất cả quyền được bảo lưu.
            </p>
            <p className="developer">
              Phát triển bởi: <strong>daoconghoanglam</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
