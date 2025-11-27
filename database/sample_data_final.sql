-- Sample Data QLHS Di Nuoc Ngoai (ASCII only to avoid encoding issues)

TRUNCATE TABLE nhatkyhethong CASCADE;
TRUNCATE TABLE lich_su_phe_duyet CASCADE;
TRUNCATE TABLE quy_trinh_phe_duyet CASCADE;
TRUNCATE TABLE file_dinh_kem CASCADE;
TRUNCATE TABLE ho_so_di_nuoc_ngoai CASCADE;
TRUNCATE TABLE phan_quyen CASCADE;
TRUNCATE TABLE nguoi_dung CASCADE;
TRUNCATE TABLE dm_vai_tro CASCADE;
TRUNCATE TABLE dm_don_vi CASCADE;
TRUNCATE TABLE dm_quoc_gia CASCADE;
TRUNCATE TABLE dm_loai_ho_so CASCADE;
TRUNCATE TABLE dm_trang_thai CASCADE;

ALTER SEQUENCE dm_vai_tro_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_don_vi_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_quoc_gia_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_loai_ho_so_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_trang_thai_id_seq RESTART WITH 1;
ALTER SEQUENCE nguoi_dung_id_seq RESTART WITH 1;
ALTER SEQUENCE phan_quyen_id_seq RESTART WITH 1;
ALTER SEQUENCE ho_so_di_nuoc_ngoai_id_seq RESTART WITH 1;

-- Vai Tro
INSERT INTO dm_vai_tro (ma_vai_tro, ten_vai_tro, mo_ta, is_active) VALUES
('VT_ADMIN', 'Admin', 'System administrator', true),
('VT_BGH', 'Ban Giam Hieu', 'School leadership', true),
('VT_TCHC', 'Truong Phong TCHC', 'Head of HR department', true),
('VT_TRUONG_KHOA', 'Truong Khoa', 'Head of faculty', true),
('VT_GIANG_VIEN', 'Giang Vien', 'Lecturer', true),
('VT_NHAN_VIEN', 'Nhan Vien', 'Staff', true),
('VT_NGUOI_DUNG', 'Nguoi Dung', 'Regular user', true),
('VT_GUEST', 'Guest', 'Guest user', true);

-- Don Vi (so_dien_thoai instead of dien_thoai, no ten_day_du, dia_chi, nguoi_phu_trach)
INSERT INTO dm_don_vi (ma_don_vi, ten_don_vi, loai_don_vi, email, so_dien_thoai) VALUES
('DV_CNTT', 'Khoa CNTT', 'khoa', 'cntt@vienkhcn.edu.vn', '0241234567'),
('DV_KTOAN', 'Khoa Kinh te', 'khoa', 'ktoan@vienkhcn.edu.vn', '0241234568'),
('DV_NGOAI_NGU', 'Khoa Ngoai ngu', 'khoa', 'nn@vienkhcn.edu.vn', '0241234569'),
('DV_HOA', 'Khoa Hoa', 'khoa', 'hoa@vienkhcn.edu.vn', '0241234570'),
('DV_VAT_LY', 'Khoa Vat ly', 'khoa', 'vatly@vienkhcn.edu.vn', '0241234571'),
('DV_SINH', 'Khoa Sinh', 'khoa', 'sinh@vienkhcn.edu.vn', '0241234572'),
('DV_TCHC', 'Phong TCHC', 'phong', 'tchc@vienkhcn.edu.vn', '0241234573'),
('DV_KHTC', 'Phong KHTC', 'phong', 'khtc@vienkhcn.edu.vn', '0241234574'),
('DV_QLKH', 'Phong QLKH', 'phong', 'qlkh@vienkhcn.edu.vn', '0241234575'),
('DV_HTQT', 'Phong HTQT', 'phong', 'htqt@vienkhcn.edu.vn', '0241234576'),
('DV_BGH', 'Ban Giam hieu', 'ban', 'bgh@vienkhcn.edu.vn', '0241234500'),
('DV_KHAC', 'Don vi khac', 'phong', NULL, NULL);

