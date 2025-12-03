-- ================================================
-- SEED DATA: QLHS Đi Nước Ngoài
-- Trường Đại học Trà Vinh
-- Encoding: UTF-8
-- Version: 1.0 - November 30, 2025
-- Description: Sample data for development and testing
-- ================================================

SET client_encoding = 'UTF8';

-- ================================================
-- DỮ LIỆU MẪU: LOẠI CHUYẾN ĐI
-- ================================================

INSERT INTO loai_chuyen_di (ten_loai, mo_ta) VALUES
('Công tác nước ngoài', 'Đi nước ngoài theo nhiệm vụ công tác'),
('Đào tạo', 'Chuyến đi đào tạo, học tập, nghiên cứu'),
('Hội nghị, hội thảo', 'Tham dự hội nghị, hội thảo quốc tế'),
('Nghiên cứu khoa học', 'Thực hiện nghiên cứu khoa học tại nước ngoài'),
('Trao đổi học thuật', 'Trao đổi kinh nghiệm, học thuật với các trường đối tác'),
('Thực tập', 'Thực tập nghề nghiệp tại nước ngoài');

-- ================================================
-- DỮ LIỆU MẪU: NGUỒN KINH PHÍ
-- ================================================

INSERT INTO nguon_kinh_phi (ten_nguon, mo_ta) VALUES
('Ngân sách nhà nước', 'Kinh phí từ ngân sách nhà nước'),
('Quỹ đào tạo', 'Nguồn quỹ phục vụ đào tạo, bồi dưỡng'),
('Tài trợ nước ngoài', 'Kinh phí từ các tổ chức, quỹ nước ngoài'),
('Kinh phí đơn vị', 'Kinh phí từ đơn vị, phòng ban'),
('Tự túc', 'Chi phí cá nhân tự túc'),
('Hợp tác quốc tế', 'Từ các chương trình hợp tác quốc tế');

-- ================================================
-- DỮ LIỆU MẪU: ROLES (PHÂN QUYỀN)
-- ================================================

INSERT INTO roles (code, name, description, level) VALUES
('VIEN_CHUC', 'Viên chức', 'Người tạo và nộp hồ sơ', 0),
('TRUONG_KHOA', 'Trưởng khoa', 'Người duyệt cấp khoa/bộ môn', 1),
('BGH', 'Ban giám hiệu', 'Người duyệt cấp BGH', 2),
('TCHC', 'Phòng Tổ chức hành chính', 'Quản lý hồ sơ hành chính', 2),
('ADMIN', 'Quản trị viên', 'Quản trị hệ thống toàn bộ', 3);

-- ================================================
-- DỮ LIỆU MẪU: VIÊN CHỨC
-- ================================================

INSERT INTO vien_chuc (ho_ten, ngay_sinh, so_cccd, email, is_dang_vien) VALUES
('Nguyễn Văn An', '1985-05-15', '079085012345', 'nguyenvana@tvu.edu.vn', true),
('Trần Thị Bích', '1990-08-22', '079090023456', 'tranthib@tvu.edu.vn', false),
('Lê Văn Cường', '1988-03-10', '079088034567', 'levanc@tvu.edu.vn', true),
('Phạm Thị Duyên', '1992-11-30', '079092045678', 'phamthid@tvu.edu.vn', false),
('Hoàng Văn Em', '1987-07-18', '079087056789', 'hoangvane@tvu.edu.vn', true);

-- ================================================
-- DỮ LIỆU MẪU: NGƯỜI DUYỆT
-- ================================================

INSERT INTO nguoi_duyet (ho_ten, vai_tro, chuc_danh) VALUES
('PGS.TS. Nguyễn Văn Trưởng', 'TruongKhoa', 'Trưởng Khoa CNTT'),
('TS. Trần Thị Phó', 'TruongKhoa', 'Trưởng Khoa Ngoại Ngữ'),
('PGS.TS. Lê Văn Hiệu', 'BGH', 'Hiệu trưởng'),
('TS. Phạm Thị Phó Hiệu', 'BGH', 'Phó Hiệu trưởng');

-- ================================================
-- DỮ LIỆU MẪU: NGƯỜI DÙNG (SSO ACCOUNTS)
-- ================================================

-- Note: Trong môi trường thực tế, dữ liệu này sẽ được đồng bộ từ SSO
-- Đây là dữ liệu mẫu cho môi trường development

DO $$
DECLARE
    v_vien_chuc_1 UUID;
    v_vien_chuc_2 UUID;
    v_vien_chuc_3 UUID;
    v_nguoi_duyet_1 UUID;
    v_nguoi_duyet_2 UUID;
    v_role_vien_chuc UUID;
    v_role_truong_khoa UUID;
    v_role_admin UUID;
    v_user_1 UUID;
    v_user_2 UUID;
    v_user_duyet_1 UUID;
