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
('VT_ADMIN', 'Quản trị viên', 'Quản trị hệ thống, có toàn quyền truy cập', true),
('VT_BGH', 'Ban giám hiệu', 'Lãnh đạo trường, phê duyệt cuối cùng', true),
('VT_TCHC', 'Trưởng phòng Tổ chức', 'Quản lý và xét duyệt hồ sơ', true),
('VT_TRUONG_KHOA', 'Trưởng khoa', 'Xét duyệt hồ sơ của khoa', true),
('VT_GIANG_VIEN', 'Giảng viên', 'Nộp hồ sơ đi công tác', true),
('VT_NHAN_VIEN', 'Nhân viên', 'Nộp hồ sơ đi công tác', true),
('VT_NGUOI_DUNG', 'Người dùng', 'Người dùng thông thường', true),
('VT_GUEST', 'Khách', 'Xem thông tin công khai', true);

-- Insert Don Vi (Departments)
INSERT INTO dm_don_vi (ma_don_vi, ten_don_vi, ten_day_du, loai_don_vi, don_vi_cha_id, dien_thoai, email, dia_chi, nguoi_phu_trach, is_active) VALUES
('DV_CNTT', 'Khoa CNTT', 'Khoa Công nghệ Thông tin', 'khoa', NULL, '0241234567', 'cntt@vienkhcn.edu.vn', 'Tầng 3, Nhà A', 'TS. Nguyễn Văn A', true),
('DV_KTOAN', 'Khoa Kinh tế', 'Khoa Kinh tế và Quản trị', 'khoa', NULL, '0241234568', 'ktoan@vienkhcn.edu.vn', 'Tầng 2, Nhà B', 'TS. Trần Thị B', true),
('DV_NGOAI_NGU', 'Khoa Ngoại ngữ', 'Khoa Ngoại ngữ và Văn hóa', 'khoa', NULL, '0241234569', 'nn@vienkhcn.edu.vn', 'Tầng 4, Nhà C', 'PGS. Lê Văn C', true),
('DV_HOA', 'Khoa Hóa', 'Khoa Hóa học', 'khoa', NULL, '0241234570', 'hoa@vienkhcn.edu.vn', 'Tầng 1, Nhà D', 'PGS.TS Phạm Văn D', true),
('DV_VAT_LY', 'Khoa Vật lý', 'Khoa Vật lý và Công nghệ', 'khoa', NULL, '0241234571', 'vatly@vienkhcn.edu.vn', 'Tầng 5, Nhà E', 'TS. Hoàng Thị E', true),
('DV_SINH', 'Khoa Sinh', 'Khoa Sinh học và Môi trường', 'khoa', NULL, '0241234572', 'sinh@vienkhcn.edu.vn', 'Tầng 2, Nhà F', 'PGS. Vũ Văn F', true),
('DV_TCHC', 'Phòng TCHC', 'Phòng Tổ chức Hành chính', 'phong', NULL, '0241234573', 'tchc@vienkhcn.edu.vn', 'Tầng 1, Nhà A', 'Nguyễn Thị G', true),
('DV_KHTC', 'Phòng KHTC', 'Phòng Kế hoạch Tài chính', 'phong', NULL, '0241234574', 'khtc@vienkhcn.edu.vn', 'Tầng 1, Nhà B', 'Trần Văn H', true),
('DV_QLKH', 'Phòng QLKH', 'Phòng Quản lý Khoa học', 'phong', NULL, '0241234575', 'qlkh@vienkhcn.edu.vn', 'Tầng 2, Nhà A', 'Lê Thị I', true),
('DV_HTQT', 'Phòng HTQT', 'Phòng Hợp tác Quốc tế', 'phong', NULL, '0241234576', 'htqt@vienkhcn.edu.vn', 'Tầng 3, Nhà B', 'Phạm Văn K', true),
('DV_BGH', 'Ban Giám hiệu', 'Ban Giám hiệu Trường', 'ban', NULL, '0241234500', 'bgh@vienkhcn.edu.vn', 'Tầng 5, Nhà A', 'PGS.TS Nguyễn Văn L', true),
('DV_KHAC', 'Đơn vị khác', 'Các đơn vị khác', 'phong', NULL, NULL, NULL, NULL, NULL, true);

