-- ================================================
-- SAMPLE DATA FOR SCHEMA V4
-- Purpose: Populate database with test data
-- ================================================

BEGIN;

-- ================================================
-- 1. DON VI QUAN LY (Units/Departments)
-- ================================================
INSERT INTO don_vi_quan_ly (ma_don_vi, ten_don_vi, loai_don_vi, email, is_active) VALUES
('d1111111-1111-1111-1111-111111111111', 'Khoa Công nghệ Thông tin', 'Khoa', 'cntt@tvu.edu.vn', TRUE),
('d2222222-2222-2222-2222-222222222222', 'Khoa Kỹ thuật Công nghệ', 'Khoa', 'ktcn@tvu.edu.vn', TRUE),
('d3333333-3333-3333-3333-333333333333', 'Phòng Tổ chức - Hành chính', 'Phong', 'tchc@tvu.edu.vn', TRUE),
('d4444444-4444-4444-4444-444444444444', 'Khoa Ngoại ngữ', 'Khoa', 'nn@tvu.edu.vn', TRUE);

-- ================================================
-- 2. NGUOI DUYET (Approvers) - với đầy đủ thông tin v4
-- ================================================
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet, is_active) VALUES
-- Chi bộ
('n1111111-1111-1111-1111-111111111111', 'TS. Nguyễn Văn A', 'BiThuChiBo', 'ThS', 'nguyenvana@tvu.edu.vn', 1, TRUE),
-- Đảng ủy  
('n2222222-2222-2222-2222-222222222222', 'PGS.TS. Trần Thị B', 'BiThuDangUy', 'PGS.TS', 'tranthib@tvu.edu.vn', 2, TRUE),
-- Trưởng đơn vị
('n3333333-3333-3333-3333-333333333333', 'TS. Lê Văn C', 'TruongDonVi', 'TS', 'levanc@tvu.edu.vn', 3, TRUE),
-- TCHC
('n4444444-4444-4444-4444-444444444444', 'ThS. Phạm Thị D', 'TCHC', 'ThS', 'phamthid@tvu.edu.vn', 4, TRUE),
-- BGH
('n5555555-5555-5555-5555-555555555555', 'GS.TS. Hoàng Văn E', 'BGH', 'GS.TS', 'hoangvane@tvu.edu.vn', 5, TRUE);

