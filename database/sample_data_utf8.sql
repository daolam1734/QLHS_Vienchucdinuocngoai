-- Sample Data for QLHS Di Nuoc Ngoai System
-- Encoding: UTF-8
-- Created: 2025-11-27

-- Truncate all tables in correct order
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

-- Reset sequences
ALTER SEQUENCE dm_vai_tro_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_don_vi_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_quoc_gia_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_loai_ho_so_id_seq RESTART WITH 1;
ALTER SEQUENCE dm_trang_thai_id_seq RESTART WITH 1;
ALTER SEQUENCE nguoi_dung_id_seq RESTART WITH 1;
ALTER SEQUENCE phan_quyen_id_seq RESTART WITH 1;
ALTER SEQUENCE ho_so_di_nuoc_ngoai_id_seq RESTART WITH 1;

-- Insert Vai Tro (Roles)
INSERT INTO dm_vai_tro (ma_vai_tro, ten_vai_tro, mo_ta, is_active) VALUES
('VT_ADMIN', 'Quáº£n trá»‹ viÃªn', 'Quáº£n trá»‹ há»‡ thá»‘ng, cÃ³ toÃ n quyá»n truy cáº­p', true),
('VT_BGH', 'Ban giÃ¡m hiá»‡u', 'LÃ£nh Ä‘áº¡o trÆ°á»ng, phÃª duyá»‡t cuá»‘i cÃ¹ng', true),
('VT_TCHC', 'TrÆ°á»Ÿng phÃ²ng Tá»• chá»©c', 'Quáº£n lÃ½ vÃ  xÃ©t duyá»‡t há»“ sÆ¡', true),
('VT_TRUONG_KHOA', 'TrÆ°á»Ÿng khoa', 'XÃ©t duyá»‡t há»“ sÆ¡ cá»§a khoa', true),
('VT_GIANG_VIEN', 'Giáº£ng viÃªn', 'Ná»™p há»“ sÆ¡ Ä‘i cÃ´ng tÃ¡c', true),
('VT_NHAN_VIEN', 'NhÃ¢n viÃªn', 'Ná»™p há»“ sÆ¡ Ä‘i cÃ´ng tÃ¡c', true),
('VT_NGUOI_DUNG', 'NgÆ°á»i dÃ¹ng', 'NgÆ°á»i dÃ¹ng thÃ´ng thÆ°á»ng', true),
('VT_GUEST', 'KhÃ¡ch', 'Xem thÃ´ng tin cÃ´ng khai', true);

-- Insert Don Vi (Departments)
INSERT INTO dm_don_vi (ma_don_vi, ten_don_vi, ten_day_du, loai_don_vi, don_vi_cha_id, dien_thoai, email, dia_chi, nguoi_phu_trach, is_active) VALUES
('DV_CNTT', 'Khoa CNTT', 'Khoa CÃ´ng nghá»‡ ThÃ´ng tin', 'khoa', NULL, '0241234567', 'cntt@vienkhcn.edu.vn', 'Táº§ng 3, NhÃ  A', 'TS. Nguyá»…n VÄƒn A', true),
('DV_KTOAN', 'Khoa Kinh táº¿', 'Khoa Kinh táº¿ vÃ  Quáº£n trá»‹', 'khoa', NULL, '0241234568', 'ktoan@vienkhcn.edu.vn', 'Táº§ng 2, NhÃ  B', 'TS. Tráº§n Thá»‹ B', true),
('DV_NGOAI_NGU', 'Khoa Ngoáº¡i ngá»¯', 'Khoa Ngoáº¡i ngá»¯ vÃ  VÄƒn hÃ³a', 'khoa', NULL, '0241234569', 'nn@vienkhcn.edu.vn', 'Táº§ng 4, NhÃ  C', 'PGS. LÃª VÄƒn C', true),
('DV_HOA', 'Khoa HÃ³a', 'Khoa HÃ³a há»c', 'khoa', NULL, '0241234570', 'hoa@vienkhcn.edu.vn', 'Táº§ng 1, NhÃ  D', 'PGS.TS Pháº¡m VÄƒn D', true),
('DV_VAT_LY', 'Khoa Váº­t lÃ½', 'Khoa Váº­t lÃ½ vÃ  CÃ´ng nghá»‡', 'khoa', NULL, '0241234571', 'vatly@vienkhcn.edu.vn', 'Táº§ng 5, NhÃ  E', 'TS. HoÃ ng Thá»‹ E', true),
('DV_SINH', 'Khoa Sinh', 'Khoa Sinh há»c vÃ  MÃ´i trÆ°á»ng', 'khoa', NULL, '0241234572', 'sinh@vienkhcn.edu.vn', 'Táº§ng 2, NhÃ  F', 'PGS. VÅ© VÄƒn F', true),
('DV_TCHC', 'PhÃ²ng TCHC', 'PhÃ²ng Tá»• chá»©c HÃ nh chÃ­nh', 'phong', NULL, '0241234573', 'tchc@vienkhcn.edu.vn', 'Táº§ng 1, NhÃ  A', 'Nguyá»…n Thá»‹ G', true),
('DV_KHTC', 'PhÃ²ng KHTC', 'PhÃ²ng Káº¿ hoáº¡ch TÃ i chÃ­nh', 'phong', NULL, '0241234574', 'khtc@vienkhcn.edu.vn', 'Táº§ng 1, NhÃ  B', 'Tráº§n VÄƒn H', true),
('DV_QLKH', 'PhÃ²ng QLKH', 'PhÃ²ng Quáº£n lÃ½ Khoa há»c', 'phong', NULL, '0241234575', 'qlkh@vienkhcn.edu.vn', 'Táº§ng 2, NhÃ  A', 'LÃª Thá»‹ I', true),
('DV_HTQT', 'PhÃ²ng HTQT', 'PhÃ²ng Há»£p tÃ¡c Quá»‘c táº¿', 'phong', NULL, '0241234576', 'htqt@vienkhcn.edu.vn', 'Táº§ng 3, NhÃ  B', 'Pháº¡m VÄƒn K', true),
('DV_BGH', 'Ban GiÃ¡m hiá»‡u', 'Ban GiÃ¡m hiá»‡u TrÆ°á»ng', 'ban', NULL, '0241234500', 'bgh@vienkhcn.edu.vn', 'Táº§ng 5, NhÃ  A', 'PGS.TS Nguyá»…n VÄƒn L', true),
('DV_KHAC', 'ÄÆ¡n vá»‹ khÃ¡c', 'CÃ¡c Ä‘Æ¡n vá»‹ khÃ¡c', 'phong', NULL, NULL, NULL, NULL, NULL, true);