-- Insert Quoc Gia (Countries)
INSERT INTO dm_quoc_gia (ma_quoc_gia, ten_quoc_gia, ten_tieng_anh, chau_luc, is_active) VALUES
('JP', 'Nhật Bản', 'Japan', 'Asia', true),
('US', 'Hoa Kỳ', 'United States', 'North America', true),
('GB', 'Anh', 'United Kingdom', 'Europe', true),
('FR', 'Pháp', 'France', 'Europe', true),
('DE', 'Đức', 'Germany', 'Europe', true),
('KR', 'Hàn Quốc', 'South Korea', 'Asia', true),
('CN', 'Trung Quốc', 'China', 'Asia', true),
('SG', 'Singapore', 'Singapore', 'Asia', true),
('AU', 'Úc', 'Australia', 'Oceania', true),
('CA', 'Canada', 'Canada', 'North America', true),
('TH', 'Thái Lan', 'Thailand', 'Asia', true),
('MY', 'Malaysia', 'Malaysia', 'Asia', true),
('IT', 'Ý', 'Italy', 'Europe', true),
('ES', 'Tây Ban Nha', 'Spain', 'Europe', true),
('NL', 'Hà Lan', 'Netherlands', 'Europe', true);

-- Insert Loai Ho So (Application Types)
INSERT INTO dm_loai_ho_so (ma_loai_ho_so, ten_loai_ho_so, mo_ta, yeu_cau_phe_duyet, is_active) VALUES
('LHS_HOC_TAP', 'Học tập', 'Đi học tập, đào tạo nâng cao trình độ', true, true),
('LHS_NGHIEN_CUU', 'Nghiên cứu', 'Đi nghiên cứu khoa học', true, true),
('LHS_HOI_THAO', 'Hội thảo', 'Tham dự hội thảo, hội nghị quốc tế', true, true),
('LHS_DAO_TAO', 'Đào tạo', 'Đi đào tạo ngắn hạn, tập huấn', true, true),
('LHS_LAM_VIEC', 'Làm việc', 'Công tác, làm việc với đối tác', true, true);

-- Insert Trang Thai (Status)
INSERT INTO dm_trang_thai (ma_trang_thai, ten_trang_thai, mau_sac, mo_ta, loai_trang_thai, is_active) VALUES
('CHO_DUYET', 'Chờ duyệt', '#FFA500', 'Hồ sơ đang chờ phê duyệt', 'ho_so', true),
('DANG_XU_LY', 'Đang xử lý', '#2196F3', 'Hồ sơ đang được xử lý', 'ho_so', true),
('DA_DUYET', 'Đã duyệt', '#4CAF50', 'Hồ sơ đã được phê duyệt', 'ho_so', true),
('TU_CHOI', 'Từ chối', '#F44336', 'Hồ sơ bị từ chối', 'ho_so', true),
('HUY_BO', 'Hủy bỏ', '#9E9E9E', 'Hồ sơ đã bị hủy', 'ho_so', true),
('HOAN_THANH', 'Hoàn thành', '#009688', 'Đã hoàn thành chuyến đi', 'ho_so', true);

