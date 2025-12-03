-- ================================================
-- DỮ LIỆU DEMO: QLHS Đi Nước Ngoài
-- Trường Đại học Trà Vinh
-- Encoding: UTF-8
-- ================================================

SET client_encoding = 'UTF8';

-- ================================================
-- DỮ LIỆU DANH MỤC
-- ================================================

-- Vai trò
INSERT INTO vai_tro (ma_vai_tro, ten_vai_tro, mo_ta, cap_do) VALUES
('ADMIN', 'Quản trị hệ thống', 'Quản trị viên có toàn quyền', 1),
('VT_TRUONG_DON_VI', 'Trưởng đơn vị', 'Trưởng các đơn vị/phòng ban', 2),
('VT_TCHC', 'Phòng Tổ chức - Hành chính', 'Cán bộ phòng TCHC', 3),
('VT_BGH', 'Ban Giám hiệu', 'Ban Giám hiệu nhà trường', 4),
('VT_VIEN_CHUC', 'Viên chức', 'Viên chức/giảng viên', 5);

-- Đơn vị
INSERT INTO don_vi (ma_don_vi, ten_don_vi, email, dien_thoai, deadline_tiep_nhan) VALUES
('TCNS', 'Trung tâm Công nghệ số', 'tcns@tvu.edu.vn', '0294.3855246', 3),
('BGH', 'Ban Giám hiệu', 'bgh@tvu.edu.vn', '0294.3855246', 5),
('CNTT', 'Khoa Công nghệ thông tin', 'cntt@tvu.edu.vn', '0294.3855321', 3),
('TCHC', 'Phòng Tổ chức - Hành chính', 'tchc@tvu.edu.vn', '0294.3855222', 3);

-- Trạng thái hồ sơ
INSERT INTO trang_thai (ma_trang_thai, ten_trang_thai, mo_ta, mau_sac, thu_tu) VALUES
('NHAP', 'Nháp', 'Hồ sơ đang soạn thảo', '#9E9E9E', 1),
('CHO_DUYET', 'Chờ đơn vị phê duyệt', 'Chờ trưởng đơn vị phê duyệt', '#FF9800', 2),
('DV_DA_DUYET', 'Đơn vị đã duyệt', 'Đơn vị đã phê duyệt', '#2196F3', 3),
('CHO_TCHC_DUYET', 'Chờ TCHC phê duyệt', 'Chờ phòng TCHC phê duyệt', '#FF9800', 4),
('TCHC_DA_DUYET', 'TCHC đã duyệt', 'TCHC đã phê duyệt', '#2196F3', 5),
('CHO_BGH_DUYET', 'Chờ BGH phê duyệt', 'Chờ Ban Giám hiệu phê duyệt', '#FF9800', 6),
('DA_DUYET', 'Đã phê duyệt', 'Hồ sơ đã được phê duyệt hoàn tất', '#4CAF50', 7),
('TU_CHOI', 'Từ chối', 'Hồ sơ bị từ chối', '#F44336', 8),
('HOAN_THANH', 'Đã hoàn thành', 'Đã đi và hoàn thành chuyến công tác', '#4CAF50', 9),
('DA_HUY', 'Đã hủy', 'Hồ sơ đã bị hủy', '#9E9E9E', 10);

-- Quốc gia
INSERT INTO quoc_gia (ma_quoc_gia, ten_quoc_gia, chau_luc) VALUES
('US', 'Hoa Kỳ', 'Bắc Mỹ'),
('GB', 'Vương quốc Anh', 'Châu Âu'),
('JP', 'Nhật Bản', 'Châu Á'),
('KR', 'Hàn Quốc', 'Châu Á'),
('FR', 'Pháp', 'Châu Âu'),
('DE', 'Đức', 'Châu Âu'),
('AU', 'Úc', 'Châu Đại Dương'),
('CA', 'Canada', 'Bắc Mỹ'),
('SG', 'Singapore', 'Châu Á'),
('TH', 'Thái Lan', 'Châu Á'),
('MY', 'Malaysia', 'Châu Á'),
('CN', 'Trung Quốc', 'Châu Á');

-- Loại file
INSERT INTO loai_file (ma_loai, ten_loai, mo_ta, kich_thuoc_toi_da) VALUES
('DON_XIN', 'Đơn xin đi công tác', 'Đơn xin phép đi công tác nước ngoài', 5242880),
('HO_CHIEU', 'Hộ chiếu', 'Bản sao hộ chiếu còn hạn', 5242880),
('THU_MOI', 'Thư mời', 'Thư mời tham dự hội nghị/sự kiện', 5242880),
('CHUONG_TRINH', 'Chương trình hội nghị', 'Chương trình chi tiết hội nghị/sự kiện', 10485760),
('QUYET_DINH', 'Quyết định cử đi', 'Quyết định cử đi công tác', 5242880),
('BAO_CAO', 'Báo cáo kết quả', 'Báo cáo kết quả sau chuyến công tác', 10485760),
('KHAC', 'File khác', 'Các tài liệu khác', 10485760);

-- ================================================
-- DỮ LIỆU NGƯỜI DÙNG (Password: Admin@123)
-- ================================================

-- Lấy ID vai trò và đơn vị
DO $$
DECLARE
    v_admin_id INTEGER;
    v_truong_id INTEGER;
    v_tchc_id INTEGER;
    v_bgh_id INTEGER;
    v_vien_chuc_id INTEGER;
    v_tcns_id INTEGER;
    v_cntt_id INTEGER;
    v_tchc_dv_id INTEGER;
    v_bgh_dv_id INTEGER;