BEGIN
    -- Lấy UUID của viên chức
    SELECT ma_vien_chuc INTO v_vien_chuc_1 FROM vien_chuc WHERE email = 'nguyenvana@tvu.edu.vn';
    SELECT ma_vien_chuc INTO v_vien_chuc_2 FROM vien_chuc WHERE email = 'tranthib@tvu.edu.vn';
    SELECT ma_vien_chuc INTO v_vien_chuc_3 FROM vien_chuc WHERE email = 'levanc@tvu.edu.vn';
    
    -- Lấy UUID của người duyệt
    SELECT ma_nguoi_duyet INTO v_nguoi_duyet_1 FROM nguoi_duyet WHERE vai_tro = 'TruongKhoa' LIMIT 1;
    SELECT ma_nguoi_duyet INTO v_nguoi_duyet_2 FROM nguoi_duyet WHERE vai_tro = 'BGH' LIMIT 1;
    
    -- Lấy role IDs
    SELECT role_id INTO v_role_vien_chuc FROM roles WHERE code = 'VIEN_CHUC';
    SELECT role_id INTO v_role_truong_khoa FROM roles WHERE code = 'TRUONG_KHOA';
    SELECT role_id INTO v_role_admin FROM roles WHERE code = 'ADMIN';
    
    -- Tạo user cho viên chức
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc, is_active)
    VALUES 
        ('nguyenvana@tvu.edu.vn', 'Nguyễn Văn An', 'VienChuc', v_vien_chuc_1, true),
        ('tranthib@tvu.edu.vn', 'Trần Thị Bích', 'VienChuc', v_vien_chuc_2, true),
        ('levanc@tvu.edu.vn', 'Lê Văn Cường', 'VienChuc', v_vien_chuc_3, true)
    RETURNING user_id INTO v_user_1;
    
    -- Tạo user cho người duyệt
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet, is_active)
    VALUES 
        ('truongkhoa@tvu.edu.vn', 'PGS.TS. Nguyễn Văn Trưởng', 'NguoiDuyet', v_nguoi_duyet_1, true),
        ('bgh@tvu.edu.vn', 'PGS.TS. Lê Văn Hiệu', 'NguoiDuyet', v_nguoi_duyet_2, true)
    RETURNING user_id INTO v_user_duyet_1;
    
    -- Tạo admin user
    INSERT INTO nguoi_dung (email, full_name, role, is_active)
    VALUES ('admin@tvu.edu.vn', 'Quản Trị Viên', 'Admin', true);
    
    -- Gán roles cho users (optional - nếu muốn dùng hệ thống roles mở rộng)
    SELECT user_id INTO v_user_1 FROM nguoi_dung WHERE email = 'nguyenvana@tvu.edu.vn';
    SELECT user_id INTO v_user_2 FROM nguoi_dung WHERE email = 'tranthib@tvu.edu.vn';
    SELECT user_id INTO v_user_duyet_1 FROM nguoi_dung WHERE email = 'truongkhoa@tvu.edu.vn';
    
    INSERT INTO user_roles (user_id, role_id) VALUES
        (v_user_1, v_role_vien_chuc),
        (v_user_2, v_role_vien_chuc),
        (v_user_duyet_1, v_role_truong_khoa);
END $$;

-- ================================================
-- DỮ LIỆU MẪU: HỒ SƠ ĐI NƯỚC NGOÀI (SAMPLE)
-- ================================================

DO $$
DECLARE
    v_vien_chuc_1 UUID;
    v_loai_1 UUID;
    v_loai_2 UUID;
    v_kinhphi_1 UUID;
    v_kinhphi_2 UUID;
BEGIN
    -- Lấy IDs
    SELECT ma_vien_chuc INTO v_vien_chuc_1 FROM vien_chuc WHERE email = 'nguyenvana@tvu.edu.vn';
    SELECT ma_loai INTO v_loai_1 FROM loai_chuyen_di WHERE ten_loai = 'Hội nghị, hội thảo' LIMIT 1;
    SELECT ma_loai INTO v_loai_2 FROM loai_chuyen_di WHERE ten_loai = 'Đào tạo' LIMIT 1;
    SELECT ma_kinh_phi INTO v_kinhphi_1 FROM nguon_kinh_phi WHERE ten_nguon = 'Ngân sách nhà nước' LIMIT 1;
    SELECT ma_kinh_phi INTO v_kinhphi_2 FROM nguon_kinh_phi WHERE ten_nguon = 'Tài trợ nước ngoài' LIMIT 1;
    
    -- Tạo hồ sơ mẫu (triggers sẽ tự động tạo workflow duyệt)
    INSERT INTO ho_so_di_nuoc_ngoai (
        ma_vien_chuc, ma_loai, ma_kinh_phi, 
        ly_do_chuyen_di, thoi_gian_bat_dau, thoi_gian_ket_thuc,
        trang_thai, priority
    ) VALUES
        (
            v_vien_chuc_1, v_loai_1, v_kinhphi_1,
            'Tham dự Hội nghị quốc tế về Công nghệ Thông tin ICITA 2025 tại Singapore',
            '2025-12-15', '2025-12-20',
            'MoiTao', 'Cao'
        ),
        (
            v_vien_chuc_1, v_loai_2, v_kinhphi_2,
            'Tham gia khóa đào tạo ngắn hạn về AI và Machine Learning tại Nhật Bản',
            '2026-01-10', '2026-01-25',
            'MoiTao', 'TrungBinh'
        );
END $$;

-- ================================================
-- COMPLETED
-- ================================================

SELECT 'Seed data created successfully!
✅ Master Data:
  - 6 Loại chuyến đi
  - 6 Nguồn kinh phí
  - 5 Roles (VIEN_CHUC, TRUONG_KHOA, BGH, TCHC, ADMIN)

✅ Sample Users:
  - 5 Viên chức (với thông tin chi tiết)
  - 4 Người duyệt (2 Trưởng khoa, 2 BGH)
  - 8 User accounts (3 viên chức, 2 người duyệt, 1 admin)

✅ Sample Records:
  - 2 Hồ sơ đi nước ngoài (tự động tạo workflow duyệt)

📝 Note: All passwords in mock SSO are "123456"
🔐 Test accounts:
  - admin@tvu.edu.vn (Admin)
  - nguyenvana@tvu.edu.vn (Viên chức)
  - truongkhoa@tvu.edu.vn (Người duyệt - Khoa)
  - bgh@tvu.edu.vn (Người duyệt - BGH)
' as result;
