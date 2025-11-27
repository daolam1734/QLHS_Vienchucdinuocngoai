-- Sample Data for QLHS Di Nuoc Ngoai System
-- All INSERT VALUES use simple ASCII characters to avoid encoding issues

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

-- Vai Tro (Roles)
INSERT INTO dm_vai_tro (ma_vai_tro, ten_vai_tro, mo_ta, is_active) VALUES
('VT_ADMIN', 'Admin', 'System administrator', true),
('VT_BGH', 'Ban Giam Hieu', 'School leadership', true),
('VT_TCHC', 'Truong Phong', 'Head of HR department', true),
('VT_TRUONG_KHOA', 'Truong Khoa', 'Head of faculty', true),
('VT_GIANG_VIEN', 'Giang Vien', 'Lecturer', true),
('VT_NHAN_VIEN', 'Nhan Vien', 'Staff', true),
('VT_NGUOI_DUNG', 'Nguoi Dung', 'Regular user', true),
('VT_GUEST', 'Guest', 'Guest user', true);

-- Don Vi (Departments)
INSERT INTO dm_don_vi (ma_don_vi, ten_don_vi, ten_day_du, loai_don_vi, don_vi_cha_id, dien_thoai, email, dia_chi, nguoi_phu_trach, is_active) VALUES
('DV_CNTT', 'Khoa CNTT', 'Khoa Cong nghe Thong tin', 'khoa', NULL, '0241234567', 'cntt@vienkhcn.edu.vn', 'Tang 3 Nha A', 'TS. Nguyen Van A', true),
('DV_KTOAN', 'Khoa Kinh te', 'Khoa Kinh te va Quan tri', 'khoa', NULL, '0241234568', 'ktoan@vienkhcn.edu.vn', 'Tang 2 Nha B', 'TS. Tran Thi B', true),
('DV_NGOAI_NGU', 'Khoa Ngoai ngu', 'Khoa Ngoai ngu va Van hoa', 'khoa', NULL, '0241234569', 'nn@vienkhcn.edu.vn', 'Tang 4 Nha C', 'PGS. Le Van C', true),
('DV_HOA', 'Khoa Hoa', 'Khoa Hoa hoc', 'khoa', NULL, '0241234570', 'hoa@vienkhcn.edu.vn', 'Tang 1 Nha D', 'PGS.TS Pham Van D', true),
('DV_VAT_LY', 'Khoa Vat ly', 'Khoa Vat ly va Cong nghe', 'khoa', NULL, '0241234571', 'vatly@vienkhcn.edu.vn', 'Tang 5 Nha E', 'TS. Hoang Thi E', true),
('DV_SINH', 'Khoa Sinh', 'Khoa Sinh hoc va Moi truong', 'khoa', NULL, '0241234572', 'sinh@vienkhcn.edu.vn', 'Tang 2 Nha F', 'PGS. Vu Van F', true),
('DV_TCHC', 'Phong TCHC', 'Phong To chuc Hanh chinh', 'phong', NULL, '0241234573', 'tchc@vienkhcn.edu.vn', 'Tang 1 Nha A', 'Nguyen Thi G', true),
('DV_KHTC', 'Phong KHTC', 'Phong Ke hoach Tai chinh', 'phong', NULL, '0241234574', 'khtc@vienkhcn.edu.vn', 'Tang 1 Nha B', 'Tran Van H', true),
('DV_QLKH', 'Phong QLKH', 'Phong Quan ly Khoa hoc', 'phong', NULL, '0241234575', 'qlkh@vienkhcn.edu.vn', 'Tang 2 Nha A', 'Le Thi I', true),
('DV_HTQT', 'Phong HTQT', 'Phong Hop tac Quoc te', 'phong', NULL, '0241234576', 'htqt@vienkhcn.edu.vn', 'Tang 3 Nha B', 'Pham Van K', true),
('DV_BGH', 'Ban Giam hieu', 'Ban Giam hieu Truong', 'ban', NULL, '0241234500', 'bgh@vienkhcn.edu.vn', 'Tang 5 Nha A', 'PGS.TS Nguyen Van L', true),
('DV_KHAC', 'Don vi khac', 'Cac don vi khac', 'phong', NULL, NULL, NULL, NULL, NULL, true);

