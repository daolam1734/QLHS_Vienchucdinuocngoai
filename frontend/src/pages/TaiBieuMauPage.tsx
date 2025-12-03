import Header from '../components/Header';
import Footer from '../components/Footer';
import './TaiBieuMauPage.css';

const TaiBieuMauPage = () => {
  const handleDownload = (filename: string) => {
    // Placeholder for download functionality
    console.log('Downloading:', filename);
    alert(`Tải xuống: ${filename}\n(Chức năng này sẽ được kích hoạt khi có file mẫu thực tế)`);
  };

  return (
    <div className="page-root">
      <Header />
      <main className="page-main">
        {/* Hero Section */}
        <section className="tbm-hero">
          <div className="container">
            <h1>Tải biểu mẫu</h1>
            <p>
              Tải xuống các biểu mẫu và tài liệu cần thiết cho việc xin phép đi nước ngoài
            </p>
          </div>
        </section>

        {/* Documents Section */}
        <section className="tbm-documents">
          <div className="container">
            
            {/* Biểu mẫu chính */}
            <div className="document-category">
              <h2>
                <span className="category-icon">📄</span>
                Biểu mẫu chính thức
              </h2>
              <div className="document-grid">
                <div className="document-card">
                  <div className="doc-icon">📝</div>
                  <div className="doc-info">
                    <h3>Đơn xin xác nhận công tác</h3>
                    <p>Mẫu đơn xin xác nhận đi nước ngoài phục vụ công tác (hội nghị, đào tạo, công tác)</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">48 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Don_xin_xac_nhan_cong_tac.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📝</div>
                  <div className="doc-info">
                    <h3>Đơn xin nghỉ phép đi nước ngoài (Việc riêng)</h3>
                    <p>Mẫu đơn xin nghỉ phép đi nước ngoài cho mục đích cá nhân (du lịch, thăm thân)</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">45 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Don_xin_nghi_phep_di_nuoc_ngoai_viec_rieng.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📋</div>
                  <div className="doc-info">
                    <h3>Báo cáo kết quả chuyến đi (Cá nhân)</h3>
                    <p>Mẫu báo cáo kết quả sau chuyến đi nước ngoài (dành cho cá nhân)</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">42 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Bao_cao_ket_qua_chuyen_di.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📋</div>
                  <div className="doc-info">
                    <h3>Báo cáo kết quả đoàn công tác</h3>
                    <p>Mẫu báo cáo kết quả chuyến đi nước ngoài đối với đoàn công tác</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">50 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Bao_cao_ket_qua_doan_cong_tac.docx')}
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>

            {/* Biểu mẫu dành cho Đảng viên */}
            <div className="document-category highlight">
              <h2>
                <span className="category-icon">🏴</span>
                Biểu mẫu dành cho Đảng viên
              </h2>
              <div className="document-grid">
                <div className="document-card">
                  <div className="doc-icon">📃</div>
                  <div className="doc-info">
                    <h3>Đơn xin đi nước ngoài (Việc riêng)</h3>
                    <p>Mẫu 1 - Đơn xin đi nước ngoài việc riêng dành cho Đảng viên</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">52 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('195_mau-1_don-xin-di-nuoc-ngoai-viec-rieng_cv57duk_bs-24102025.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📃</div>
                  <div className="doc-info">
                    <h3>Báo cáo kết quả đi nước ngoài</h3>
                    <p>Mẫu 2 - Báo cáo kết quả sau chuyến đi nước ngoài (Đảng viên)</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">48 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('195_mau-2_bao-cao-ket-qua-di-nuoc-ngoai-_cv57dukbs-24102025.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📃</div>
                  <div className="doc-info">
                    <h3>Trích biên bản Chi bộ</h3>
                    <p>Mẫu 3 - Trích biên bản Chi bộ về đảng viên đi nước ngoài việc riêng</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">45 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('195_mau-3_trich-bien-ban-chi-bo-dang-vien-di-nuoc-ngoai-viec-rieng_cv57duk_bs-24102025.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📃</div>
                  <div className="doc-info">
                    <h3>Tờ trình xem xét Đảng viên</h3>
                    <p>Mẫu 4 - Tờ trình xem xét đảng viên đi nước ngoài việc riêng</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 Word (.docx)</span>
                      <span className="doc-size">50 KB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('195_mau-4_to-trinh-xem-xet-dang-vien-di-nuoc-ngoai-viec-rieng_24102025.docx')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📄</div>
                  <div className="doc-info">
                    <h3>Công văn thực hiện trình tự thủ tục</h3>
                    <p>Công văn hướng dẫn trình tự, thủ tục đi nước ngoài cho Đảng viên</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 PDF</span>
                      <span className="doc-size">1.2 MB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('195_cv-thuc-hien-trinh-tu-thu-tuc-di-nuoc-ngoai_cv57duk.pdf')}
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>

            {/* Tài liệu hướng dẫn */}
            <div className="document-category">
              <h2>
                <span className="category-icon">📚</span>
                Tài liệu hướng dẫn
              </h2>
              <div className="document-grid">
                <div className="document-card">
                  <div className="doc-icon">📖</div>
                  <div className="doc-info">
                    <h3>Hướng dẫn sử dụng hệ thống</h3>
                    <p>Tài liệu hướng dẫn chi tiết cách sử dụng hệ thống quản lý hồ sơ</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 PDF</span>
                      <span className="doc-size">2.5 MB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Huong_dan_su_dung_he_thong.pdf')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📖</div>
                  <div className="doc-info">
                    <h3>Quy trình xử lý hồ sơ</h3>
                    <p>Sơ đồ và mô tả chi tiết quy trình xử lý hồ sơ từng bước</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 PDF</span>
                      <span className="doc-size">1.8 MB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Quy_trinh_xu_ly_ho_so.pdf')}
                  >
                    Tải xuống
                  </button>
                </div>

                <div className="document-card">
                  <div className="doc-icon">📖</div>
                  <div className="doc-info">
                    <h3>Văn bản quy định</h3>
                    <p>Các văn bản, quy định liên quan đến viên chức đi nước ngoài</p>
                    <div className="doc-meta">
                      <span className="doc-format">📎 PDF</span>
                      <span className="doc-size">3.2 MB</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download"
                    onClick={() => handleDownload('Van_ban_quy_dinh.pdf')}
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="note-box">
              <h3>📌 Lưu ý quan trọng</h3>
              <ul>
                <li>Các biểu mẫu được cập nhật theo quy định mới nhất của Trường ĐH Trà Vinh</li>
                <li>Vui lòng kiểm tra kỹ thông tin trước khi điền vào biểu mẫu</li>
                <li>Nếu gặp vấn đề khi tải xuống, vui lòng liên hệ Phòng TCNS: <strong>0294.3855.246</strong></li>
                <li><strong>Đảng viên:</strong> Cần hoàn thành thủ tục với Chi bộ và Đảng ủy trước khi nộp hồ sơ trên hệ thống</li>
                <li>Tất cả biểu mẫu đều có thể điền trực tiếp trên hệ thống mà không cần tải xuống</li>
              </ul>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TaiBieuMauPage;