BEGIN
    -- Lấy vai trò IDs
    SELECT id INTO v_admin_id FROM vai_tro WHERE ma_vai_tro = 'ADMIN';
    SELECT id INTO v_truong_id FROM vai_tro WHERE ma_vai_tro = 'VT_TRUONG_DON_VI';
    SELECT id INTO v_tchc_id FROM vai_tro WHERE ma_vai_tro = 'VT_TCHC';
    SELECT id INTO v_bgh_id FROM vai_tro WHERE ma_vai_tro = 'VT_BGH';
    SELECT id INTO v_vien_chuc_id FROM vai_tro WHERE ma_vai_tro = 'VT_VIEN_CHUC';
    
    -- Lấy đơn vị IDs
    SELECT id INTO v_tcns_id FROM don_vi WHERE ma_don_vi = 'TCNS';
    SELECT id INTO v_cntt_id FROM don_vi WHERE ma_don_vi = 'CNTT';
    SELECT id INTO v_tchc_dv_id FROM don_vi WHERE ma_don_vi = 'TCHC';
    SELECT id INTO v_bgh_dv_id FROM don_vi WHERE ma_don_vi = 'BGH';
    
    -- Người dùng
    INSERT INTO nguoi_dung (ho_ten, email, password_hash, dien_thoai, don_vi_id, vai_tro_id, is_active) VALUES
    ('Nguyễn Văn Admin', 'admin@tvu.edu.vn', '$2b$10$0.sNENa.hITW7WerwbsM/O8ptAkN13nBmzGuYYMyWOC9PTDZ/gv9u', '0909123456', v_tcns_id, v_admin_id, TRUE),
    ('Trần Thị Hoa', 'hoatt@tvu.edu.vn', '$2b$10$0.sNENa.hITW7WerwbsM/O8ptAkN13nBmzGuYYMyWOC9PTDZ/gv9u', '0909123457', v_cntt_id, v_truong_id, TRUE),
    ('Lê Văn Nam', 'namlv@tvu.edu.vn', '$2b$10$0.sNENa.hITW7WerwbsM/O8ptAkN13nBmzGuYYMyWOC9PTDZ/gv9u', '0909123458', v_tchc_dv_id, v_tchc_id, TRUE),
    ('Phạm Thị Mai', 'maipt@tvu.edu.vn', '$2b$10$0.sNENa.hITW7WerwbsM/O8ptAkN13nBmzGuYYMyWOC9PTDZ/gv9u', '0909123459', v_bgh_dv_id, v_bgh_id, TRUE),
    ('Hoàng Văn Tuấn', 'tuanhv@tvu.edu.vn', '$2b$10$0.sNENa.hITW7WerwbsM/O8ptAkN13nBmzGuYYMyWOC9PTDZ/gv9u', '0909123460', v_cntt_id, v_vien_chuc_id, TRUE);
    
    -- Cập nhật trưởng đơn vị
    UPDATE don_vi SET truong_don_vi_id = (SELECT id FROM nguoi_dung WHERE email = 'hoatt@tvu.edu.vn') WHERE ma_don_vi = 'CNTT';
END $$;

-- ================================================
-- DỮ LIỆU HỒ SƠ MẪU
-- ================================================

DO $$
DECLARE
    v_user_id INTEGER;
    v_quoc_gia_id INTEGER;
    v_trang_thai_id INTEGER;
    v_ho_so_id INTEGER;
BEGIN
    -- Lấy IDs
    SELECT id INTO v_user_id FROM nguoi_dung WHERE email = 'tuanhv@tvu.edu.vn';
    SELECT id INTO v_quoc_gia_id FROM quoc_gia WHERE ma_quoc_gia = 'JP';
    SELECT id INTO v_trang_thai_id FROM trang_thai WHERE ma_trang_thai = 'CHO_DUYET';
    
    -- Tạo hồ sơ mẫu
    INSERT INTO ho_so (
        ma_ho_so, 
        ten_chuyen_di, 
        nguoi_tao_id, 
        loai_ho_so, 
        quoc_gia_id, 
        muc_dich,
        ngay_di_du_kien,
        ngay_ve_du_kien,
        nguon_kinh_phi,
        trang_thai_id
    ) VALUES (
        'HS202501001',
        'Tham dự Hội nghị Công nghệ Giáo dục Tokyo 2025',
        v_user_id,
        'HOI_NGHI',
        v_quoc_gia_id,
        'Tham dự hội nghị quốc tế về ứng dụng AI trong giáo dục, trao đổi kinh nghiệm với các trường đại học Nhật Bản',
        CURRENT_DATE + INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '37 days',
        'Ngân sách nhà trường',
        v_trang_thai_id
    ) RETURNING id INTO v_ho_so_id;
    
    -- Lịch sử hệ thống
    INSERT INTO lich_su_he_thong (loai_su_kien, nguoi_dung_id, mo_ta, chi_tiet, ip_address)
    VALUES (
        'TAO_HO_SO',
        v_user_id,
        'Tạo hồ sơ HS202501001',
        jsonb_build_object('ma_ho_so', 'HS202501001', 'loai', 'HOI_NGHI'),
        '127.0.0.1'
    );
END $$;

-- ================================================
-- COMPLETED
-- ================================================

SELECT 
    (SELECT COUNT(*) FROM vai_tro) as so_vai_tro,
    (SELECT COUNT(*) FROM don_vi) as so_don_vi,
    (SELECT COUNT(*) FROM nguoi_dung) as so_nguoi_dung,
    (SELECT COUNT(*) FROM trang_thai) as so_trang_thai,
    (SELECT COUNT(*) FROM quoc_gia) as so_quoc_gia,
    (SELECT COUNT(*) FROM loai_file) as so_loai_file,
    (SELECT COUNT(*) FROM ho_so) as so_ho_so,
    'Demo data inserted successfully!' as result;