-- Quoc Gia (Countries)
INSERT INTO dm_quoc_gia (ma_quoc_gia, ten_quoc_gia, ten_tieng_anh, chau_luc, is_active) VALUES
('JP', 'Nhat Ban', 'Japan', 'Asia', true),
('US', 'Hoa Ky', 'United States', 'North America', true),
('GB', 'Anh', 'United Kingdom', 'Europe', true),
('FR', 'Phap', 'France', 'Europe', true),
('DE', 'Duc', 'Germany', 'Europe', true),
('KR', 'Han Quoc', 'South Korea', 'Asia', true),
('CN', 'Trung Quoc', 'China', 'Asia', true),
('SG', 'Singapore', 'Singapore', 'Asia', true),
('AU', 'Uc', 'Australia', 'Oceania', true),
('CA', 'Canada', 'Canada', 'North America', true),
('TH', 'Thai Lan', 'Thailand', 'Asia', true),
('MY', 'Malaysia', 'Malaysia', 'Asia', true),
('IT', 'Y', 'Italy', 'Europe', true),
('ES', 'Tay Ban Nha', 'Spain', 'Europe', true),
('NL', 'Ha Lan', 'Netherlands', 'Europe', true);

-- Loai Ho So
INSERT INTO dm_loai_ho_so (ma_loai_ho_so, ten_loai_ho_so, mo_ta, yeu_cau_phe_duyet, is_active) VALUES
('LHS_HOC_TAP', 'Hoc tap', 'Di hoc tap dao tao nang cao trinh do', true, true),
('LHS_NGHIEN_CUU', 'Nghien cuu', 'Di nghien cuu khoa hoc', true, true),
('LHS_HOI_THAO', 'Hoi thao', 'Tham du hoi thao hoi nghi quoc te', true, true),
('LHS_DAO_TAO', 'Dao tao', 'Di dao tao ngan han tap huan', true, true),
('LHS_LAM_VIEC', 'Lam viec', 'Cong tac lam viec voi doi tac', true, true);

-- Trang Thai
INSERT INTO dm_trang_thai (ma_trang_thai, ten_trang_thai, mau_sac, mo_ta, loai_trang_thai, is_active) VALUES
('CHO_DUYET', 'Cho duyet', '#FFA500', 'Ho so dang cho phe duyet', 'ho_so', true),
('DANG_XU_LY', 'Dang xu ly', '#2196F3', 'Ho so dang duoc xu ly', 'ho_so', true),
('DA_DUYET', 'Da duyet', '#4CAF50', 'Ho so da duoc phe duyet', 'ho_so', true),
('TU_CHOI', 'Tu choi', '#F44336', 'Ho so bi tu choi', 'ho_so', true),
('HUY_BO', 'Huy bo', '#9E9E9E', 'Ho so da bi huy', 'ho_so', true),
('HOAN_THANH', 'Hoan thanh', '#009688', 'Da hoan thanh chuyen di', 'ho_so', true);

