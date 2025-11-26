import { FileText, Download, ExternalLink, Calendar } from 'lucide-react';
import './DocumentsSection.css';

const DocumentsSection = () => {
  const documents = [
    {
      id: 1,
      title: 'Đơn xin đi nước ngoài (Mẫu 01)',
      description: 'Biểu mẫu đơn xin phép đi nước ngoài dành cho viên chức',
      type: 'PDF',
      size: '250 KB',
      updated: '15/11/2025',
      downloadLink: '/files/don-xin-di-nuoc-ngoai.pdf'
    },
    {
      id: 2,
      title: 'Bản cam kết Đảng viên (Mẫu 02)',
      description: 'Cam kết của đảng viên khi đi nước ngoài',
      type: 'DOCX',
      size: '180 KB',
      updated: '10/11/2025',
      downloadLink: '/files/cam-ket-dang-vien.docx'
    },
    {
      id: 3,
      title: 'Giấy xác nhận đơn vị (Mẫu 03)',
      description: 'Xác nhận của trưởng đơn vị',
      type: 'PDF',
      size: '200 KB',
      updated: '05/11/2025',
      downloadLink: '/files/xac-nhan-don-vi.pdf'
    },
    {
      id: 4,
      title: 'Kế hoạch công tác/học tập (Mẫu 04)',
      description: 'Kế hoạch chi tiết tại nước ngoài',
      type: 'DOCX',
      size: '220 KB',
      updated: '01/11/2025',
      downloadLink: '/files/ke-hoach-cong-tac.docx'
    }
  ];

  const regulations = [
    {
      id: 1,
      title: 'Quy định về viên chức đi nước ngoài',
      description: 'Quy chế của Bộ Nội vụ số 06/2010/QĐ-BNV',
      link: '#',
      date: '20/10/2025'
    },
    {
      id: 2,
      title: 'Hướng dẫn của Đảng ủy trường',
      description: 'Hướng dẫn số 15/HD-ĐU về quản lý đảng viên đi nước ngoài',
      link: '#',
      date: '15/10/2025'
    },
    {
      id: 3,
      title: 'Quy chế quản lý viên chức TVU',
      description: 'Quyết định số 234/QĐ-ĐHTV',
      link: '#',
      date: '01/10/2025'
    },
    {
      id: 4,
      title: 'Thông báo mới nhất',
      description: 'Thông báo về quy trình phê duyệt hồ sơ trực tuyến',
      link: '#',
      date: '22/11/2025',
      isNew: true
    }
  ];

  return (
    <section className="documents-section">
      <div className="container">
        {/* Documents Download */}
        <div className="documents-block">
          <div className="block-header">
            <div className="header-content">
              <Download className="header-icon" size={32} />
              <div>
                <h2 className="block-title">Tải biểu mẫu</h2>
                <p className="block-subtitle">Các biểu mẫu cần thiết cho hồ sơ</p>
              </div>
            </div>
          </div>

          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="doc-icon">
                  <FileText size={32} />
                  <span className="doc-type">{doc.type}</span>
                </div>
                
                <div className="doc-content">
                  <h3 className="doc-title">{doc.title}</h3>
                  <p className="doc-description">{doc.description}</p>
                  
                  <div className="doc-meta">
                    <span className="doc-size">📦 {doc.size}</span>
                    <span className="doc-updated">
                      <Calendar size={14} />
                      {doc.updated}
                    </span>
                  </div>
                </div>
                
                <a href={doc.downloadLink} className="doc-download-btn" download>
                  <Download size={18} />
                  Tải xuống
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="regulations-block">
          <div className="block-header">
            <div className="header-content">
              <FileText className="header-icon" size={32} />
              <div>
                <h2 className="block-title">Văn bản – Quy định</h2>
                <p className="block-subtitle">Các văn bản pháp lý và quy chế liên quan</p>
              </div>
            </div>
          </div>

          <div className="regulations-list">
            {regulations.map((reg) => (
              <div key={reg.id} className="regulation-item">
                {reg.isNew && <span className="new-badge">MỚI</span>}
                
                <div className="regulation-content">
                  <h3 className="regulation-title">{reg.title}</h3>
                  <p className="regulation-description">{reg.description}</p>
                  <span className="regulation-date">
                    <Calendar size={14} />
                    Cập nhật: {reg.date}
                  </span>
                </div>
                
                <a href={reg.link} className="regulation-link">
                  Xem chi tiết
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