-- Insert Quoc Gia (Countries)
INSERT INTO dm_quoc_gia (ma_quoc_gia, ten_quoc_gia, ten_tieng_anh, chau_luc, is_active) VALUES
('JP', 'Nháº­t Báº£n', 'Japan', 'Asia', true),
('US', 'Hoa Ká»³', 'United States', 'North America', true),
('GB', 'Anh', 'United Kingdom', 'Europe', true),
('FR', 'PhÃ¡p', 'France', 'Europe', true),
('DE', 'Äá»©c', 'Germany', 'Europe', true),
('KR', 'HÃ n Quá»‘c', 'South Korea', 'Asia', true),
('CN', 'Trung Quá»‘c', 'China', 'Asia', true),
('SG', 'Singapore', 'Singapore', 'Asia', true),
('AU', 'Ãšc', 'Australia', 'Oceania', true),
('CA', 'Canada', 'Canada', 'North America', true),
('TH', 'ThÃ¡i Lan', 'Thailand', 'Asia', true),
('MY', 'Malaysia', 'Malaysia', 'Asia', true),
('IT', 'Ã', 'Italy', 'Europe', true),
('ES', 'TÃ¢y Ban Nha', 'Spain', 'Europe', true),
('NL', 'HÃ  Lan', 'Netherlands', 'Europe', true);

-- Insert Loai Ho So (Application Types)
INSERT INTO dm_loai_ho_so (ma_loai_ho_so, ten_loai_ho_so, mo_ta, yeu_cau_phe_duyet, is_active) VALUES
('LHS_HOC_TAP', 'Há»c táº­p', 'Äi há»c táº­p, Ä‘Ã o táº¡o nÃ¢ng cao trÃ¬nh Ä‘á»™', true, true),
('LHS_NGHIEN_CUU', 'NghiÃªn cá»©u', 'Äi nghiÃªn cá»©u khoa há»c', true, true),
('LHS_HOI_THAO', 'Há»™i tháº£o', 'Tham dá»± há»™i tháº£o, há»™i nghá»‹ quá»‘c táº¿', true, true),
('LHS_DAO_TAO', 'ÄÃ o táº¡o', 'Äi Ä‘Ã o táº¡o ngáº¯n háº¡n, táº­p huáº¥n', true, true),
('LHS_LAM_VIEC', 'LÃ m viá»‡c', 'CÃ´ng tÃ¡c, lÃ m viá»‡c vá»›i Ä‘á»‘i tÃ¡c', true, true);

-- Insert Trang Thai (Status)
INSERT INTO dm_trang_thai (ma_trang_thai, ten_trang_thai, mau_sac, mo_ta, loai_trang_thai, is_active) VALUES
('CHO_DUYET', 'Chá» duyá»‡t', '#FFA500', 'Há»“ sÆ¡ Ä‘ang chá» phÃª duyá»‡t', 'ho_so', true),
('DANG_XU_LY', 'Äang xá»­ lÃ½', '#2196F3', 'Há»“ sÆ¡ Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½', 'ho_so', true),
('DA_DUYET', 'ÄÃ£ duyá»‡t', '#4CAF50', 'Há»“ sÆ¡ Ä‘Ã£ Ä‘Æ°á»£c phÃª duyá»‡t', 'ho_so', true),
('TU_CHOI', 'Tá»« chá»‘i', '#F44336', 'Há»“ sÆ¡ bá»‹ tá»« chá»‘i', 'ho_so', true),
('HUY_BO', 'Há»§y bá»', '#9E9E9E', 'Há»“ sÆ¡ Ä‘Ã£ bá»‹ há»§y', 'ho_so', true),
('HOAN_THANH', 'HoÃ n thÃ nh', '#009688', 'ÄÃ£ hoÃ n thÃ nh chuyáº¿n Ä‘i', 'ho_so', true);