-- Nguoi Dung (password: password123)
INSERT INTO nguoi_dung (username, password_hash, ho_ten, email, dien_thoai, don_vi_id, trang_thai, ngay_tao) VALUES
('admin', '', 'Nguyen Van Admin', 'admin@vienkhcn.edu.vn', '0901234567', 7, 'active', CURRENT_TIMESTAMP),
('bgh_nguyen', '', 'PGS.TS Nguyen Van L', 'nvl@vienkhcn.edu.vn', '0901234568', 11, 'active', CURRENT_TIMESTAMP),
('tchc_nguyen', '', 'Nguyen Thi G', 'ntg@vienkhcn.edu.vn', '0901234569', 7, 'active', CURRENT_TIMESTAMP),
('truongkhoa_cntt', '', 'TS. Nguyen Van A', 'nva@vienkhcn.edu.vn', '0901234570', 1, 'active', CURRENT_TIMESTAMP),
('truongkhoa_kt', '', 'TS. Tran Thi B', 'ttb@vienkhcn.edu.vn', '0901234571', 2, 'active', CURRENT_TIMESTAMP),
('gv_cntt_01', '', 'Le Van Minh', 'lvm@vienkhcn.edu.vn', '0901234572', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_02', '', 'Pham Thi Huong', 'pth@vienkhcn.edu.vn', '0901234573', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_03', '', 'Hoang Van Duc', 'hvd@vienkhcn.edu.vn', '0901234574', 1, 'active', CURRENT_TIMESTAMP),
('gv_kt_01', '', 'Vu Thi Mai', 'vtm@vienkhcn.edu.vn', '0901234575', 2, 'active', CURRENT_TIMESTAMP),
('gv_kt_02', '', 'Dang Van Nam', 'dvn@vienkhcn.edu.vn', '0901234576', 2, 'active', CURRENT_TIMESTAMP),
('gv_nn_01', '', 'Bui Thi Lan', 'btl@vienkhcn.edu.vn', '0901234577', 3, 'active', CURRENT_TIMESTAMP),
('gv_nn_02', '', 'Trinh Van Hai', 'tvh@vienkhcn.edu.vn', '0901234578', 3, 'active', CURRENT_TIMESTAMP),
('gv_hoa_01', '', 'Ngo Thi Hoa', 'nth@vienkhcn.edu.vn', '0901234579', 4, 'active', CURRENT_TIMESTAMP),
('gv_ly_01', '', 'Phan Van Tung', 'pvt@vienkhcn.edu.vn', '0901234580', 5, 'active', CURRENT_TIMESTAMP),
('gv_sinh_01', '', 'Dinh Thi Thu', 'dtt@vienkhcn.edu.vn', '0901234581', 6, 'active', CURRENT_TIMESTAMP),
('nv_tchc_01', '', 'Ly Van Phuc', 'lvp@vienkhcn.edu.vn', '0901234582', 7, 'active', CURRENT_TIMESTAMP),
('nv_khtc_01', '', 'Mai Thi Ngoc', 'mtn@vienkhcn.edu.vn', '0901234583', 8, 'active', CURRENT_TIMESTAMP),
('nv_qlkh_01', '', 'Do Van Thanh', 'dvt@vienkhcn.edu.vn', '0901234584', 9, 'active', CURRENT_TIMESTAMP),
('nv_htqt_01', '', 'Cao Thi Hong', 'cth@vienkhcn.edu.vn', '0901234585', 10, 'active', CURRENT_TIMESTAMP),
('user01', '', 'Nguyen Van X', 'nvx@vienkhcn.edu.vn', '0901234586', 1, 'active', CURRENT_TIMESTAMP),
('user02', '', 'Tran Thi Y', 'tty@vienkhcn.edu.vn', '0901234587', 2, 'active', CURRENT_TIMESTAMP),
('user03', '', 'Le Van Z', 'lvz@vienkhcn.edu.vn', '0901234588', 3, 'active', CURRENT_TIMESTAMP),
('user04', '', 'Pham Thi K', 'ptk@vienkhcn.edu.vn', '0901234589', 4, 'active', CURRENT_TIMESTAMP),
('user05', '', 'Hoang Van M', 'hvm@vienkhcn.edu.vn', '0901234590', 5, 'active', CURRENT_TIMESTAMP),
('guest', '', 'Khach', 'guest@vienkhcn.edu.vn', NULL, 12, 'active', CURRENT_TIMESTAMP);

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
(SELECT COUNT(*) FROM nguoi_dung) as nguoi_dung,
(SELECT COUNT(*) FROM phan_quyen) as phan_quyen;