-- Quoc Gia (no chau_luc column)
INSERT INTO dm_quoc_gia (ma_quoc_gia, ten_quoc_gia, ten_tieng_anh) VALUES
('JP', 'Nhat Ban', 'Japan'),
('US', 'Hoa Ky', 'United States'),
('GB', 'Anh', 'United Kingdom'),
('FR', 'Phap', 'France'),
('DE', 'Duc', 'Germany'),
('KR', 'Han Quoc', 'South Korea'),
('CN', 'Trung Quoc', 'China'),
('SG', 'Singapore', 'Singapore'),
('AU', 'Uc', 'Australia'),
('CA', 'Canada', 'Canada'),
('TH', 'Thai Lan', 'Thailand'),
('MY', 'Malaysia', 'Malaysia'),
('IT', 'Y', 'Italy'),
('ES', 'Tay Ban Nha', 'Spain'),
('NL', 'Ha Lan', 'Netherlands');

-- Loai Ho So (yeu_cau_dang_vien, yeu_cau_ho_so_dang instead of mo_ta, yeu_cau_phe_duyet)
INSERT INTO dm_loai_ho_so (ma_loai_ho_so, ten_loai_ho_so, yeu_cau_dang_vien, yeu_cau_ho_so_dang) VALUES
('LHS_HOC_TAP', 'Hoc tap', false, false),
('LHS_NGHIEN_CUU', 'Nghien cuu', false, false),
('LHS_HOI_THAO', 'Hoi thao', false, false),
('LHS_DAO_TAO', 'Dao tao', false, false),
('LHS_LAM_VIEC', 'Lam viec', false, false);

-- Trang Thai (loai_trang_thai must be 'HANH_CHINH', 'DANG', or 'HE_THONG')
INSERT INTO dm_trang_thai (ma_trang_thai, ten_trang_thai, loai_trang_thai, mo_ta, mau_sac, thu_tu_hien_thi) VALUES
('CHO_DUYET', 'Cho duyet', 'HANH_CHINH', 'Ho so dang cho phe duyet', '#FFA500', 1),
('DANG_XU_LY', 'Dang xu ly', 'HANH_CHINH', 'Ho so dang duoc xu ly', '#2196F3', 2),
('DA_DUYET', 'Da duyet', 'HANH_CHINH', 'Ho so da duoc phe duyet', '#4CAF50', 3),
('TU_CHOI', 'Tu choi', 'HANH_CHINH', 'Ho so bi tu choi', '#F44336', 4),
('HUY_BO', 'Huy bo', 'HANH_CHINH', 'Ho so da bi huy', '#9E9E9E', 5),
('HOAN_THANH', 'Hoan thanh', 'HANH_CHINH', 'Da hoan thanh chuyen di', '#009688', 6);