-- Insert Nguoi Dung (Users) with bcrypt hashed password 'password123'
INSERT INTO nguoi_dung (username, password_hash, ho_ten, email, dien_thoai, don_vi_id, trang_thai, ngay_tao) VALUES
('admin', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyá»…n VÄƒn Admin', 'admin@vienkhcn.edu.vn', '0901234567', 7, 'active', CURRENT_TIMESTAMP),
('bgh_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'PGS.TS Nguyá»…n VÄƒn L', 'nvl@vienkhcn.edu.vn', '0901234568', 11, 'active', CURRENT_TIMESTAMP),
('tchc_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyá»…n Thá»‹ G', 'ntg@vienkhcn.edu.vn', '0901234569', 7, 'active', CURRENT_TIMESTAMP),
('truongkhoa_cntt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Nguyá»…n VÄƒn A', 'nva@vienkhcn.edu.vn', '0901234570', 1, 'active', CURRENT_TIMESTAMP),
('truongkhoa_kt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Tráº§n Thá»‹ B', 'ttb@vienkhcn.edu.vn', '0901234571', 2, 'active', CURRENT_TIMESTAMP),
('gv_cntt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'LÃª VÄƒn Minh', 'lvm@vienkhcn.edu.vn', '0901234572', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Pháº¡m Thá»‹ HÆ°Æ¡ng', 'pth@vienkhcn.edu.vn', '0901234573', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'HoÃ ng VÄƒn Äá»©c', 'hvd@vienkhcn.edu.vn', '0901234574', 1, 'active', CURRENT_TIMESTAMP),
('gv_kt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'VÅ© Thá»‹ Mai', 'vtm@vienkhcn.edu.vn', '0901234575', 2, 'active', CURRENT_TIMESTAMP),
('gv_kt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Äáº·ng VÄƒn Nam', 'dvn@vienkhcn.edu.vn', '0901234576', 2, 'active', CURRENT_TIMESTAMP),
('gv_nn_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'BÃ¹i Thá»‹ Lan', 'btl@vienkhcn.edu.vn', '0901234577', 3, 'active', CURRENT_TIMESTAMP),
('gv_nn_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Trá»‹nh VÄƒn Háº£i', 'tvh@vienkhcn.edu.vn', '0901234578', 3, 'active', CURRENT_TIMESTAMP),
('gv_hoa_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'NgÃ´ Thá»‹ Hoa', 'nth@vienkhcn.edu.vn', '0901234579', 4, 'active', CURRENT_TIMESTAMP),
('gv_ly_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Phan VÄƒn TÃ¹ng', 'pvt@vienkhcn.edu.vn', '0901234580', 5, 'active', CURRENT_TIMESTAMP),
('gv_sinh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Äinh Thá»‹ Thu', 'dtt@vienkhcn.edu.vn', '0901234581', 6, 'active', CURRENT_TIMESTAMP),
('nv_tchc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'LÃ½ VÄƒn PhÃºc', 'lvp@vienkhcn.edu.vn', '0901234582', 7, 'active', CURRENT_TIMESTAMP),
('nv_khtc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Mai Thá»‹ Ngá»c', 'mtn@vienkhcn.edu.vn', '0901234583', 8, 'active', CURRENT_TIMESTAMP),
('nv_qlkh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Äá»— VÄƒn ThÃ nh', 'dvt@vienkhcn.edu.vn', '0901234584', 9, 'active', CURRENT_TIMESTAMP),
('nv_htqt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Cao Thá»‹ Há»“ng', 'cth@vienkhcn.edu.vn', '0901234585', 10, 'active', CURRENT_TIMESTAMP),
('user01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyá»…n VÄƒn X', 'nvx@vienkhcn.edu.vn', '0901234586', 1, 'active', CURRENT_TIMESTAMP),
('user02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Tráº§n Thá»‹ Y', 'tty@vienkhcn.edu.vn', '0901234587', 2, 'active', CURRENT_TIMESTAMP),
('user03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'LÃª VÄƒn Z', 'lvz@vienkhcn.edu.vn', '0901234588', 3, 'active', CURRENT_TIMESTAMP),
('user04', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Pháº¡m Thá»‹ K', 'ptk@vienkhcn.edu.vn', '0901234589', 4, 'active', CURRENT_TIMESTAMP),
('user05', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'HoÃ ng VÄƒn M', 'hvm@vienkhcn.edu.vn', '0901234590', 5, 'active', CURRENT_TIMESTAMP),
('guest', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'KhÃ¡ch', 'guest@vienkhcn.edu.vn', NULL, 12, 'active', CURRENT_TIMESTAMP);

-- Insert Phan Quyen (Role Assignments) - Fixed: removed ngay_cap column
INSERT INTO phan_quyen (nguoi_dung_id, vai_tro_id, don_vi_id, ngay_bat_dau, ngay_ket_thuc) VALUES
(1, 1, 7, CURRENT_TIMESTAMP, NULL),  -- admin -> VT_ADMIN
(2, 2, 11, CURRENT_TIMESTAMP, NULL), -- bgh_nguyen -> VT_BGH
(3, 3, 7, CURRENT_TIMESTAMP, NULL),  -- tchc_nguyen -> VT_TCHC
(4, 4, 1, CURRENT_TIMESTAMP, NULL),  -- truongkhoa_cntt -> VT_TRUONG_KHOA
(5, 4, 2, CURRENT_TIMESTAMP, NULL),  -- truongkhoa_kt -> VT_TRUONG_KHOA
(6, 5, 1, CURRENT_TIMESTAMP, NULL),  -- gv_cntt_01 -> VT_GIANG_VIEN
(7, 5, 1, CURRENT_TIMESTAMP, NULL),  -- gv_cntt_02 -> VT_GIANG_VIEN
(8, 5, 1, CURRENT_TIMESTAMP, NULL),  -- gv_cntt_03 -> VT_GIANG_VIEN
(9, 5, 2, CURRENT_TIMESTAMP, NULL),  -- gv_kt_01 -> VT_GIANG_VIEN
(10, 5, 2, CURRENT_TIMESTAMP, NULL), -- gv_kt_02 -> VT_GIANG_VIEN
(11, 5, 3, CURRENT_TIMESTAMP, NULL), -- gv_nn_01 -> VT_GIANG_VIEN
(12, 5, 3, CURRENT_TIMESTAMP, NULL), -- gv_nn_02 -> VT_GIANG_VIEN
(13, 5, 4, CURRENT_TIMESTAMP, NULL), -- gv_hoa_01 -> VT_GIANG_VIEN
(14, 5, 5, CURRENT_TIMESTAMP, NULL), -- gv_ly_01 -> VT_GIANG_VIEN
(15, 5, 6, CURRENT_TIMESTAMP, NULL), -- gv_sinh_01 -> VT_GIANG_VIEN
(16, 6, 7, CURRENT_TIMESTAMP, NULL), -- nv_tchc_01 -> VT_NHAN_VIEN
(17, 6, 8, CURRENT_TIMESTAMP, NULL), -- nv_khtc_01 -> VT_NHAN_VIEN
(18, 6, 9, CURRENT_TIMESTAMP, NULL), -- nv_qlkh_01 -> VT_NHAN_VIEN
(19, 6, 10, CURRENT_TIMESTAMP, NULL), -- nv_htqt_01 -> VT_NHAN_VIEN
(20, 7, 1, CURRENT_TIMESTAMP, NULL), -- user01 -> VT_NGUOI_DUNG
(21, 7, 2, CURRENT_TIMESTAMP, NULL), -- user02 -> VT_NGUOI_DUNG
(22, 7, 3, CURRENT_TIMESTAMP, NULL), -- user03 -> VT_NGUOI_DUNG
(23, 7, 4, CURRENT_TIMESTAMP, NULL), -- user04 -> VT_NGUOI_DUNG
(24, 7, 5, CURRENT_TIMESTAMP, NULL), -- user05 -> VT_NGUOI_DUNG
(25, 8, 12, CURRENT_TIMESTAMP, NULL); -- guest -> VT_GUEST

-- Insert Ho So Di Nuoc Ngoai (Applications)
INSERT INTO ho_so_di_nuoc_ngoai (
    nguoi_dung_id, loai_ho_so_id, quoc_gia_den_id, 
    muc_dich_cong_tac, noi_dung_chuyen_di, 
    ngay_bat_dau, ngay_ket_thuc, 
    ngan_sach_du_kien, nguon_kinh_phi,
    trang_thai_hien_tai_id, ngay_tao, nguoi_tao_id
) VALUES
-- Há»“ sÆ¡ Ä‘Ã£ duyá»‡t
(6, 1, 1, 'Há»c táº­p nghiÃªn cá»©u AI', 'Tham gia khÃ³a há»c AI vÃ  Machine Learning táº¡i Äáº¡i há»c Tokyo', '2025-12-01', '2026-05-31', 50000000, 'NgÃ¢n sÃ¡ch nhÃ  nÆ°á»›c', 3, CURRENT_TIMESTAMP - INTERVAL '30 days', 6),
(7, 2, 2, 'NghiÃªn cá»©u khoa há»c', 'NghiÃªn cá»©u vá» Blockchain táº¡i MIT', '2025-11-15', '2026-02-15', 80000000, 'Quá»¹ nghiÃªn cá»©u', 3, CURRENT_TIMESTAMP - INTERVAL '25 days', 7),
(9, 3, 3, 'Tham dá»± há»™i tháº£o', 'Há»™i tháº£o Kinh táº¿ Quá»‘c táº¿ táº¡i London', '2025-12-10', '2025-12-17', 30000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 3, CURRENT_TIMESTAMP - INTERVAL '20 days', 9),
(11, 4, 4, 'ÄÃ o táº¡o nghiá»‡p vá»¥', 'KhÃ³a Ä‘Ã o táº¡o Giáº£ng dáº¡y Tiáº¿ng PhÃ¡p táº¡i Paris', '2026-01-05', '2026-02-05', 40000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 3, CURRENT_TIMESTAMP - INTERVAL '15 days', 11),
(13, 2, 5, 'NghiÃªn cá»©u HÃ³a há»c', 'NghiÃªn cá»©u HÃ³a sinh táº¡i Äáº¡i há»c Berlin', '2026-02-01', '2026-07-31', 60000000, 'Há»£p tÃ¡c quá»‘c táº¿', 3, CURRENT_TIMESTAMP - INTERVAL '10 days', 13),

-- Há»“ sÆ¡ Ä‘ang xá»­ lÃ½
(8, 3, 6, 'Tham dá»± há»™i nghá»‹', 'Há»™i nghá»‹ CÃ´ng nghá»‡ CNTT ChÃ¢u Ã táº¡i Seoul', '2026-01-20', '2026-01-25', 25000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 2, CURRENT_TIMESTAMP - INTERVAL '5 days', 8),
(10, 5, 7, 'LÃ m viá»‡c vá»›i Ä‘á»‘i tÃ¡c', 'LÃ m viá»‡c vá»›i trÆ°á»ng ÄH Báº¯c Kinh vá» há»£p tÃ¡c Ä‘Ã o táº¡o', '2026-02-10', '2026-02-20', 20000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 2, CURRENT_TIMESTAMP - INTERVAL '4 days', 10),
(12, 1, 8, 'Há»c táº­p nÃ¢ng cao', 'KhÃ³a há»c NgÃ´n ngá»¯ há»c á»©ng dá»¥ng táº¡i Singapore', '2026-03-01', '2026-08-31', 45000000, 'Tá»± tÃºc', 2, CURRENT_TIMESTAMP - INTERVAL '3 days', 12),
(14, 2, 9, 'NghiÃªn cá»©u Váº­t lÃ½', 'NghiÃªn cá»©u Váº­t lÃ½ háº¡t nhÃ¢n táº¡i Sydney', '2026-04-01', '2026-09-30', 70000000, 'Quá»¹ nghiÃªn cá»©u', 2, CURRENT_TIMESTAMP - INTERVAL '2 days', 14),
(15, 3, 10, 'Tham dá»± há»™i tháº£o', 'Há»™i tháº£o Sinh há»c phÃ¢n tá»­ táº¡i Toronto', '2026-03-15', '2026-03-22', 35000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 2, CURRENT_TIMESTAMP - INTERVAL '1 day', 15),

-- Há»“ sÆ¡ chá» duyá»‡t
(6, 5, 11, 'CÃ´ng tÃ¡c kháº£o sÃ¡t', 'Kháº£o sÃ¡t chÆ°Æ¡ng trÃ¬nh Ä‘Ã o táº¡o táº¡i Bangkok', '2026-05-01', '2026-05-10', 15000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 1, CURRENT_TIMESTAMP, 6),
(7, 3, 12, 'Tham dá»± workshop', 'Workshop vá» Blockchain táº¡i Kuala Lumpur', '2026-04-15', '2026-04-18', 12000000, 'NgÃ¢n sÃ¡ch khoa', 1, CURRENT_TIMESTAMP, 7),
(9, 2, 13, 'NghiÃªn cá»©u kinh táº¿', 'NghiÃªn cá»©u Kinh táº¿ sá»‘ táº¡i Rome', '2026-06-01', '2026-11-30', 65000000, 'Há»£p tÃ¡c quá»‘c táº¿', 1, CURRENT_TIMESTAMP, 9),
(11, 1, 14, 'Há»c tiáº¿ng TÃ¢y Ban Nha', 'KhÃ³a há»c tiáº¿ng TÃ¢y Ban Nha táº¡i Madrid', '2026-07-01', '2026-12-31', 55000000, 'Tá»± tÃºc', 1, CURRENT_TIMESTAMP, 11),
(13, 4, 15, 'ÄÃ o táº¡o ngáº¯n háº¡n', 'ÄÃ o táº¡o PhÆ°Æ¡ng phÃ¡p nghiÃªn cá»©u táº¡i Amsterdam', '2026-05-15', '2026-06-15', 38000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 1, CURRENT_TIMESTAMP, 13),

-- Há»“ sÆ¡ tá»« chá»‘i
(8, 1, 1, 'Há»c tháº¡c sÄ©', 'Há»c tháº¡c sÄ© CNTT táº¡i Tokyo', '2026-09-01', '2028-08-31', 150000000, 'Tá»± tÃºc', 4, CURRENT_TIMESTAMP - INTERVAL '45 days', 8),
(10, 2, 2, 'NghiÃªn cá»©u sau tiáº¿n sÄ©', 'NghiÃªn cá»©u sau tiáº¿n sÄ© táº¡i Harvard', '2026-08-01', '2027-07-31', 200000000, 'Há»c bá»•ng', 4, CURRENT_TIMESTAMP - INTERVAL '40 days', 10),

-- Há»“ sÆ¡ Ä‘Ã£ hoÃ n thÃ nh
(6, 3, 6, 'Há»™i tháº£o CNTT', 'Há»™i tháº£o CÃ´ng nghá»‡ AI táº¡i Seoul', '2025-10-05', '2025-10-10', 22000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 6, CURRENT_TIMESTAMP - INTERVAL '50 days', 6),
(7, 4, 8, 'ÄÃ o táº¡o JavaScript', 'KhÃ³a Ä‘Ã o táº¡o JavaScript nÃ¢ng cao táº¡i Singapore', '2025-09-15', '2025-10-15', 35000000, 'NgÃ¢n sÃ¡ch khoa', 6, CURRENT_TIMESTAMP - INTERVAL '48 days', 7),
(9, 5, 11, 'CÃ´ng tÃ¡c kÃ½ káº¿t', 'CÃ´ng tÃ¡c kÃ½ káº¿t há»£p tÃ¡c vá»›i ÄH Bangkok', '2025-10-20', '2025-10-25', 18000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 6, CURRENT_TIMESTAMP - INTERVAL '42 days', 9),

-- ThÃªm há»“ sÆ¡ má»›i
(12, 2, 1, 'NghiÃªn cá»©u ngÃ´n ngá»¯', 'NghiÃªn cá»©u NgÃ´n ngá»¯ há»c so sÃ¡nh táº¡i Tokyo', '2026-08-01', '2027-01-31', 58000000, 'Há»c bá»•ng', 1, CURRENT_TIMESTAMP, 12),
(14, 5, 3, 'LÃ m viá»‡c há»£p tÃ¡c', 'Há»£p tÃ¡c nghiÃªn cá»©u vá»›i ÄH Cambridge', '2026-07-15', '2026-08-15', 42000000, 'Quá»¹ há»£p tÃ¡c', 1, CURRENT_TIMESTAMP, 14),
(15, 3, 4, 'Há»™i nghá»‹ sinh há»c', 'Há»™i nghá»‹ Sinh há»c Quá»‘c táº¿ táº¡i Paris', '2026-06-20', '2026-06-27', 28000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 1, CURRENT_TIMESTAMP, 15),
(16, 1, 5, 'Há»c cao há»c', 'ChÆ°Æ¡ng trÃ¬nh cao há»c Quáº£n lÃ½ táº¡i Berlin', '2026-10-01', '2028-09-30', 120000000, 'Há»c bá»•ng', 1, CURRENT_TIMESTAMP, 16),
(17, 4, 7, 'ÄÃ o táº¡o káº¿ toÃ¡n', 'ÄÃ o táº¡o Káº¿ toÃ¡n quá»‘c táº¿ táº¡i Báº¯c Kinh', '2026-09-10', '2026-10-10', 32000000, 'NgÃ¢n sÃ¡ch phÃ²ng', 1, CURRENT_TIMESTAMP, 17),
(18, 2, 9, 'NghiÃªn cá»©u chÃ­nh sÃ¡ch', 'NghiÃªn cá»©u ChÃ­nh sÃ¡ch khoa há»c táº¡i Melbourne', '2026-11-01', '2027-04-30', 72000000, 'Quá»¹ nghiÃªn cá»©u', 1, CURRENT_TIMESTAMP, 18),
(19, 3, 10, 'Há»™i tháº£o há»£p tÃ¡c', 'Há»™i tháº£o Há»£p tÃ¡c Quá»‘c táº¿ táº¡i Vancouver', '2026-08-25', '2026-08-30', 33000000, 'NgÃ¢n sÃ¡ch phÃ²ng', 1, CURRENT_TIMESTAMP, 19),
(20, 5, 12, 'CÃ´ng tÃ¡c trao Ä‘á»•i', 'Trao Ä‘á»•i kinh nghiá»‡m giáº£ng dáº¡y táº¡i KL', '2026-10-15', '2026-10-22', 16000000, 'NgÃ¢n sÃ¡ch khoa', 1, CURRENT_TIMESTAMP, 20),
(21, 1, 13, 'Há»c tiáº¿ng Ã', 'KhÃ³a há»c tiáº¿ng Ã táº¡i Rome', '2026-12-01', '2027-05-31', 48000000, 'Tá»± tÃºc', 1, CURRENT_TIMESTAMP, 21),
(22, 4, 14, 'ÄÃ o táº¡o giáº£ng viÃªn', 'ÄÃ o táº¡o PhÆ°Æ¡ng phÃ¡p giáº£ng dáº¡y táº¡i Barcelona', '2027-01-10', '2027-02-10', 36000000, 'NgÃ¢n sÃ¡ch trÆ°á»ng', 1, CURRENT_TIMESTAMP, 22);

-- Insert Quy Trinh Phe Duyet (Approval Workflows)
INSERT INTO quy_trinh_phe_duyet (ho_so_id, buoc_hien_tai, nguoi_duyet_hien_tai_id, ngay_bat_dau) VALUES
-- Workflows cho há»“ sÆ¡ Ä‘Ã£ duyá»‡t (completed workflows)
(1, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '25 days'),
(3, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(4, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(5, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '10 days'),

-- Workflows cho há»“ sÆ¡ Ä‘ang xá»­ lÃ½
(6, 2, 4, CURRENT_TIMESTAMP - INTERVAL '5 days'),  -- Äang á»Ÿ TrÆ°á»Ÿng khoa
(7, 2, 5, CURRENT_TIMESTAMP - INTERVAL '4 days'),  -- Äang á»Ÿ TrÆ°á»Ÿng khoa
(8, 2, 4, CURRENT_TIMESTAMP - INTERVAL '3 days'),  -- Äang á»Ÿ TrÆ°á»Ÿng khoa
(9, 3, 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),  -- Äang á»Ÿ TCHC
(10, 2, 4, CURRENT_TIMESTAMP - INTERVAL '1 day'),  -- Äang á»Ÿ TrÆ°á»Ÿng khoa

-- Workflows cho há»“ sÆ¡ chá» duyá»‡t
(11, 1, 4, CURRENT_TIMESTAMP),  -- Chá» TrÆ°á»Ÿng khoa
(12, 1, 4, CURRENT_TIMESTAMP),
(13, 1, 5, CURRENT_TIMESTAMP),
(14, 1, 4, CURRENT_TIMESTAMP),
(15, 1, 4, CURRENT_TIMESTAMP);

-- Insert Lich Su Phe Duyet (Approval History)
INSERT INTO lich_su_phe_duyet (
    ho_so_id, buoc_phe_duyet, nguoi_duyet_id, 
    hanh_dong, ghi_chu, ngay_thuc_hien
) VALUES
-- Lá»‹ch sá»­ cho há»“ sÆ¡ 1 (Ä‘Ã£ duyá»‡t)
(1, 1, 4, 'approve', 'Äá»“ng Ã½ cho phÃ©p. Há»“ sÆ¡ Ä‘áº§y Ä‘á»§.', CURRENT_TIMESTAMP - INTERVAL '29 days'),
(1, 2, 3, 'approve', 'ÄÃ£ kiá»ƒm tra vÃ  Ä‘á»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '28 days'),
(1, 3, 2, 'approve', 'BGH phÃª duyá»‡t. ChÃºc thÃ nh cÃ´ng.', CURRENT_TIMESTAMP - INTERVAL '27 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ 2 (Ä‘Ã£ duyá»‡t)
(2, 1, 4, 'approve', 'Há»“ sÆ¡ tá»‘t. Äá»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '24 days'),
(2, 2, 3, 'approve', 'PhÃª duyá»‡t.', CURRENT_TIMESTAMP - INTERVAL '23 days'),
(2, 3, 2, 'approve', 'BGH Ä‘á»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '22 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ 3 (Ä‘Ã£ duyá»‡t)
(3, 1, 5, 'approve', 'Äá»“ng Ã½ cho tham dá»±.', CURRENT_TIMESTAMP - INTERVAL '19 days'),
(3, 2, 3, 'approve', 'OK.', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(3, 3, 2, 'approve', 'PhÃª duyá»‡t.', CURRENT_TIMESTAMP - INTERVAL '17 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ 4 (Ä‘Ã£ duyá»‡t)
(4, 1, 4, 'approve', 'Äá»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(4, 2, 3, 'approve', 'PhÃª duyá»‡t.', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(4, 3, 2, 'approve', 'BGH Ä‘á»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '12 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ 5 (Ä‘Ã£ duyá»‡t)
(5, 1, 4, 'approve', 'Há»“ sÆ¡ Ä‘áº§y Ä‘á»§. Äá»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(5, 2, 3, 'approve', 'PhÃª duyá»‡t.', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(5, 3, 2, 'approve', 'Äá»“ng Ã½.', CURRENT_TIMESTAMP - INTERVAL '7 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ Ä‘ang xá»­ lÃ½
(6, 1, 4, 'approve', 'Äá»“ng Ã½ cho tham dá»±.', CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- Lá»‹ch sá»­ cho há»“ sÆ¡ tá»« chá»‘i
(16, 1, 4, 'reject', 'NgÃ¢n sÃ¡ch khÃ´ng Ä‘á»§. Äá» nghá»‹ xem xÃ©t láº¡i.', CURRENT_TIMESTAMP - INTERVAL '44 days'),
(17, 1, 5, 'reject', 'ChÆ°a Ä‘Ãºng thá»i Ä‘iá»ƒm. Äá» nghá»‹ ná»™p láº¡i sau.', CURRENT_TIMESTAMP - INTERVAL '39 days');

-- Insert File Dinh Kem (Attached Files) - Fixed: using ten_file_goc, ten_file_luu, duong_dan_file
INSERT INTO file_dinh_kem (
    ho_so_id, loai_file, ten_file_goc, ten_file_luu, duong_dan_file,
    kich_thuoc, dinh_dang, mo_ta, nguoi_upload_id, ngay_upload
) VALUES
-- Files cho há»“ sÆ¡ 1
(1, 'don_xin_phep', 'don_xin_phep_di_nhat.pdf', '20251027_don_xin_phep_6.pdf', '/uploads/hoso/1/', 245678, 'pdf', 'ÄÆ¡n xin phÃ©p Ä‘i Nháº­t Báº£n', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(1, 'giay_moi', 'invitation_letter_tokyo_univ.pdf', '20251027_invitation_6.pdf', '/uploads/hoso/1/', 189234, 'pdf', 'ThÆ° má»i tá»« Äáº¡i há»c Tokyo', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(1, 'ke_hoach', 'ke_hoach_hoc_tap_AI.docx', '20251027_kehoach_6.docx', '/uploads/hoso/1/', 156789, 'docx', 'Káº¿ hoáº¡ch há»c táº­p chi tiáº¿t', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),

-- Files cho há»“ sÆ¡ 2
(2, 'don_xin_phep', 'application_MIT_research.pdf', '20251101_application_7.pdf', '/uploads/hoso/2/', 298765, 'pdf', 'ÄÆ¡n xin nghiÃªn cá»©u táº¡i MIT', 7, CURRENT_TIMESTAMP - INTERVAL '25 days'),
(2, 'giay_moi', 'invitation_MIT.pdf', '20251101_invitation_7.pdf', '/uploads/hoso/2/', 234567, 'pdf', 'ThÆ° má»i tá»« MIT', 7, CURRENT_TIMESTAMP - INTERVAL '25 days'),

-- Files cho há»“ sÆ¡ 3
(3, 'don_xin_phep', 'don_tham_du_hoi_thao_london.pdf', '20251106_don_9.pdf', '/uploads/hoso/3/', 178234, 'pdf', 'ÄÆ¡n tham dá»± há»™i tháº£o', 9, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(3, 'chuong_trinh', 'conference_program_london.pdf', '20251106_program_9.pdf', '/uploads/hoso/3/', 456789, 'pdf', 'ChÆ°Æ¡ng trÃ¬nh há»™i tháº£o', 9, CURRENT_TIMESTAMP - INTERVAL '20 days'),

-- Files cho há»“ sÆ¡ 4
(4, 'don_xin_phep', 'don_xin_dao_tao_paris.pdf', '20251111_don_11.pdf', '/uploads/hoso/4/', 198765, 'pdf', 'ÄÆ¡n xin Ä‘Ã o táº¡o', 11, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(4, 'ke_hoach', 'training_plan_french.docx', '20251111_plan_11.docx', '/uploads/hoso/4/', 134567, 'docx', 'Káº¿ hoáº¡ch Ä‘Ã o táº¡o', 11, CURRENT_TIMESTAMP - INTERVAL '15 days'),

-- Files cho há»“ sÆ¡ 5
(5, 'don_xin_phep', 'don_nghien_cuu_berlin.pdf', '20251116_don_13.pdf', '/uploads/hoso/5/', 223456, 'pdf', 'ÄÆ¡n xin nghiÃªn cá»©u', 13, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(5, 'de_cuong', 'research_proposal_chemistry.pdf', '20251116_proposal_13.pdf', '/uploads/hoso/5/', 567890, 'pdf', 'Äá» cÆ°Æ¡ng nghiÃªn cá»©u', 13, CURRENT_TIMESTAMP - INTERVAL '10 days'),

-- Files cho há»“ sÆ¡ Ä‘ang xá»­ lÃ½
(6, 'don_xin_phep', 'don_hoi_nghi_seoul.pdf', '20251121_don_8.pdf', '/uploads/hoso/6/', 167234, 'pdf', 'ÄÆ¡n tham dá»± há»™i nghá»‹', 8, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 'don_xin_phep', 'don_cong_tac_beijing.pdf', '20251122_don_10.pdf', '/uploads/hoso/7/', 145678, 'pdf', 'ÄÆ¡n cÃ´ng tÃ¡c', 10, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(8, 'don_xin_phep', 'don_hoc_tap_singapore.pdf', '20251123_don_12.pdf', '/uploads/hoso/8/', 189456, 'pdf', 'ÄÆ¡n há»c táº­p', 12, CURRENT_TIMESTAMP - INTERVAL '3 days'),

-- Files cho há»“ sÆ¡ chá» duyá»‡t
(11, 'don_xin_phep', 'don_khao_sat_bangkok.pdf', '20251126_don_6.pdf', '/uploads/hoso/11/', 123456, 'pdf', 'ÄÆ¡n kháº£o sÃ¡t', 6, CURRENT_TIMESTAMP),
(12, 'don_xin_phep', 'don_workshop_kl.pdf', '20251126_don_7.pdf', '/uploads/hoso/12/', 134567, 'pdf', 'ÄÆ¡n tham dá»± workshop', 7, CURRENT_TIMESTAMP);

-- Insert Nhat Ky He Thong (Audit Logs)
INSERT INTO nhatkyhethong (
    nguoi_dung_id, hanh_dong, bang_du_lieu, 
    ban_ghi_id, noi_dung, ip_address, user_agent
) VALUES
(1, 'LOGIN', 'nguoi_dung', 1, 'Admin Ä‘Äƒng nháº­p há»‡ thá»‘ng', '192.168.1.100', 'Mozilla/5.0'),
(6, 'CREATE', 'ho_so_di_nuoc_ngoai', 1, 'Táº¡o há»“ sÆ¡ Ä‘i Nháº­t Báº£n', '192.168.1.101', 'Chrome/120.0'),
(4, 'UPDATE', 'quy_trinh_phe_duyet', 1, 'PhÃª duyá»‡t há»“ sÆ¡ ID 1', '192.168.1.102', 'Chrome/120.0'),
(7, 'CREATE', 'ho_so_di_nuoc_ngoai', 2, 'Táº¡o há»“ sÆ¡ Ä‘i Má»¹', '192.168.1.103', 'Firefox/121.0'),
(3, 'UPDATE', 'quy_trinh_phe_duyet', 2, 'Chuyá»ƒn há»“ sÆ¡ ID 2 lÃªn BGH', '192.168.1.104', 'Chrome/120.0'),
(2, 'UPDATE', 'ho_so_di_nuoc_ngoai', 2, 'BGH phÃª duyá»‡t há»“ sÆ¡ ID 2', '192.168.1.105', 'Safari/17.0'),
(9, 'CREATE', 'ho_so_di_nuoc_ngoai', 3, 'Táº¡o há»“ sÆ¡ tham dá»± há»™i tháº£o London', '192.168.1.106', 'Chrome/120.0'),
(1, 'UPDATE', 'dm_vai_tro', 1, 'Cáº­p nháº­t quyá»n admin', '192.168.1.100', 'Mozilla/5.0'),
(11, 'CREATE', 'ho_so_di_nuoc_ngoai', 4, 'Táº¡o há»“ sÆ¡ Ä‘Ã o táº¡o Paris', '192.168.1.107', 'Edge/120.0'),
(13, 'CREATE', 'ho_so_di_nuoc_ngoai', 5, 'Táº¡o há»“ sÆ¡ nghiÃªn cá»©u Berlin', '192.168.1.108', 'Chrome/120.0'),
(8, 'CREATE', 'ho_so_di_nuoc_ngoai', 6, 'Táº¡o há»“ sÆ¡ há»™i nghá»‹ Seoul', '192.168.1.109', 'Chrome/120.0'),
(10, 'CREATE', 'ho_so_di_nuoc_ngoai', 7, 'Táº¡o há»“ sÆ¡ cÃ´ng tÃ¡c Báº¯c Kinh', '192.168.1.110', 'Firefox/121.0'),
(12, 'CREATE', 'ho_so_di_nuoc_ngoai', 8, 'Táº¡o há»“ sÆ¡ há»c táº­p Singapore', '192.168.1.111', 'Safari/17.0'),
(1, 'VIEW', 'ho_so_di_nuoc_ngoai', NULL, 'Xem danh sÃ¡ch há»“ sÆ¡', '192.168.1.100', 'Mozilla/5.0'),
(3, 'EXPORT', 'bao_cao', NULL, 'Xuáº¥t bÃ¡o cÃ¡o thá»‘ng kÃª', '192.168.1.104', 'Chrome/120.0');

-- Display success message
SELECT 'Sample data inserted successfully!' as message,
       (SELECT COUNT(*) FROM dm_vai_tro) as vai_tro_count,
       (SELECT COUNT(*) FROM dm_don_vi) as don_vi_count,
       (SELECT COUNT(*) FROM dm_quoc_gia) as quoc_gia_count,
       (SELECT COUNT(*) FROM nguoi_dung) as nguoi_dung_count,
       (SELECT COUNT(*) FROM phan_quyen) as phan_quyen_count,
       (SELECT COUNT(*) FROM ho_so_di_nuoc_ngoai) as ho_so_count,
       (SELECT COUNT(*) FROM file_dinh_kem) as file_count,
       (SELECT COUNT(*) FROM nhatkyhethong) as log_count;
