import Header from '../components/Header';
import Footer from '../components/Footer';
import './QuyTrinhThuTucPage.css';

const QuyTrinhThuTucPage = () => {
  return (
    <div className="page-root">
      <Header />
      <main className="page-main">
        <section className="qttt-hero">
          <div className="container">
            <h1>Quy trình – Thủ tục</h1>
            <p>
              Hướng dẫn đầy đủ quy trình xin phép đi nước ngoài dành cho viên chức
              Trường Đại học Trà Vinh theo quy định hiện hành
            </p>
          </div>
        </section>

        {/* Thông tin dịch vụ công */}
        <section className="qttt-service-info">
          <div className="container">
            <div className="service-card">
              <h2>📋 Thông tin dịch vụ công</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Tên thủ tục:</strong>
                  <span>Thông báo đi nước ngoài đối với viên chức</span>
                </div>
                <div className="info-item">
                  <strong>Lĩnh vực:</strong>
                  <span>Quản lý nhân sự</span>
                </div>
                <div className="info-item">
                  <strong>Cơ quan thực hiện:</strong>
                  <span>Trường Đại học Trà Vinh</span>
                </div>
                <div className="info-item">
                  <strong>Đối tượng thực hiện:</strong>
                  <span>Viên chức đang công tác tại Trường ĐH Trà Vinh</span>
                </div>
                <div className="info-item">
                  <strong>Loại hình:</strong>
                  <span>Việc công (hội nghị, đào tạo, công tác) và Việc riêng (du lịch, thăm thân)</span>
                </div>
                <div className="info-item">
                  <strong>Thời gian giải quyết:</strong>
                  <span>5-7 ngày làm việc (không kể ngày lễ, tết)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Điều kiện thực hiện */}
        <section className="qttt-conditions">
          <div className="container">
            <h2>Điều kiện thực hiện</h2>
            
            {/* Đối tượng được phép */}
            <div className="condition-section">
              <h3 className="condition-section-title">
                <span className="section-icon">👥</span>
                Đối tượng được phép thực hiện
              </h3>
              <div className="condition-list">
                <div className="condition-item">
                  <span className="item-icon">✓</span>
                  <span>Viên chức biên chế đang làm việc tại Trường ĐH Trà Vinh</span>
                </div>
                <div className="condition-item">
                  <span className="item-icon">✓</span>
                  <span>Cán bộ, giảng viên có hợp đồng lao động từ 12 tháng trở lên</span>
                </div>
                <div className="condition-item">
                  <span className="item-icon">✓</span>
                  <span>Đã hoàn thành hồ sơ cá nhân trên hệ thống</span>
                </div>
              </div>
            </div>

            {/* Thời gian nộp hồ sơ */}
            <div className="condition-section">
              <h3 className="condition-section-title">
                <span className="section-icon">⏱️</span>
                Thời gian nộp hồ sơ
              </h3>
              <div className="condition-list">
                <div className="condition-item">
                  <span className="item-label">Thông thường:</span>
                  <span>Nộp trước thời điểm xuất cảnh tối thiểu <strong>10-15 ngày làm việc</strong></span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Việc công đột xuất:</span>
                  <span>Tối thiểu <strong>5-7 ngày làm việc</strong></span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Việc riêng:</span>
                  <span>Nên thông báo trước <strong>7-10 ngày làm việc</strong></span>
                </div>
              </div>
            </div>

            {/* Hồ sơ yêu cầu */}
            <div className="condition-section">
              <h3 className="condition-section-title">
                <span className="section-icon">📋</span>
                Hồ sơ và tài liệu yêu cầu
              </h3>
              <div className="condition-list">
                <div className="condition-item">
                  <span className="item-label">Thông tin cá nhân:</span>
                  <span>Họ tên, đơn vị, chức danh, số điện thoại, email</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Loại hình:</span>
                  <span><strong>Việc công</strong> (hội nghị, đào tạo, công tác) hoặc <strong>Việc riêng</strong> (du lịch, thăm thân)</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Thông tin chuyến đi:</span>
                  <span>Quốc gia, thời gian đi/về dự kiến, mục đích chi tiết</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Tài liệu đính kèm:</span>
                  <span>Thư mời, chương trình hội nghị, visa, vé máy bay (nếu có)</span>
                </div>
              </div>
            </div>

            {/* Quy định với Đảng viên */}
            <div className="condition-section highlight">
              <h3 className="condition-section-title">
                <span className="section-icon">🏴</span>
                Quy định đặc biệt đối với Đảng viên
              </h3>
              <div className="condition-list">
                <div className="condition-item important">
                  <span className="item-icon">⚠️</span>
                  <span><strong>Viên chức là Đảng viên</strong> phải thông báo và xin phép Đảng ủy cơ sở trước khi đi nước ngoài</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Quy trình:</span>
                  <span>Chi bộ xét duyệt → Đảng ủy phê duyệt → Nộp hồ sơ trên hệ thống</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Tài liệu Đảng:</span>
                  <span>Upload giấy xác nhận/ý kiến của Đảng ủy kèm theo hồ sơ</span>
                </div>
                <div className="condition-item">
                  <span className="item-label">Chức vụ cao:</span>
                  <span>Trưởng/Phó đơn vị, chức danh nghề nghiệp cao cấp cần xin phép Đảng ủy cấp trên</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quy trình thực hiện */}
        <section className="qttt-process">
          <div className="container">
            <h2>Quy trình thực hiện</h2>
            <div className="process-timeline">
              {/* Bước 1: Tạo lập hồ sơ */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">1</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 1: Tạo lập hồ sơ</h3>
                  <p><strong>Người thực hiện:</strong> Viên chức</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Đăng nhập vào hệ thống bằng tài khoản TVU</li>
                    <li>Chọn menu "Tạo hồ sơ mới"</li>
                    <li>Khai báo thông tin:
                      <ul>
                        <li>Loại hình: <strong>Việc công</strong> hoặc <strong>Việc riêng</strong></li>
                        <li>Quốc gia, thời gian đi/về, mục đích chi tiết</li>
                        <li>Trạng thái Đảng viên (có/không)</li>
                      </ul>
                    </li>
                    <li>Upload tài liệu theo yêu cầu: thư mời, visa, vé máy bay...</li>
                    <li>Kiểm tra và gửi hồ sơ</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 15-20 phút</p>
                  <p><strong>Kết quả:</strong> Hồ sơ được tạo và chuyển sang bước kiểm tra tự động</p>
                </div>
              </div>

              {/* Bước 2: Kiểm tra điều kiện */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">2</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 2: Hệ thống kiểm tra điều kiện ban đầu</h3>
                  <p><strong>Người thực hiện:</strong> Hệ thống tự động</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Kiểm tra tính đầy đủ của dữ liệu nhập</li>
                    <li>Kiểm tra các điều kiện ràng buộc theo quy định</li>
                    <li>Xác thực thông tin viên chức</li>
                  </ul>
                  <p><strong>Thời gian:</strong> Tức thì (tự động)</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Đạt yêu cầu:</strong> Chuyển sang bước ký số<br/>
                    - <strong>Không đạt:</strong> Hồ sơ bị từ chối tự động, quy trình dừng
                  </p>
                </div>
              </div>

              {/* Bước 3: Ký số */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">3</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 3: Viên chức ký số đơn đề nghị</h3>
                  <p><strong>Người thực hiện:</strong> Viên chức</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Xem lại toàn bộ thông tin hồ sơ</li>
                    <li>Thực hiện ký số bằng chữ ký điện tử</li>
                    <li>Xác nhận gửi hồ sơ vào quy trình xử lý</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 2-5 phút</p>
                  <p><strong>Kết quả:</strong> Hồ sơ chính thức được gửi vào quy trình phê duyệt. Hệ thống xác định tuyến xử lý dựa trên trạng thái Đảng viên.</p>
                </div>
              </div>

              {/* Bước 4: Phân luồng */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">4</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 4: Xác định tuyến phê duyệt</h3>
                  <p><strong>Người thực hiện:</strong> Hệ thống tự động</p>
                  <p><strong>Thao tác:</strong> Kiểm tra trạng thái Đảng viên và định tuyến hồ sơ</p>
                  <p><strong>Kết quả:</strong></p>
                  <ul>
                    <li><strong>Là Đảng viên:</strong> Hồ sơ → Chi bộ → Đảng ủy → Đơn vị quản lý</li>
                    <li><strong>Không phải Đảng viên:</strong> Hồ sơ → Đơn vị quản lý (bỏ qua cấp Đảng)</li>
                  </ul>
                </div>
              </div>

              {/* Bước 5a: Chi bộ */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">5a</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 5a: Xử lý tại Chi bộ (Chỉ với Đảng viên)</h3>
                  <p><strong>Người thực hiện:</strong> Chi bộ</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Xem xét hồ sơ theo quy định của Đảng</li>
                    <li>Các cấp có thẩm quyền trong Chi bộ ký số ý kiến</li>
                    <li>Đưa ra kết luận</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 2-3 ngày làm việc</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Đồng ý:</strong> Chuyển lên Đảng ủy<br/>
                    - <strong>Không đồng ý:</strong> Chi bộ từ chối, quy trình kết thúc
                  </p>
                </div>
              </div>

              {/* Bước 5b: Đảng ủy */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">5b</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 5b: Xử lý tại Đảng ủy (Chỉ với Đảng viên)</h3>
                  <p><strong>Người thực hiện:</strong> Đảng ủy</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Kiểm tra, đánh giá theo quy định của Đảng về quản lý đảng viên ra nước ngoài</li>
                    <li>Xem xét ý kiến từ Chi bộ</li>
                    <li>Đảng ủy ký số phê duyệt</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 2-3 ngày làm việc</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Phê duyệt:</strong> Hồ sơ chuyển đến Đơn vị quản lý<br/>
                    - <strong>Không phê duyệt:</strong> Quy trình kết thúc
                  </p>
                  <p><em>Lưu ý: Sau khi Đảng ủy phê duyệt, hồ sơ mới được chuyển sang đơn vị quản lý chuyên môn.</em></p>
                </div>
              </div>

              {/* Bước 6: Đơn vị */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">6</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 6: Xử lý tại Đơn vị quản lý</h3>
                  <p><strong>Người thực hiện:</strong> Trưởng/Phó đơn vị</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Kiểm tra tính cần thiết, mục đích chuyến đi</li>
                    <li>Đánh giá sự phù hợp trong kế hoạch công tác của đơn vị</li>
                    <li>Kiểm tra nghiệp vụ nội bộ và văn bản kèm theo</li>
                    <li>Thực hiện ký số xác nhận của đơn vị</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 2-3 ngày làm việc</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Đồng ý:</strong> Hồ sơ chuyển sang Phòng TCHC<br/>
                    - <strong>Không đồng ý:</strong> Hồ sơ bị từ chối, quy trình kết thúc
                  </p>
                </div>
              </div>

              {/* Bước 7: TCNS */}
              <div className="timeline-step">
                <div className="step-marker">
                  <div className="marker-number">7</div>
                </div>
                <div className="step-content">
                  <h3>Bước 7: Xử lý tại Phòng TCNS</h3>
                  <p><strong>Người thực hiện:</strong> Cán bộ Phòng TCNS</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Kiểm tra tính pháp lý, quy chế và yêu cầu quản lý viên chức</li>
                    <li>Kiểm tra tính đầy đủ – hợp lệ của hồ sơ và tờ trình</li>
                    <li>Thực hiện ký số tờ trình trước khi gửi lên Ban Giám hiệu</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 2-3 ngày làm việc</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Hồ sơ hợp lệ:</strong> Chuyển lên Ban Giám hiệu<br/>
                    - <strong>Hồ sơ chưa hợp lệ:</strong> Gửi yêu cầu bổ sung → Viên chức cập nhật → TCHC kiểm tra lại
                  </p>
                </div>
              </div>

              {/* Bước 8: BGH */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">8</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 8: Phê duyệt của Ban Giám hiệu</h3>
                  <p><strong>Người thực hiện:</strong> Hiệu trưởng hoặc Phó Hiệu trưởng được ủy quyền</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Xem xét toàn bộ hồ sơ và tờ trình từ Phòng TCHC</li>
                    <li>Cân nhắc lý do, tính cần thiết, thời điểm của chuyến đi</li>
                    <li>Thực hiện ký số phê duyệt và đưa ra quyết định</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 1-2 ngày làm việc</p>
                  <p><strong>Kết quả:</strong>
                    - <strong>Đồng ý:</strong> Hệ thống sinh Quyết định (file PDF) và gửi email thông báo<br/>
                    - <strong>Không đồng ý:</strong> Hồ sơ bị từ chối, quy trình dừng
                  </p>
                </div>
              </div>

              {/* Bước 9: Nhận kết quả */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">9</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 9: Nhận kết quả và thực hiện chuyến đi</h3>
                  <p><strong>Người thực hiện:</strong> Viên chức</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Nhận thông báo kết quả qua email và hệ thống</li>
                    <li>Đăng nhập để tải Quyết định phê duyệt (file PDF)</li>
                    <li>Thực hiện chuyến đi theo đúng thông tin đã đăng ký</li>
                  </ul>
                  <p><strong>Thời gian:</strong> Ngay sau khi BGH phê duyệt</p>
                  <p><strong>Kết quả:</strong> Viên chức có Quyết định chính thức để thực hiện chuyến đi</p>
                </div>
              </div>

              {/* Bước 10: Báo cáo sau chuyến đi */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">10</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 10: Báo cáo sau chuyến đi</h3>
                  <p><strong>Người thực hiện:</strong> Viên chức</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Sau khi kết thúc chuyến đi, đăng nhập hệ thống</li>
                    <li>Nộp báo cáo sau chuyến công tác (trong vòng 7 ngày)</li>
                    <li><strong>Nếu là Đảng viên:</strong> Báo cáo được chuyển đến Chi bộ để xem xét, đánh giá, ghi nhận kết quả thực hiện nhiệm vụ</li>
                  </ul>
                  <p><strong>Thời gian:</strong> Trong vòng 7 ngày sau khi về</p>
                  <p><strong>Kết quả:</strong> Báo cáo được ghi nhận và chuyển sang bước hoàn tất</p>
                </div>
              </div>

              {/* Bước 11: Hoàn tất */}
              <div className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-number">11</div>
                </div>
                <div className="timeline-content">
                  <h3>Bước 11: Hoàn tất hồ sơ</h3>
                  <p><strong>Người thực hiện:</strong> Phòng TCHC</p>
                  <p><strong>Thao tác:</strong></p>
                  <ul>
                    <li>Kiểm tra lại báo cáo sau chuyến đi</li>
                    <li>Xác nhận đầy đủ và đúng quy định</li>
                    <li>Thực hiện ký số hoàn tất</li>
                    <li>Lưu trữ hồ sơ trên hệ thống theo quy trình quản lý</li>
                  </ul>
                  <p><strong>Thời gian:</strong> 1-2 ngày làm việc</p>
                  <p><strong>Kết quả:</strong> Hồ sơ được lưu trữ điện tử, quy trình kết thúc</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trường hợp đặc biệt */}
        <section className="qttt-special-cases">
          <div className="container">
            <h2>Các trường hợp đặc biệt</h2>
            <div className="cases-grid">
              <div className="case-card warning">
                <div className="case-icon">⚠️</div>
                <h3>Yêu cầu bổ sung hồ sơ</h3>
                <p>
                  Nếu hồ sơ thiếu thông tin hoặc giấy tờ không hợp lệ, người duyệt sẽ yêu cầu bổ sung.
                  Viên chức cần cập nhật thông tin và gửi lại trong vòng 2-3 ngày làm việc.
                </p>
              </div>
              <div className="case-card danger">
                <div className="case-icon">❌</div>
                <h3>Hồ sơ bị từ chối</h3>
                <p>
                  Hồ sơ có thể bị từ chối nếu: không đủ điều kiện, mục đích không rõ ràng,
                  thời gian không phù hợp, hoặc vi phạm quy định. Viên chức có thể nộp lại
                  hồ sơ mới sau khi khắc phục.
                </p>
              </div>
              <div className="case-card info">
                <div className="case-icon">⚡</div>
                <h3>Trường hợp khẩn cấp</h3>
                <p>
                  Đối với công tác đột xuất hoặc cần gấp, viên chức liên hệ trực tiếp
                  Phòng TCHC (0294.3855.246) để được hỗ trợ xử lý nhanh hồ sơ.
                  Thời gian xử lý có thể rút ngắn còn 3-5 ngày làm việc.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lưu ý quan trọng */}
        <section className="qttt-notes">
          <div className="container">
            <div className="notes-box">
              <h2>📌 Lưu ý quan trọng</h2>
              <ul className="notes-list">
                <li>
                  <strong>Nộp hồ sơ sớm:</strong> Nên nộp hồ sơ trước thời điểm dự kiến xuất cảnh ít nhất 10-15 ngày
                  để đảm bảo đủ thời gian xử lý qua các cấp.
                </li>
                <li>
                  <strong>Phân biệt loại hình:</strong> Chọn đúng loại hình (việc công/việc riêng) khi tạo hồ sơ.
                  Việc công cần có giấy tờ chứng minh (thư mời, lịch trình...), việc riêng chỉ cần thông báo.
                </li>
                <li>
                  <strong>Theo dõi tiến độ:</strong> Có thể đăng nhập hệ thống bất cứ lúc nào để theo dõi
                  tình trạng hồ sơ và xem ý kiến của người duyệt.
                </li>
                <li>
                  <strong>Thông tin chính xác:</strong> Khai báo đầy đủ, chính xác thông tin về quốc gia,
                  thời gian, mục đích. Khai báo sai có thể dẫn đến hồ sơ bị từ chối.
                </li>
                <li>
                  <strong>Báo cáo sau chuyến đi:</strong> Chỉ áp dụng cho việc công (hội nghị, đào tạo, công tác).
                  Cần cập nhật báo cáo kết quả trong vòng 7 ngày sau khi về nước.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Câu hỏi thường gặp */}
        <section className="qttt-faq">
          <div className="container">
            <h2>Câu hỏi thường gặp</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>❓ Tôi có thể nộp hồ sơ qua giấy không?</h3>
                <p>
                  Không. Theo chính sách chuyển đổi số của nhà trường, tất cả hồ sơ xin phép đi nước ngoài
                  đều phải được nộp trực tuyến qua hệ thống này.
                </p>
              </div>
              <div className="faq-item">
                <h3>❓ Tôi quên mật khẩu đăng nhập thì làm sao?</h3>
                <p>
                  Bạn có thể sử dụng chức năng "Quên mật khẩu" trên trang đăng nhập, hoặc liên hệ
                  Phòng TCHC để được hỗ trợ reset mật khẩu.
                </p>
              </div>
              <div className="faq-item">
                <h3>❓ Hồ sơ của tôi bị từ chối, tôi có thể khiếu nại không?</h3>
                <p>
                  Có. Bạn có thể liên hệ trực tiếp với Phòng TCHC để được giải thích lý do từ chối
                  và hướng dẫn khắc phục. Sau khi khắc phục, bạn có thể nộp lại hồ sơ mới.
                </p>
              </div>
              <div className="faq-item">
                <h3>❓ Tôi có thể hủy hồ sơ đã nộp không?</h3>
                <p>
                  Có. Trong trường hợp hủy chuyến đi, bạn có thể đăng nhập hệ thống và hủy hồ sơ
                  khi hồ sơ đang ở trạng thái "Chờ duyệt". Sau khi đã được phê duyệt, cần liên hệ
                  Phòng TCHC để xử lý.
                </p>
              </div>
              <div className="faq-item">
                <h3>❓ Tôi đi du lịch hoặc thăm thân có cần thông báo không?</h3>
                <p>
                  Có. Theo quy định, viên chức đi nước ngoài vì bất kỳ lý do gì (việc công hay việc riêng)
                  đều cần thông báo với nhà trường qua hệ thống. Khi tạo hồ sơ, chọn loại hình "Việc riêng"
                  và mục đích "Du lịch" hoặc "Thăm thân".
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuyTrinhThuTucPage;