-- Nguoi Dung (so_dien_thoai instead of dien_thoai, no trang_thai field, use is_active)
-- Password: password123
INSERT INTO nguoi_dung (username, password_hash, ho_ten, email, so_dien_thoai, don_vi_id) VALUES
('admin', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyen Van Admin', 'admin@vienkhcn.edu.vn', '0901234567', 7),
('bgh_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'PGS.TS Nguyen Van L', 'nvl@vienkhcn.edu.vn', '0901234568', 11),
('tchc_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyen Thi G', 'ntg@vienkhcn.edu.vn', '0901234569', 7),
('truongkhoa_cntt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Nguyen Van A', 'nva@vienkhcn.edu.vn', '0901234570', 1),
('truongkhoa_kt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Tran Thi B', 'ttb@vienkhcn.edu.vn', '0901234571', 2),
('gv_cntt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Le Van Minh', 'lvm@vienkhcn.edu.vn', '0901234572', 1),
('gv_cntt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Pham Thi Huong', 'pth@vienkhcn.edu.vn', '0901234573', 1),
('gv_cntt_03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Hoang Van Duc', 'hvd@vienkhcn.edu.vn', '0901234574', 1),
('gv_kt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Vu Thi Mai', 'vtm@vienkhcn.edu.vn', '0901234575', 2),
('gv_kt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Dang Van Nam', 'dvn@vienkhcn.edu.vn', '0901234576', 2),
('gv_nn_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Bui Thi Lan', 'btl@vienkhcn.edu.vn', '0901234577', 3),
('gv_nn_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Trinh Van Hai', 'tvh@vienkhcn.edu.vn', '0901234578', 3),
('gv_hoa_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Ngo Thi Hoa', 'nth@vienkhcn.edu.vn', '0901234579', 4),
('gv_ly_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Phan Van Tung', 'pvt@vienkhcn.edu.vn', '0901234580', 5),
('gv_sinh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Dinh Thi Thu', 'dtt@vienkhcn.edu.vn', '0901234581', 6),
('nv_tchc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Ly Van Phuc', 'lvp@vienkhcn.edu.vn', '0901234582', 7),
('nv_khtc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Mai Thi Ngoc', 'mtn@vienkhcn.edu.vn', '0901234583', 8),
('nv_qlkh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Do Van Thanh', 'dvt@vienkhcn.edu.vn', '0901234584', 9),
('nv_htqt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Cao Thi Hong', 'cth@vienkhcn.edu.vn', '0901234585', 10),
('user01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyen Van X', 'nvx@vienkhcn.edu.vn', '0901234586', 1),
('user02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Tran Thi Y', 'tty@vienkhcn.edu.vn', '0901234587', 2),
('user03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Le Van Z', 'lvz@vienkhcn.edu.vn', '0901234588', 3),
('user04', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Pham Thi K', 'ptk@vienkhcn.edu.vn', '0901234589', 4),
('user05', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Hoang Van M', 'hvm@vienkhcn.edu.vn', '0901234590', 5),
('guest', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Khach', 'guest@vienkhcn.edu.vn', NULL, 12);

-- Phan Quyen
INSERT INTO phan_quyen (nguoi_dung_id, vai_tro_id, don_vi_id, ngay_bat_dau) VALUES
(1, 1, 7, CURRENT_TIMESTAMP), (2, 2, 11, CURRENT_TIMESTAMP), (3, 3, 7, CURRENT_TIMESTAMP),
(4, 4, 1, CURRENT_TIMESTAMP), (5, 4, 2, CURRENT_TIMESTAMP), (6, 5, 1, CURRENT_TIMESTAMP),
(7, 5, 1, CURRENT_TIMESTAMP), (8, 5, 1, CURRENT_TIMESTAMP), (9, 5, 2, CURRENT_TIMESTAMP),
(10, 5, 2, CURRENT_TIMESTAMP), (11, 5, 3, CURRENT_TIMESTAMP), (12, 5, 3, CURRENT_TIMESTAMP),
(13, 5, 4, CURRENT_TIMESTAMP), (14, 5, 5, CURRENT_TIMESTAMP), (15, 5, 6, CURRENT_TIMESTAMP),
(16, 6, 7, CURRENT_TIMESTAMP), (17, 6, 8, CURRENT_TIMESTAMP), (18, 6, 9, CURRENT_TIMESTAMP),
(19, 6, 10, CURRENT_TIMESTAMP), (20, 7, 1, CURRENT_TIMESTAMP), (21, 7, 2, CURRENT_TIMESTAMP),
(22, 7, 3, CURRENT_TIMESTAMP), (23, 7, 4, CURRENT_TIMESTAMP), (24, 7, 5, CURRENT_TIMESTAMP),
(25, 8, 12, CURRENT_TIMESTAMP);

SELECT 'Sample data imported successfully!' as status,
(SELECT COUNT(*) FROM dm_vai_tro) as vai_tro,
(SELECT COUNT(*) FROM dm_don_vi) as don_vi,
(SELECT COUNT(*) FROM dm_quoc_gia) as quoc_gia,
(SELECT COUNT(*) FROM dm_loai_ho_so) as loai_ho_so,
(SELECT COUNT(*) FROM dm_trang_thai) as trang_thai,
(SELECT COUNT(*) FROM nguoi_dung) as nguoi_dung,
(SELECT COUNT(*) FROM phan_quyen) as phan_quyen;
