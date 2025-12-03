import Header from '../components/Header';
import Footer from '../components/Footer';
import './HuongDanPage.css';

const HuongDanPage = () => {
  return (
    <div className="page-root">
      <Header />
      <main className="page-main">
        {/* Hero Section */}
        <section className="hd-hero">
          <div className="container">
            <h1>Hướng dẫn sử dụng</h1>
            <p>
              Tài liệu hướng dẫn chi tiết giúp bạn sử dụng hệ thống một cách dễ dàng và hiệu quả
            </p>
          </div>
        </section>

        {/* Main Guide Sections */}
        <section className="hd-main-guide">
          <div className="container">
            
            {/* Dành cho Viên chức */}
            <div className="guide-section">
              <div className="section-header">
                <span className="section-icon">👤</span>
                <h2>Dành cho Viên chức</h2>
              </div>
              
              <div className="guide-cards">
                <div className="guide-card">
                  <div className="card-icon">🔐</div>
                  <h3>Đăng nhập</h3>
                  <ul>
                    <li>Nhấn nút <strong>"Đăng nhập"</strong> trên thanh menu</li>
                    <li>Chọn đăng nhập bằng <strong>TVU SSO</strong> hoặc tài khoản hệ thống</li>
                    <li>Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang làm việc</li>
                  </ul>
                </div>

                <div className="guide-card">
                  <div className="card-icon">📝</div>
                  <h3>Tạo hồ sơ mới</h3>
                  <ul>
                    <li>Truy cập menu <strong>"Tạo hồ sơ"</strong></li>
                    <li>Chọn loại hình: <strong>Việc công</strong> hoặc <strong>Việc riêng</strong></li>
                    <li>Khai báo <strong>trạng thái Đảng viên</strong> (nếu có)</li>
                    <li>Điền đầy đủ thông tin: quốc gia, thời gian, mục đích</li>
                    <li>Upload tài liệu đính kèm: thư mời, visa, vé máy bay...</li>
                    <li>Nếu là Đảng viên: upload giấy xác nhận từ Chi bộ/Đảng ủy</li>
                    <li>Kiểm tra lại và nhấn <strong>"Gửi hồ sơ"</strong></li>
                  </ul>
                </div>

                <div className="guide-card">
                  <div className="card-icon">📊</div>
                  <h3>Theo dõi hồ sơ</h3>
                  <ul>
                    <li>Vào <strong>"Danh sách hồ sơ"</strong> để xem tất cả hồ sơ đã tạo</li>
                    <li>Trạng thái hồ sơ:
                      <ul>
                        <li><span className="status-draft">Nháp</span> - Chưa gửi</li>
                        <li><span className="status-pending">Đang duyệt</span> - Đang chờ xét duyệt</li>
                        <li><span className="status-approved">Đã duyệt</span> - Được phê duyệt</li>
                        <li><span className="status-rejected">Từ chối</span> - Bị từ chối</li>
                        <li><span className="status-supplement">Bổ sung</span> - Cần bổ sung thông tin</li>
                      </ul>
                    </li>
                    <li>Nhấn vào hồ sơ để xem chi tiết và lịch sử phê duyệt</li>
                    <li>Nhận thông báo qua email khi có cập nhật</li>
                  </ul>
                </div>

                <div className="guide-card">
                  <div className="card-icon">📄</div>
                  <h3>Tải biểu mẫu & In quyết định</h3>
                  <ul>
                    <li>Truy cập <strong>"Tải biểu mẫu"</strong> để tải các mẫu đơn cần thiết</li>
                    <li>Sau khi hồ sơ được duyệt, vào chi tiết hồ sơ</li>
                    <li>Nhấn <strong>"Tải quyết định"</strong> để tải file PDF chính thức</li>
                    <li>Mang quyết định in ra để làm thủ tục xuất cảnh</li>
                  </ul>
                </div>

                <div className="guide-card">
                  <div className="card-icon">✏️</div>
                  <h3>Bổ sung thông tin</h3>
                  <ul>
                    <li>Khi hồ sơ ở trạng thái <strong>"Yêu cầu bổ sung"</strong></li>
                    <li>Xem ghi chú của người duyệt để biết cần bổ sung gì</li>
                    <li>Nhấn <strong>"Chỉnh sửa"</strong> để cập nhật thông tin</li>
                    <li>Upload thêm tài liệu nếu cần</li>
                    <li>Gửi lại hồ sơ sau khi hoàn tất</li>
                  </ul>
                </div>

                <div className="guide-card">
                  <div className="card-icon">📋</div>
                  <h3>Báo cáo sau chuyến đi</h3>
                  <ul>
                    <li>Sau khi hoàn thành chuyến đi, đăng nhập hệ thống</li>
                    <li>Vào hồ sơ tương ứng, chọn <strong>"Nộp báo cáo"</strong></li>
                    <li>Điền thông tin kết quả thực hiện nhiệm vụ</li>
                    <li>Upload tài liệu chứng minh (nếu có)</li>
                    <li><strong>Lưu ý:</strong> Đảng viên cần chờ Chi bộ xác nhận báo cáo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dành cho Người duyệt */}
            <div className="guide-section">
              <div className="section-header">
                <span className="section-icon">✅</span>
                <h2>Dành cho Người duyệt</h2>
              </div>
              
              {/* Workflow Flow */}
              <div className="approver-workflow">
                <h3>Quy trình xử lý hồ sơ</h3>
                <div className="workflow-steps">
                  <div className="workflow-step">
                    <div className="step-badge">1</div>
                    <div className="step-info">
                      <strong>Nhận hồ sơ</strong>
                      <span>Dashboard hiển thị hồ sơ chờ duyệt + Email thông báo</span>
                    </div>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <div className="step-badge">2</div>
                    <div className="step-info">
                      <strong>Xem chi tiết</strong>
                      <span>Kiểm tra thông tin, tài liệu, lịch sử duyệt</span>
                    </div>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <div className="step-badge">3</div>
                    <div className="step-info">
                      <strong>Quyết định</strong>
                      <span>Phê duyệt / Từ chối / Yêu cầu bổ sung</span>
                    </div>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <div className="step-badge">4</div>
                    <div className="step-info">
                      <strong>Hoàn tất</strong>
                      <span>Hồ sơ chuyển tiếp hoặc thông báo viên chức</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Details */}
              <div className="approver-actions">
                <h3>Chi tiết các thao tác</h3>
                
                <div className="action-section">
                  <div className="action-header">
                    <span className="action-icon">📥</span>
                    <h4>1. Nhận và phân luồng hồ sơ</h4>
                  </div>
                  <div className="action-content">
                    <div className="flow-paths">
                      <div className="flow-path highlight-party">
                        <strong>🟡 Đảng viên:</strong>
                        <div className="flow-chain">
                          <span>Chi bộ</span> → <span>Đảng ủy</span> → <span>Đơn vị</span> → <span>TCNS</span> → <span>BGH</span>
                        </div>
                      </div>
                      <div className="flow-path">
                        <strong>⚪ Không Đảng viên:</strong>
                        <div className="flow-chain">
                          <span>Đơn vị</span> → <span>TCNS</span> → <span>BGH</span>
                        </div>
                      </div>
                    </div>
                    <p className="flow-note">💡 Hệ thống tự động phân luồng dựa trên thông tin viên chức</p>
                  </div>
                </div>

                <div className="action-section">
                  <div className="action-header">
                    <span className="action-icon">🔍</span>
                    <h4>2. Kiểm tra hồ sơ</h4>
                  </div>
                  <div className="action-content">
                    <div className="checklist-grid">
                      <div className="check-item">
                        <span className="check-icon">✓</span>
                        <strong>Thông tin cơ bản:</strong> Tên, đơn vị, chức vụ, Đảng viên
                      </div>
                      <div className="check-item">
                        <span className="check-icon">✓</span>
                        <strong>Chi tiết chuyến đi:</strong> Quốc gia, mục đích, thời gian, kinh phí
                      </div>
                      <div className="check-item">
                        <span className="check-icon">✓</span>
                        <strong>Tài liệu đính kèm:</strong> Thư mời, giấy tờ Đảng (nếu có)
                      </div>
                      <div className="check-item">
                        <span className="check-icon">✓</span>
                        <strong>Lịch sử duyệt:</strong> Ý kiến các cấp trước (nếu có)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-section">
                  <div className="action-header">
                    <span className="action-icon">✍️</span>
                    <h4>3. Đưa ra quyết định</h4>
                  </div>
                  <div className="action-content">
                    <div className="decision-options">
                      <div className="decision-card approved">
                        <div className="decision-icon">✅</div>
                        <strong>Phê duyệt</strong>
                        <p>Đồng ý cho đi. Hồ sơ chuyển lên cấp tiếp theo hoặc hoàn tất nếu là cấp cuối.</p>
                        <span className="decision-action">Có thể thêm ý kiến</span>
                      </div>
                      <div className="decision-card rejected">
                        <div className="decision-icon">❌</div>
                        <strong>Từ chối</strong>
                        <p>Không đồng ý. Hồ sơ kết thúc, viên chức nhận thông báo.</p>
                        <span className="decision-action required">Bắt buộc ghi rõ lý do</span>
                      </div>
                      <div className="decision-card supplement">
                        <div className="decision-icon">📝</div>
                        <strong>Yêu cầu bổ sung</strong>
                        <p>Cần thêm thông tin hoặc tài liệu. Hồ sơ trả về viên chục để chỉnh sửa.</p>
                        <span className="decision-action required">Bắt buộc nêu rõ nội dung cần bổ sung</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-section">
                  <div className="action-header">
                    <span className="action-icon">📊</span>
                    <h4>4. Quản lý & Theo dõi</h4>
                  </div>
                  <div className="action-content">
                    <div className="management-features">
                      <div className="feature-item">
                        <span className="feature-icon">📈</span>
                        <div>
                          <strong>Thống kê Dashboard</strong>
                          <p>Tổng quan số lượng hồ sơ: Chờ duyệt, Đã duyệt, Từ chối, Yêu cầu bổ sung</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">🔎</span>
                        <div>
                          <strong>Tìm kiếm & Lọc</strong>
                          <p>Lọc theo trạng thái, thời gian, loại hình. Tìm theo tên viên chức, mã hồ sơ</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">📄</span>
                        <div>
                          <strong>Xuất báo cáo</strong>
                          <p>Báo cáo thống kê theo kỳ (tuần, tháng, quý) để báo cáo cấp trên</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lưu ý chung */}
            <div className="guide-section highlight">
              <div className="section-header">
                <span className="section-icon">⚠️</span>
                <h2>Lưu ý quan trọng</h2>
              </div>
              
              <div className="note-cards-2col">
                <div className="note-card">
                  <h3>⏱️ Thời gian xử lý</h3>
                  <ul>
                    <li>Thời gian xử lý chuẩn: <strong>5-7 ngày làm việc</strong></li>
                    <li>Nên nộp hồ sơ trước ngày xuất cảnh <strong>10-15 ngày</strong></li>
                    <li>Việc công đột xuất: tối thiểu <strong>5-7 ngày</strong></li>
                    <li>Đảng viên cần tính thêm thời gian xử lý tại Chi bộ và Đảng ủy</li>
                  </ul>
                </div>

                <div className="note-card">
                  <h3>🏴 Quy định với Đảng viên</h3>
                  <ul>
                    <li>Phải xin phép Chi bộ và Đảng ủy <strong>TRƯỚC</strong> khi nộp hồ sơ</li>
                    <li>Upload giấy xác nhận của Đảng ủy khi tạo hồ sơ</li>
                    <li>Sau chuyến đi, phải báo cáo với Chi bộ</li>
                    <li>Chức vụ cao cần xin phép Đảng ủy cấp trên</li>
                  </ul>
                </div>

                <div className="note-card">
                  <h3>📱 Thông báo & Liên hệ</h3>
                  <ul>
                    <li>Bật thông báo email để nhận cập nhật nhanh nhất</li>
                    <li>Kiểm tra hộp thư spam nếu không thấy email</li>
                    <li>Hotline hỗ trợ: <strong>0294.3855.246</strong></li>
                    <li>Email: <strong>tcns@tvu.edu.vn</strong></li>
                  </ul>
                </div>

                <div className="note-card">
                  <h3>🔒 Bảo mật thông tin</h3>
                  <ul>
                    <li>Không chia sẻ mật khẩu với người khác</li>
                    <li>Đăng xuất sau khi sử dụng xong</li>
                    <li>Thông tin cá nhân được bảo mật theo quy định</li>
                    <li>Liên hệ Admin nếu quên mật khẩu</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="guide-section">
              <div className="section-header">
                <span className="section-icon">❓</span>
                <h2>Câu hỏi thường gặp</h2>
              </div>
              
              <div className="faq-list">
                <div className="faq-item">
                  <h3>Tôi có thể tạo bao nhiêu hồ sơ?</h3>
                  <p>Không giới hạn số lượng hồ sơ. Bạn có thể tạo nhiều hồ sơ cho các chuyến đi khác nhau.</p>
                </div>

                <div className="faq-item">
                  <h3>Nếu hồ sơ bị từ chối, tôi có thể nộp lại không?</h3>
                  <p>Có. Bạn có thể tạo hồ sơ mới hoặc chỉnh sửa hồ sơ cũ (nếu còn ở trạng thái nháp) và gửi lại.</p>
                </div>

                <div className="faq-item">
                  <h3>Tôi có thể hủy hồ sơ đã gửi không?</h3>
                  <p>Hồ sơ đã gửi không thể hủy. Vui lòng liên hệ Phòng TCNS nếu cần hỗ trợ đặc biệt.</p>
                </div>

                <div className="faq-item">
                  <h3>Khi nào tôi nhận được quyết định chính thức?</h3>
                  <p>Sau khi Ban Giám hiệu phê duyệt, bạn sẽ nhận email thông báo và có thể tải quyết định PDF trên hệ thống ngay lập tức.</p>
                </div>

                <div className="faq-item">
                  <h3>Tôi không phải Đảng viên có cần làm gì đặc biệt không?</h3>
                  <p>Không. Bạn chỉ cần tạo hồ sơ và chọn "Không" ở mục Đảng viên. Hồ sơ sẽ được chuyển thẳng đến Đơn vị quản lý.</p>
                </div>

                <div className="faq-item">
                  <h3>Tôi quên mật khẩu, làm sao để lấy lại?</h3>
                  <p>Nhấn "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký. Hệ thống sẽ gửi link đặt lại mật khẩu.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Support Section */}
        <section className="hd-support">
          <div className="container">
            <div className="support-box">
              <h2>💬 Cần hỗ trợ thêm?</h2>
              <p>Nếu bạn gặp khó khăn hoặc có thắc mắc, đừng ngại liên hệ với chúng tôi:</p>
              <div className="support-contacts">
                <div className="contact-item">
                  <strong>📞 Hotline:</strong>
                  <span>0294.3855.246</span>
                </div>
                <div className="contact-item">
                  <strong>✉️ Email:</strong>
                  <span>tcns@tvu.edu.vn</span>
                </div>
                <div className="contact-item">
                  <strong>🏢 Địa chỉ:</strong>
                  <span>Phòng Tổ chức Nhân sự, Trường ĐH Trà Vinh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default HuongDanPage;