-- Insert Nguoi Dung (Users) with bcrypt hashed password 'password123'
INSERT INTO nguoi_dung (username, password_hash, ho_ten, email, dien_thoai, don_vi_id, trang_thai, ngay_tao) VALUES
('admin', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyễn Văn Admin', 'admin@vienkhcn.edu.vn', '0901234567', 7, 'active', CURRENT_TIMESTAMP),
('bgh_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'PGS.TS Nguyễn Văn L', 'nvl@vienkhcn.edu.vn', '0901234568', 11, 'active', CURRENT_TIMESTAMP),
('tchc_nguyen', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyễn Thị G', 'ntg@vienkhcn.edu.vn', '0901234569', 7, 'active', CURRENT_TIMESTAMP),
('truongkhoa_cntt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Nguyễn Văn A', 'nva@vienkhcn.edu.vn', '0901234570', 1, 'active', CURRENT_TIMESTAMP),
('truongkhoa_kt', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'TS. Trần Thị B', 'ttb@vienkhcn.edu.vn', '0901234571', 2, 'active', CURRENT_TIMESTAMP),
('gv_cntt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Lê Văn Minh', 'lvm@vienkhcn.edu.vn', '0901234572', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Phạm Thị Hương', 'pth@vienkhcn.edu.vn', '0901234573', 1, 'active', CURRENT_TIMESTAMP),
('gv_cntt_03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Hoàng Văn Đức', 'hvd@vienkhcn.edu.vn', '0901234574', 1, 'active', CURRENT_TIMESTAMP),
('gv_kt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Vũ Thị Mai', 'vtm@vienkhcn.edu.vn', '0901234575', 2, 'active', CURRENT_TIMESTAMP),
('gv_kt_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Đặng Văn Nam', 'dvn@vienkhcn.edu.vn', '0901234576', 2, 'active', CURRENT_TIMESTAMP),
('gv_nn_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Bùi Thị Lan', 'btl@vienkhcn.edu.vn', '0901234577', 3, 'active', CURRENT_TIMESTAMP),
('gv_nn_02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Trịnh Văn Hải', 'tvh@vienkhcn.edu.vn', '0901234578', 3, 'active', CURRENT_TIMESTAMP),
('gv_hoa_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Ngô Thị Hoa', 'nth@vienkhcn.edu.vn', '0901234579', 4, 'active', CURRENT_TIMESTAMP),
('gv_ly_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Phan Văn Tùng', 'pvt@vienkhcn.edu.vn', '0901234580', 5, 'active', CURRENT_TIMESTAMP),
('gv_sinh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Đinh Thị Thu', 'dtt@vienkhcn.edu.vn', '0901234581', 6, 'active', CURRENT_TIMESTAMP),
('nv_tchc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Lý Văn Phúc', 'lvp@vienkhcn.edu.vn', '0901234582', 7, 'active', CURRENT_TIMESTAMP),
('nv_khtc_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Mai Thị Ngọc', 'mtn@vienkhcn.edu.vn', '0901234583', 8, 'active', CURRENT_TIMESTAMP),
('nv_qlkh_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Đỗ Văn Thành', 'dvt@vienkhcn.edu.vn', '0901234584', 9, 'active', CURRENT_TIMESTAMP),
('nv_htqt_01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Cao Thị Hồng', 'cth@vienkhcn.edu.vn', '0901234585', 10, 'active', CURRENT_TIMESTAMP),
('user01', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Nguyễn Văn X', 'nvx@vienkhcn.edu.vn', '0901234586', 1, 'active', CURRENT_TIMESTAMP),
('user02', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Trần Thị Y', 'tty@vienkhcn.edu.vn', '0901234587', 2, 'active', CURRENT_TIMESTAMP),
('user03', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Lê Văn Z', 'lvz@vienkhcn.edu.vn', '0901234588', 3, 'active', CURRENT_TIMESTAMP),
('user04', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Phạm Thị K', 'ptk@vienkhcn.edu.vn', '0901234589', 4, 'active', CURRENT_TIMESTAMP),
('user05', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Hoàng Văn M', 'hvm@vienkhcn.edu.vn', '0901234590', 5, 'active', CURRENT_TIMESTAMP),
('guest', '$2b$10$rH5Lqv3xJJZJZ5QZ5QZ5QeZJZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5QZ5Q', 'Khách', 'guest@vienkhcn.edu.vn', NULL, 12, 'active', CURRENT_TIMESTAMP);

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
-- Hồ sơ đã duyệt
(6, 1, 1, 'Học tập nghiên cứu AI', 'Tham gia khóa học AI và Machine Learning tại Đại học Tokyo', '2025-12-01', '2026-05-31', 50000000, 'Ngân sách nhà nước', 3, CURRENT_TIMESTAMP - INTERVAL '30 days', 6),
(7, 2, 2, 'Nghiên cứu khoa học', 'Nghiên cứu về Blockchain tại MIT', '2025-11-15', '2026-02-15', 80000000, 'Quỹ nghiên cứu', 3, CURRENT_TIMESTAMP - INTERVAL '25 days', 7),
(9, 3, 3, 'Tham dự hội thảo', 'Hội thảo Kinh tế Quốc tế tại London', '2025-12-10', '2025-12-17', 30000000, 'Ngân sách trường', 3, CURRENT_TIMESTAMP - INTERVAL '20 days', 9),
(11, 4, 4, 'Đào tạo nghiệp vụ', 'Khóa đào tạo Giảng dạy Tiếng Pháp tại Paris', '2026-01-05', '2026-02-05', 40000000, 'Ngân sách trường', 3, CURRENT_TIMESTAMP - INTERVAL '15 days', 11),
(13, 2, 5, 'Nghiên cứu Hóa học', 'Nghiên cứu Hóa sinh tại Đại học Berlin', '2026-02-01', '2026-07-31', 60000000, 'Hợp tác quốc tế', 3, CURRENT_TIMESTAMP - INTERVAL '10 days', 13),

-- Hồ sơ đang xử lý
(8, 3, 6, 'Tham dự hội nghị', 'Hội nghị Công nghệ CNTT Châu Á tại Seoul', '2026-01-20', '2026-01-25', 25000000, 'Ngân sách trường', 2, CURRENT_TIMESTAMP - INTERVAL '5 days', 8),
(10, 5, 7, 'Làm việc với đối tác', 'Làm việc với trường ĐH Bắc Kinh về hợp tác đào tạo', '2026-02-10', '2026-02-20', 20000000, 'Ngân sách trường', 2, CURRENT_TIMESTAMP - INTERVAL '4 days', 10),
(12, 1, 8, 'Học tập nâng cao', 'Khóa học Ngôn ngữ học ứng dụng tại Singapore', '2026-03-01', '2026-08-31', 45000000, 'Tự túc', 2, CURRENT_TIMESTAMP - INTERVAL '3 days', 12),
(14, 2, 9, 'Nghiên cứu Vật lý', 'Nghiên cứu Vật lý hạt nhân tại Sydney', '2026-04-01', '2026-09-30', 70000000, 'Quỹ nghiên cứu', 2, CURRENT_TIMESTAMP - INTERVAL '2 days', 14),
(15, 3, 10, 'Tham dự hội thảo', 'Hội thảo Sinh học phân tử tại Toronto', '2026-03-15', '2026-03-22', 35000000, 'Ngân sách trường', 2, CURRENT_TIMESTAMP - INTERVAL '1 day', 15),

-- Hồ sơ chờ duyệt
(6, 5, 11, 'Công tác khảo sát', 'Khảo sát chương trình đào tạo tại Bangkok', '2026-05-01', '2026-05-10', 15000000, 'Ngân sách trường', 1, CURRENT_TIMESTAMP, 6),
(7, 3, 12, 'Tham dự workshop', 'Workshop về Blockchain tại Kuala Lumpur', '2026-04-15', '2026-04-18', 12000000, 'Ngân sách khoa', 1, CURRENT_TIMESTAMP, 7),
(9, 2, 13, 'Nghiên cứu kinh tế', 'Nghiên cứu Kinh tế số tại Rome', '2026-06-01', '2026-11-30', 65000000, 'Hợp tác quốc tế', 1, CURRENT_TIMESTAMP, 9),
(11, 1, 14, 'Học tiếng Tây Ban Nha', 'Khóa học tiếng Tây Ban Nha tại Madrid', '2026-07-01', '2026-12-31', 55000000, 'Tự túc', 1, CURRENT_TIMESTAMP, 11),
(13, 4, 15, 'Đào tạo ngắn hạn', 'Đào tạo Phương pháp nghiên cứu tại Amsterdam', '2026-05-15', '2026-06-15', 38000000, 'Ngân sách trường', 1, CURRENT_TIMESTAMP, 13),

-- Hồ sơ từ chối
(8, 1, 1, 'Học thạc sĩ', 'Học thạc sĩ CNTT tại Tokyo', '2026-09-01', '2028-08-31', 150000000, 'Tự túc', 4, CURRENT_TIMESTAMP - INTERVAL '45 days', 8),
(10, 2, 2, 'Nghiên cứu sau tiến sĩ', 'Nghiên cứu sau tiến sĩ tại Harvard', '2026-08-01', '2027-07-31', 200000000, 'Học bổng', 4, CURRENT_TIMESTAMP - INTERVAL '40 days', 10),

-- Hồ sơ đã hoàn thành
(6, 3, 6, 'Hội thảo CNTT', 'Hội thảo Công nghệ AI tại Seoul', '2025-10-05', '2025-10-10', 22000000, 'Ngân sách trường', 6, CURRENT_TIMESTAMP - INTERVAL '50 days', 6),
(7, 4, 8, 'Đào tạo JavaScript', 'Khóa đào tạo JavaScript nâng cao tại Singapore', '2025-09-15', '2025-10-15', 35000000, 'Ngân sách khoa', 6, CURRENT_TIMESTAMP - INTERVAL '48 days', 7),
(9, 5, 11, 'Công tác ký kết', 'Công tác ký kết hợp tác với ĐH Bangkok', '2025-10-20', '2025-10-25', 18000000, 'Ngân sách trường', 6, CURRENT_TIMESTAMP - INTERVAL '42 days', 9),

-- Thêm hồ sơ mới
(12, 2, 1, 'Nghiên cứu ngôn ngữ', 'Nghiên cứu Ngôn ngữ học so sánh tại Tokyo', '2026-08-01', '2027-01-31', 58000000, 'Học bổng', 1, CURRENT_TIMESTAMP, 12),
(14, 5, 3, 'Làm việc hợp tác', 'Hợp tác nghiên cứu với ĐH Cambridge', '2026-07-15', '2026-08-15', 42000000, 'Quỹ hợp tác', 1, CURRENT_TIMESTAMP, 14),
(15, 3, 4, 'Hội nghị sinh học', 'Hội nghị Sinh học Quốc tế tại Paris', '2026-06-20', '2026-06-27', 28000000, 'Ngân sách trường', 1, CURRENT_TIMESTAMP, 15),
(16, 1, 5, 'Học cao học', 'Chương trình cao học Quản lý tại Berlin', '2026-10-01', '2028-09-30', 120000000, 'Học bổng', 1, CURRENT_TIMESTAMP, 16),
(17, 4, 7, 'Đào tạo kế toán', 'Đào tạo Kế toán quốc tế tại Bắc Kinh', '2026-09-10', '2026-10-10', 32000000, 'Ngân sách phòng', 1, CURRENT_TIMESTAMP, 17),
(18, 2, 9, 'Nghiên cứu chính sách', 'Nghiên cứu Chính sách khoa học tại Melbourne', '2026-11-01', '2027-04-30', 72000000, 'Quỹ nghiên cứu', 1, CURRENT_TIMESTAMP, 18),
(19, 3, 10, 'Hội thảo hợp tác', 'Hội thảo Hợp tác Quốc tế tại Vancouver', '2026-08-25', '2026-08-30', 33000000, 'Ngân sách phòng', 1, CURRENT_TIMESTAMP, 19),
(20, 5, 12, 'Công tác trao đổi', 'Trao đổi kinh nghiệm giảng dạy tại KL', '2026-10-15', '2026-10-22', 16000000, 'Ngân sách khoa', 1, CURRENT_TIMESTAMP, 20),
(21, 1, 13, 'Học tiếng Ý', 'Khóa học tiếng Ý tại Rome', '2026-12-01', '2027-05-31', 48000000, 'Tự túc', 1, CURRENT_TIMESTAMP, 21),
(22, 4, 14, 'Đào tạo giảng viên', 'Đào tạo Phương pháp giảng dạy tại Barcelona', '2027-01-10', '2027-02-10', 36000000, 'Ngân sách trường', 1, CURRENT_TIMESTAMP, 22);

-- Insert Quy Trinh Phe Duyet (Approval Workflows)
INSERT INTO quy_trinh_phe_duyet (ho_so_id, buoc_hien_tai, nguoi_duyet_hien_tai_id, ngay_bat_dau) VALUES
-- Workflows cho hồ sơ đã duyệt (completed workflows)
(1, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '25 days'),
(3, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(4, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(5, 4, NULL, CURRENT_TIMESTAMP - INTERVAL '10 days'),

-- Workflows cho hồ sơ đang xử lý
(6, 2, 4, CURRENT_TIMESTAMP - INTERVAL '5 days'),  -- Đang ở Trưởng khoa
(7, 2, 5, CURRENT_TIMESTAMP - INTERVAL '4 days'),  -- Đang ở Trưởng khoa
(8, 2, 4, CURRENT_TIMESTAMP - INTERVAL '3 days'),  -- Đang ở Trưởng khoa
(9, 3, 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),  -- Đang ở TCHC
(10, 2, 4, CURRENT_TIMESTAMP - INTERVAL '1 day'),  -- Đang ở Trưởng khoa

-- Workflows cho hồ sơ chờ duyệt
(11, 1, 4, CURRENT_TIMESTAMP),  -- Chờ Trưởng khoa
(12, 1, 4, CURRENT_TIMESTAMP),
(13, 1, 5, CURRENT_TIMESTAMP),
(14, 1, 4, CURRENT_TIMESTAMP),
(15, 1, 4, CURRENT_TIMESTAMP);

-- Insert Lich Su Phe Duyet (Approval History)
INSERT INTO lich_su_phe_duyet (
    ho_so_id, buoc_phe_duyet, nguoi_duyet_id, 
    hanh_dong, ghi_chu, ngay_thuc_hien
) VALUES
-- Lịch sử cho hồ sơ 1 (đã duyệt)
(1, 1, 4, 'approve', 'Đồng ý cho phép. Hồ sơ đầy đủ.', CURRENT_TIMESTAMP - INTERVAL '29 days'),
(1, 2, 3, 'approve', 'Đã kiểm tra và đồng ý.', CURRENT_TIMESTAMP - INTERVAL '28 days'),
(1, 3, 2, 'approve', 'BGH phê duyệt. Chúc thành công.', CURRENT_TIMESTAMP - INTERVAL '27 days'),

-- Lịch sử cho hồ sơ 2 (đã duyệt)
(2, 1, 4, 'approve', 'Hồ sơ tốt. Đồng ý.', CURRENT_TIMESTAMP - INTERVAL '24 days'),
(2, 2, 3, 'approve', 'Phê duyệt.', CURRENT_TIMESTAMP - INTERVAL '23 days'),
(2, 3, 2, 'approve', 'BGH đồng ý.', CURRENT_TIMESTAMP - INTERVAL '22 days'),

-- Lịch sử cho hồ sơ 3 (đã duyệt)
(3, 1, 5, 'approve', 'Đồng ý cho tham dự.', CURRENT_TIMESTAMP - INTERVAL '19 days'),
(3, 2, 3, 'approve', 'OK.', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(3, 3, 2, 'approve', 'Phê duyệt.', CURRENT_TIMESTAMP - INTERVAL '17 days'),

-- Lịch sử cho hồ sơ 4 (đã duyệt)
(4, 1, 4, 'approve', 'Đồng ý.', CURRENT_TIMESTAMP - INTERVAL '14 days'),
(4, 2, 3, 'approve', 'Phê duyệt.', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(4, 3, 2, 'approve', 'BGH đồng ý.', CURRENT_TIMESTAMP - INTERVAL '12 days'),

-- Lịch sử cho hồ sơ 5 (đã duyệt)
(5, 1, 4, 'approve', 'Hồ sơ đầy đủ. Đồng ý.', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(5, 2, 3, 'approve', 'Phê duyệt.', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(5, 3, 2, 'approve', 'Đồng ý.', CURRENT_TIMESTAMP - INTERVAL '7 days'),

-- Lịch sử cho hồ sơ đang xử lý
(6, 1, 4, 'approve', 'Đồng ý cho tham dự.', CURRENT_TIMESTAMP - INTERVAL '4 days'),

-- Lịch sử cho hồ sơ từ chối
(16, 1, 4, 'reject', 'Ngân sách không đủ. Đề nghị xem xét lại.', CURRENT_TIMESTAMP - INTERVAL '44 days'),
(17, 1, 5, 'reject', 'Chưa đúng thời điểm. Đề nghị nộp lại sau.', CURRENT_TIMESTAMP - INTERVAL '39 days');

-- Insert File Dinh Kem (Attached Files) - Fixed: using ten_file_goc, ten_file_luu, duong_dan_file
INSERT INTO file_dinh_kem (
    ho_so_id, loai_file, ten_file_goc, ten_file_luu, duong_dan_file,
    kich_thuoc, dinh_dang, mo_ta, nguoi_upload_id, ngay_upload
) VALUES
-- Files cho hồ sơ 1
(1, 'don_xin_phep', 'don_xin_phep_di_nhat.pdf', '20251027_don_xin_phep_6.pdf', '/uploads/hoso/1/', 245678, 'pdf', 'Đơn xin phép đi Nhật Bản', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(1, 'giay_moi', 'invitation_letter_tokyo_univ.pdf', '20251027_invitation_6.pdf', '/uploads/hoso/1/', 189234, 'pdf', 'Thư mời từ Đại học Tokyo', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(1, 'ke_hoach', 'ke_hoach_hoc_tap_AI.docx', '20251027_kehoach_6.docx', '/uploads/hoso/1/', 156789, 'docx', 'Kế hoạch học tập chi tiết', 6, CURRENT_TIMESTAMP - INTERVAL '30 days'),

-- Files cho hồ sơ 2
(2, 'don_xin_phep', 'application_MIT_research.pdf', '20251101_application_7.pdf', '/uploads/hoso/2/', 298765, 'pdf', 'Đơn xin nghiên cứu tại MIT', 7, CURRENT_TIMESTAMP - INTERVAL '25 days'),
(2, 'giay_moi', 'invitation_MIT.pdf', '20251101_invitation_7.pdf', '/uploads/hoso/2/', 234567, 'pdf', 'Thư mời từ MIT', 7, CURRENT_TIMESTAMP - INTERVAL '25 days'),

-- Files cho hồ sơ 3
(3, 'don_xin_phep', 'don_tham_du_hoi_thao_london.pdf', '20251106_don_9.pdf', '/uploads/hoso/3/', 178234, 'pdf', 'Đơn tham dự hội thảo', 9, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(3, 'chuong_trinh', 'conference_program_london.pdf', '20251106_program_9.pdf', '/uploads/hoso/3/', 456789, 'pdf', 'Chương trình hội thảo', 9, CURRENT_TIMESTAMP - INTERVAL '20 days'),

-- Files cho hồ sơ 4
(4, 'don_xin_phep', 'don_xin_dao_tao_paris.pdf', '20251111_don_11.pdf', '/uploads/hoso/4/', 198765, 'pdf', 'Đơn xin đào tạo', 11, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(4, 'ke_hoach', 'training_plan_french.docx', '20251111_plan_11.docx', '/uploads/hoso/4/', 134567, 'docx', 'Kế hoạch đào tạo', 11, CURRENT_TIMESTAMP - INTERVAL '15 days'),

-- Files cho hồ sơ 5
(5, 'don_xin_phep', 'don_nghien_cuu_berlin.pdf', '20251116_don_13.pdf', '/uploads/hoso/5/', 223456, 'pdf', 'Đơn xin nghiên cứu', 13, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(5, 'de_cuong', 'research_proposal_chemistry.pdf', '20251116_proposal_13.pdf', '/uploads/hoso/5/', 567890, 'pdf', 'Đề cương nghiên cứu', 13, CURRENT_TIMESTAMP - INTERVAL '10 days'),

-- Files cho hồ sơ đang xử lý
(6, 'don_xin_phep', 'don_hoi_nghi_seoul.pdf', '20251121_don_8.pdf', '/uploads/hoso/6/', 167234, 'pdf', 'Đơn tham dự hội nghị', 8, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(7, 'don_xin_phep', 'don_cong_tac_beijing.pdf', '20251122_don_10.pdf', '/uploads/hoso/7/', 145678, 'pdf', 'Đơn công tác', 10, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(8, 'don_xin_phep', 'don_hoc_tap_singapore.pdf', '20251123_don_12.pdf', '/uploads/hoso/8/', 189456, 'pdf', 'Đơn học tập', 12, CURRENT_TIMESTAMP - INTERVAL '3 days'),

-- Files cho hồ sơ chờ duyệt
(11, 'don_xin_phep', 'don_khao_sat_bangkok.pdf', '20251126_don_6.pdf', '/uploads/hoso/11/', 123456, 'pdf', 'Đơn khảo sát', 6, CURRENT_TIMESTAMP),
(12, 'don_xin_phep', 'don_workshop_kl.pdf', '20251126_don_7.pdf', '/uploads/hoso/12/', 134567, 'pdf', 'Đơn tham dự workshop', 7, CURRENT_TIMESTAMP);

-- Insert Nhat Ky He Thong (Audit Logs)
INSERT INTO nhatkyhethong (
    nguoi_dung_id, hanh_dong, bang_du_lieu, 
    ban_ghi_id, noi_dung, ip_address, user_agent
) VALUES
(1, 'LOGIN', 'nguoi_dung', 1, 'Admin đăng nhập hệ thống', '192.168.1.100', 'Mozilla/5.0'),
(6, 'CREATE', 'ho_so_di_nuoc_ngoai', 1, 'Tạo hồ sơ đi Nhật Bản', '192.168.1.101', 'Chrome/120.0'),
(4, 'UPDATE', 'quy_trinh_phe_duyet', 1, 'Phê duyệt hồ sơ ID 1', '192.168.1.102', 'Chrome/120.0'),
(7, 'CREATE', 'ho_so_di_nuoc_ngoai', 2, 'Tạo hồ sơ đi Mỹ', '192.168.1.103', 'Firefox/121.0'),
(3, 'UPDATE', 'quy_trinh_phe_duyet', 2, 'Chuyển hồ sơ ID 2 lên BGH', '192.168.1.104', 'Chrome/120.0'),
(2, 'UPDATE', 'ho_so_di_nuoc_ngoai', 2, 'BGH phê duyệt hồ sơ ID 2', '192.168.1.105', 'Safari/17.0'),
(9, 'CREATE', 'ho_so_di_nuoc_ngoai', 3, 'Tạo hồ sơ tham dự hội thảo London', '192.168.1.106', 'Chrome/120.0'),
(1, 'UPDATE', 'dm_vai_tro', 1, 'Cập nhật quyền admin', '192.168.1.100', 'Mozilla/5.0'),
(11, 'CREATE', 'ho_so_di_nuoc_ngoai', 4, 'Tạo hồ sơ đào tạo Paris', '192.168.1.107', 'Edge/120.0'),
(13, 'CREATE', 'ho_so_di_nuoc_ngoai', 5, 'Tạo hồ sơ nghiên cứu Berlin', '192.168.1.108', 'Chrome/120.0'),
(8, 'CREATE', 'ho_so_di_nuoc_ngoai', 6, 'Tạo hồ sơ hội nghị Seoul', '192.168.1.109', 'Chrome/120.0'),
(10, 'CREATE', 'ho_so_di_nuoc_ngoai', 7, 'Tạo hồ sơ công tác Bắc Kinh', '192.168.1.110', 'Firefox/121.0'),
(12, 'CREATE', 'ho_so_di_nuoc_ngoai', 8, 'Tạo hồ sơ học tập Singapore', '192.168.1.111', 'Safari/17.0'),
(1, 'VIEW', 'ho_so_di_nuoc_ngoai', NULL, 'Xem danh sách hồ sơ', '192.168.1.100', 'Mozilla/5.0'),
(3, 'EXPORT', 'bao_cao', NULL, 'Xuất báo cáo thống kê', '192.168.1.104', 'Chrome/120.0');

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