-- ================================================
-- 3. CHI BO & DANG UY
-- ================================================
INSERT INTO chi_bo (ma_chi_bo, ten_chi_bo, bi_thu_id, thuoc_don_vi, is_active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Chi bộ Khoa CNTT', 'n1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', TRUE);

INSERT INTO dang_uy (ma_dang_uy, ten_dang_uy, bi_thu_id, is_active) VALUES
('du111111-1111-1111-1111-111111111111', 'Đảng ủy Trường ĐH Trà Vinh', 'n2222222-2222-2222-2222-222222222222', TRUE);

-- Update don_vi_quan_ly truong_don_vi_id
UPDATE don_vi_quan_ly SET truong_don_vi_id = 'n3333333-3333-3333-3333-333333333333' 
WHERE ma_don_vi = 'd1111111-1111-1111-1111-111111111111';

-- ================================================
-- 4. VIEN CHUC (Staff) - với ma_don_vi và ma_chi_bo
-- ================================================
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_chi_bo, ma_don_vi) VALUES
('v1111111-1111-1111-1111-111111111111', 'Nguyễn Thị Mai', '1985-03-15', '123456789001', 'nguyenthimai@tvu.edu.vn', TRUE, 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111'),
('v2222222-2222-2222-2222-222222222222', 'Trần Văn Nam', '1990-07-20', '123456789002', 'tranvannam@tvu.edu.vn', FALSE, NULL, 'd1111111-1111-1111-1111-111111111111'),
('v3333333-3333-3333-3333-333333333333', 'Lê Thị Hoa', '1988-11-10', '123456789003', 'lethihoa@tvu.edu.vn', TRUE, 'c1111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222');

-- ================================================
-- 5. NGUOI DUNG (Users)
-- ================================================
INSERT INTO nguoi_dung (user_id, email, full_name, role, ma_vien_chuc, ma_nguoi_duyet, is_active) VALUES
-- Admin
('u0000000-0000-0000-0000-000000000000', 'admin@tvu.edu.vn', 'Administrator', 'Admin', NULL, NULL, TRUE),
-- Viên chức
('u1111111-1111-1111-1111-111111111111', 'nguyenthimai@tvu.edu.vn', 'Nguyễn Thị Mai', 'VienChuc', 'v1111111-1111-1111-1111-111111111111', NULL, TRUE),
('u2222222-2222-2222-2222-222222222222', 'tranvannam@tvu.edu.vn', 'Trần Văn Nam', 'VienChuc', 'v2222222-2222-2222-2222-222222222222', NULL, TRUE),
('u3333333-3333-3333-3333-333333333333', 'lethihoa@tvu.edu.vn', 'Lê Thị Hoa', 'VienChuc', 'v3333333-3333-3333-3333-333333333333', NULL, TRUE),
-- Người duyệt
('un111111-1111-1111-1111-111111111111', 'nguyenvana@tvu.edu.vn', 'TS. Nguyễn Văn A', 'NguoiDuyet', NULL, 'n1111111-1111-1111-1111-111111111111', TRUE),
('un222222-2222-2222-2222-222222222222', 'tranthib@tvu.edu.vn', 'PGS.TS. Trần Thị B', 'NguoiDuyet', NULL, 'n2222222-2222-2222-2222-222222222222', TRUE),
('un333333-3333-3333-3333-333333333333', 'levanc@tvu.edu.vn', 'TS. Lê Văn C', 'NguoiDuyet', NULL, 'n3333333-3333-3333-3333-333333333333', TRUE),
('un444444-4444-4444-4444-444444444444', 'phamthid@tvu.edu.vn', 'ThS. Phạm Thị D', 'NguoiDuyet', NULL, 'n4444444-4444-4444-4444-444444444444', TRUE),
('un555555-5555-5555-5555-555555555555', 'hoangvane@tvu.edu.vn', 'GS.TS. Hoàng Văn E', 'NguoiDuyet', NULL, 'n5555555-5555-5555-5555-555555555555', TRUE);

-- ================================================
-- 6. LOAI CHUYEN DI & NGUON KINH PHI
-- ================================================
INSERT INTO loai_chuyen_di (ma_loai, ten_loai, mo_ta, is_active) VALUES
('l1111111-1111-1111-1111-111111111111', 'Hội nghị khoa học', 'Tham dự hội nghị khoa học quốc tế', TRUE),
('l2222222-2222-2222-2222-222222222222', 'Học tập, nghiên cứu', 'Học tập, trao đổi học thuật', TRUE),
('l3333333-3333-3333-3333-333333333333', 'Công tác', 'Công tác ngắn hạn', TRUE);

INSERT INTO nguon_kinh_phi (ma_kinh_phi, ten_nguon, mo_ta, is_active) VALUES
('k1111111-1111-1111-1111-111111111111', 'Ngân sách nhà nước', 'Từ ngân sách nhà nước cấp', TRUE),
('k2222222-2222-2222-2222-222222222222', 'Đề tài nghiên cứu', 'Từ kinh phí đề tài', TRUE),
('k3333333-3333-3333-3333-333333333333', 'Tài trợ nước ngoài', 'Tổ chức nước ngoài tài trợ', TRUE);

-- ================================================
-- 7. ROLES & USER_ROLES
-- ================================================
INSERT INTO roles (role_id, role_name, description, permissions) VALUES
('r1111111-1111-1111-1111-111111111111', 'ADMIN', 'Administrator', '{"all": true}'::jsonb),
('r2222222-2222-2222-2222-222222222222', 'VIEN_CHUC', 'Viên chức', '{"submit": true, "view_own": true}'::jsonb),
('r3333333-3333-3333-3333-333333333333', 'NGUOI_DUYET', 'Người duyệt', '{"approve": true, "view_all": true}'::jsonb),
('r4444444-4444-4444-4444-444444444444', 'CHI_BO', 'Bí thư Chi bộ', '{"approve_chi_bo": true}'::jsonb),
('r5555555-5555-5555-5555-555555555555', 'DANG_UY', 'Đảng ủy', '{"approve_dang_uy": true}'::jsonb);

-- Assign roles to users
INSERT INTO user_roles (user_role_id, user_id, role_id) VALUES
-- Admin
(gen_random_uuid(), 'u0000000-0000-0000-0000-000000000000', 'r1111111-1111-1111-1111-111111111111'),
-- Viên chức
(gen_random_uuid(), 'u1111111-1111-1111-1111-111111111111', 'r2222222-2222-2222-2222-222222222222'),
(gen_random_uuid(), 'u2222222-2222-2222-2222-222222222222', 'r2222222-2222-2222-2222-222222222222'),
(gen_random_uuid(), 'u3333333-3333-3333-3333-333333333333', 'r2222222-2222-2222-2222-222222222222'),
-- Người duyệt
(gen_random_uuid(), 'un111111-1111-1111-1111-111111111111', 'r3333333-3333-3333-3333-333333333333'),
(gen_random_uuid(), 'un111111-1111-1111-1111-111111111111', 'r4444444-4444-4444-4444-444444444444'),
(gen_random_uuid(), 'un222222-2222-2222-2222-222222222222', 'r3333333-3333-3333-3333-333333333333'),
(gen_random_uuid(), 'un222222-2222-2222-2222-222222222222', 'r5555555-5555-5555-5555-555555555555');

-- ================================================
-- 8. SAMPLE HO SO DI NUOC NGOAI
-- ================================================
INSERT INTO ho_so_di_nuoc_ngoai (
    ma_ho_so, ma_vien_chuc, loai_chuyen_di, nguon_kinh_phi, 
    quoc_gia_den, to_chuc_moi, thoi_gian_bat_dau, thoi_gian_ket_thuc,
    muc_dich, kinh_phi_du_kien, trang_thai, muc_do_uu_tien, nguoi_tao
) VALUES
('h1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 
 'l1111111-1111-1111-1111-111111111111', 'k2222222-2222-2222-2222-222222222222',
 'Nhật Bản', 'Tokyo University', '2025-03-15', '2025-03-20',
 'Tham dự hội nghị ICSE 2025', 50000000, 'MoiTao', 'Cao', 'u1111111-1111-1111-1111-111111111111'),
 
('h2222222-2222-2222-2222-222222222222', 'v2222222-2222-2222-2222-222222222222',
 'l2222222-2222-2222-2222-222222222222', 'k1111111-1111-1111-1111-111111111111',
 'Mỹ', 'MIT', '2025-06-01', '2025-06-30',
 'Học tập ngắn hạn về AI', 80000000, 'MoiTao', 'TrungBinh', 'u2222222-2222-2222-2222-222222222222');

COMMIT;

-- ================================================
-- VERIFICATION
-- ================================================
SELECT 'Total Don Vi:' as info, COUNT(*)::text as count FROM don_vi_quan_ly
UNION ALL
SELECT 'Total Nguoi Duyet:', COUNT(*)::text FROM nguoi_duyet
UNION ALL
SELECT 'Total Vien Chuc:', COUNT(*)::text FROM vien_chuc
UNION ALL
SELECT 'Total Nguoi Dung:', COUNT(*)::text FROM nguoi_dung
UNION ALL
SELECT 'Total Ho So:', COUNT(*)::text FROM ho_so_di_nuoc_ngoai;
