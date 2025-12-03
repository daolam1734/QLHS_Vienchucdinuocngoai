import Header from '../components/Header';
import Footer from '../components/Footer';
import './GioiThieuPage.css';

const GioiThieuPage = () => {
  return (
    <div className="page-root">
      <Header />
      <main className="page-main">
        <section className="intro-hero">
          <div className="container">
            <h1>Giới thiệu</h1>
            <p>
              Hệ thống quản lý hồ sơ xin phép đi nước ngoài là giải pháp số hóa toàn diện,
              giúp viên chức Trường Đại học Trà Vinh thực hiện thủ tục xin phép nhanh chóng,
              minh bạch và thuận tiện.
            </p>
          </div>
        </section>

        <section className="intro-grid">
          <div className="container intro-grid-container">
            <div className="intro-card highlight">
              <div className="card-icon">🎯</div>
              <h2>Mục tiêu</h2>
              <p>
                Số hóa toàn bộ quy trình xin phép đi nước ngoài, loại bỏ hồ sơ giấy,
                rút ngắn thời gian xử lý từ vài tuần xuống còn vài ngày. Đảm bảo tính
                minh bạch, truy xuất nguồn gốc và đồng bộ dữ liệu trong toàn trường.
              </p>
            </div>
            <div className="intro-card highlight">
              <div className="card-icon">👥</div>
              <h2>Đối tượng sử dụng</h2>
              <ul>
                <li><strong>Viên chức:</strong> Nộp và theo dõi hồ sơ trực tuyến 24/7</li>
                <li><strong>Người duyệt:</strong> Phê duyệt hồ sơ theo phân cấp quyền hạn</li>
                <li><strong>Quản trị viên:</strong> Quản lý hệ thống, cấu hình và báo cáo</li>
                <li><strong>Lãnh đạo:</strong> Theo dõi thống kê, ra quyết định kịp thời</li>
              </ul>
            </div>
            <div className="intro-card highlight">
              <div className="card-icon">⚡</div>
              <h2>Tính năng nổi bật</h2>
              <ul>
                <li>Tạo và nộp hồ sơ trực tuyến mọi lúc, mọi nơi</li>
                <li>Phê duyệt đa cấp với quy trình linh hoạt</li>
                <li>Thông báo tự động qua email và hệ thống</li>
                <li>Lịch sử xử lý minh bạch, có thể truy xuất</li>
                <li>Báo cáo, thống kê theo thời gian thực</li>
                <li>Tích hợp SSO với tài khoản TVU</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="intro-benefits">
          <div className="container">
            <h2>Lợi ích của hệ thống</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">📱</div>
                <h3>Tiện lợi</h3>
                <p>Nộp và theo dõi hồ sơ mọi lúc, mọi nơi qua thiết bị di động hoặc máy tính</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <h3>Nhanh chóng</h3>
                <p>Rút ngắn thời gian xử lý từ 2-3 tuần xuống còn 3-5 ngày làm việc</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <h3>Bảo mật</h3>
                <p>Dữ liệu được mã hóa, phân quyền chặt chẽ theo chức danh và vai trò</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">♻️</div>
                <h3>Thân thiện môi trường</h3>
                <p>Giảm thiểu sử dụng giấy tờ, đóng góp vào bảo vệ môi trường</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">📊</div>
                <h3>Minh bạch</h3>
                <p>Theo dõi chi tiết từng bước xử lý, lịch sử thao tác được lưu vết đầy đủ</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <h3>Tiết kiệm</h3>
                <p>Giảm chi phí in ấn, lưu trữ và vận chuyển hồ sơ giấy</p>
              </div>
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </div>
  );
};

export default GioiThieuPage;
