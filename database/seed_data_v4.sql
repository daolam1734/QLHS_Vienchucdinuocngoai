-- ================================================
-- SEED DATA for QLHS v4.0
-- Sample data with complete workflow testing
-- ================================================

SET client_encoding = 'UTF8';

-- ================================================
-- 1. MASTER DATA
-- ================================================

-- Loại chuyến đi
INSERT INTO loai_chuyen_di (ten_loai, mo_ta) VALUES
('Công tác', 'Chuyến công tác ngắn hạn'),
('Hội nghị/Hội thảo', 'Tham dự hội nghị quốc tế'),
('Đào tạo', 'Đào tạo ngắn hạn/dài hạn'),
('Nghiên cứu', 'Nghiên cứu khoa học'),
('Giảng dạy', 'Giảng dạy tại nước ngoài'),
('Du học', 'Đào tạo sau đại học');

-- Nguồn kinh phí
INSERT INTO nguon_kinh_phi (ten_nguon, mo_ta) VALUES
('Ngân sách Nhà nước', 'Kinh phí từ ngân sách'),
('Tự túc', 'Viên chức tự chi trả'),
('Tài trợ nước ngoài', 'Học bổng/tài trợ quốc tế'),
('Đề tài nghiên cứu', 'Từ nguồn đề tài'),
('Doanh nghiệp', 'Hợp tác doanh nghiệp'),
('Hợp tác quốc tế', 'Chương trình hợp tác');

-- ================================================
-- 2. ĐIỀU KIỆN TỰ ĐỘNG
-- ================================================

INSERT INTO dieu_kien_tu_dong (ten_dieu_kien, loai_kiem_tra, tham_so, thong_bao_loi, thu_tu_kiem_tra) VALUES
(
    'Kiểm tra thời gian tối thiểu',
    'ThoiGian',
    '{"min_days_before": 30}'::jsonb,
    'Hồ sơ phải được nộp trước ít nhất 30 ngày so với ngày khởi hành',
    1
),
(
    'Kiểm tra tài liệu bắt buộc',
    'TaiLieu',
    '{"required_docs": ["DonDeNghi", "ToTrinh", "GiayMoi"]}'::jsonb,
    'Hồ sơ thiếu tài liệu bắt buộc: Đơn đề nghị, Tờ trình, Giấy mời',
    2
);

-- ================================================
-- 3. TỔ CHỨC
-- ================================================

-- Đơn vị quản lý (sẽ gán truong_don_vi_id sau)
INSERT INTO don_vi_quan_ly (ma_don_vi, ten_don_vi, loai_don_vi, email) VALUES
(gen_random_uuid(), 'Khoa Công nghệ Thông tin', 'Khoa', 'cntt@tvu.edu.vn'),
(gen_random_uuid(), 'Khoa Kinh tế', 'Khoa', 'kt@tvu.edu.vn'),
(gen_random_uuid(), 'Phòng Tổ chức Nhân sự', 'Phong', 'tcns@tvu.edu.vn'),
(gen_random_uuid(), 'Viện Nghiên cứu Khoa học', 'Vien', 'nckh@tvu.edu.vn');

-- Chi bộ (sẽ gán bi_thu_id sau)
INSERT INTO chi_bo (ma_chi_bo, ten_chi_bo, thuoc_don_vi) VALUES
(
    gen_random_uuid(),
    'Chi bộ Khoa CNTT',
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Công nghệ Thông tin')
),
(
    gen_random_uuid(),
    'Chi bộ Khoa Kinh tế',
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Kinh tế')
);

-- Đảng ủy (sẽ gán bi_thu_id sau)
INSERT INTO dang_uy (ma_dang_uy, ten_dang_uy) VALUES
(gen_random_uuid(), 'Đảng ủy Trường ĐH Trà Vinh');

-- ================================================
-- 4. NGƯỜI DUYỆT (7 người cho 5 cấp)
-- ================================================

-- Bí thư Chi bộ CNTT (cap_duyet=1)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Nguyễn Văn Bình', 'BiThuChiBo', 'ThS', 'bithu.chibo.cntt@tvu.edu.vn', 1);

-- Bí thư Đảng ủy (cap_duyet=2)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Trần Thị Cẩm', 'BiThuDangUy', 'PGS.TS', 'bithu.danguy@tvu.edu.vn', 2);

-- Trưởng Khoa CNTT (cap_duyet=3)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Lê Hoàng Dũng', 'TruongDonVi', 'TS', 'truongkhoa.cntt@tvu.edu.vn', 3);

-- Trưởng Khoa Kinh tế (cap_duyet=3)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Phạm Thu Hiền', 'TruongDonVi', 'PGS.TS', 'truongkhoa.kt@tvu.edu.vn', 3);

-- Trưởng phòng TCNS (cap_duyet=4)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Võ Minh Khoa', 'TCNS', 'ThS', 'truongphong.tcns@tvu.edu.vn', 4);

-- Phó Hiệu trưởng (cap_duyet=5)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Huỳnh Thị Lan', 'BGH', 'PGS.TS', 'phohieutruong@tvu.edu.vn', 5);

-- Hiệu trưởng (cap_duyet=5)
INSERT INTO nguoi_duyet (ma_nguoi_duyet, ho_ten, vai_tro, chuc_danh, email, cap_duyet) VALUES
(gen_random_uuid(), 'Ngô Thanh Minh', 'BGH', 'GS.TS', 'hieutruong@tvu.edu.vn', 5);

-- ================================================
-- 5. CẬP NHẬT FOREIGN KEYS
-- ================================================

-- Gán Bí thư Chi bộ
UPDATE chi_bo cb
SET bi_thu_id = (
    SELECT ma_nguoi_duyet FROM nguoi_duyet 
    WHERE vai_tro = 'BiThuChiBo' AND email = 'bithu.chibo.cntt@tvu.edu.vn'
)
WHERE ten_chi_bo = 'Chi bộ Khoa CNTT';

-- Gán Bí thư Đảng ủy
UPDATE dang_uy
SET bi_thu_id = (
    SELECT ma_nguoi_duyet FROM nguoi_duyet 
    WHERE vai_tro = 'BiThuDangUy'
    LIMIT 1
);

-- Gán Trưởng đơn vị CNTT
UPDATE don_vi_quan_ly
SET truong_don_vi_id = (
    SELECT ma_nguoi_duyet FROM nguoi_duyet 
    WHERE vai_tro = 'TruongDonVi' AND email = 'truongkhoa.cntt@tvu.edu.vn'
)
WHERE ten_don_vi = 'Khoa Công nghệ Thông tin';

-- Gán Trưởng đơn vị Kinh tế
UPDATE don_vi_quan_ly
SET truong_don_vi_id = (
    SELECT ma_nguoi_duyet FROM nguoi_duyet 
    WHERE vai_tro = 'TruongDonVi' AND email = 'truongkhoa.kt@tvu.edu.vn'
)
WHERE ten_don_vi = 'Khoa Kinh tế';

-- ================================================
-- 6. VIÊN CHỨC (5 người - 2 Đảng viên, 3 không)
-- ================================================

-- Viên chức 1: Đảng viên thuộc Chi bộ CNTT
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_chi_bo, ma_don_vi) VALUES
(
    gen_random_uuid(),
    'Nguyễn Văn An',
    '1985-03-15',
    '079085001234',
    'nguyenvana@tvu.edu.vn',
    TRUE,
    (SELECT ma_chi_bo FROM chi_bo WHERE ten_chi_bo = 'Chi bộ Khoa CNTT'),
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Công nghệ Thông tin')
);

-- Viên chức 2: Đảng viên thuộc Chi bộ Kinh tế
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_chi_bo, ma_don_vi) VALUES
(
    gen_random_uuid(),
    'Trần Thị Bình',
    '1987-07-20',
    '079087002345',
    'tranthib@tvu.edu.vn',
    TRUE,
    (SELECT ma_chi_bo FROM chi_bo WHERE ten_chi_bo = 'Chi bộ Khoa Kinh tế'),
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Kinh tế')
);

-- Viên chức 3: Không phải Đảng viên
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_don_vi) VALUES
(
    gen_random_uuid(),
    'Lê Hoàng Cường',
    '1990-11-05',
    '079090003456',
    'lehoangc@tvu.edu.vn',
    FALSE,
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Công nghệ Thông tin')
);

-- Viên chức 4: Không phải Đảng viên
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_don_vi) VALUES
(
    gen_random_uuid(),
    'Phạm Thị Dung',
    '1988-06-12',
    '079088004567',
    'phamthid@tvu.edu.vn',
    FALSE,
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Khoa Kinh tế')
);

-- Viên chức 5: Không phải Đảng viên
INSERT INTO vien_chuc (ma_vien_chuc, ho_ten, ngay_sinh, so_cccd, email, is_dang_vien, ma_don_vi) VALUES
(
    gen_random_uuid(),
    'Võ Minh Đức',
    '1992-09-25',
    '079092005678',
    'vominhd@tvu.edu.vn',
    FALSE,
    (SELECT ma_don_vi FROM don_vi_quan_ly WHERE ten_don_vi = 'Viện Nghiên cứu Khoa học')
);

-- ================================================
-- 7. NGƯỜI DÙNG (SSO Accounts)
-- ================================================

-- Admin
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    INSERT INTO nguoi_dung (email, full_name, role, is_active)
    VALUES ('admin@tvu.edu.vn', 'Administrator', 'Admin', TRUE)
    RETURNING user_id INTO v_user_id;
END $$;

-- Viên chức users
DO $$
DECLARE
    v_user_id UUID;
    v_ma_vien_chuc UUID;
BEGIN
    -- Nguyễn Văn An
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'nguyenvana@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc)
    VALUES ('nguyenvana@tvu.edu.vn', 'Nguyễn Văn An', 'VienChuc', v_ma_vien_chuc);
    
    -- Trần Thị Bình
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'tranthib@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc)
    VALUES ('tranthib@tvu.edu.vn', 'Trần Thị Bình', 'VienChuc', v_ma_vien_chuc);
    
    -- Lê Hoàng Cường
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'lehoangc@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc)
    VALUES ('lehoangc@tvu.edu.vn', 'Lê Hoàng Cường', 'VienChuc', v_ma_vien_chuc);
    
    -- Phạm Thị Dung
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'phamthid@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc)
    VALUES ('phamthid@tvu.edu.vn', 'Phạm Thị Dung', 'VienChuc', v_ma_vien_chuc);
    
    -- Võ Minh Đức
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'vominhd@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_vien_chuc)
    VALUES ('vominhd@tvu.edu.vn', 'Võ Minh Đức', 'VienChuc', v_ma_vien_chuc);
END $$;

-- Người duyệt users
DO $$
DECLARE
    v_ma_nguoi_duyet UUID;
BEGIN
    -- Bí thư Chi bộ
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'bithu.chibo.cntt@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('bithu.chibo.cntt@tvu.edu.vn', 'Nguyễn Văn Bình', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- Bí thư Đảng ủy
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'bithu.danguy@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('bithu.danguy@tvu.edu.vn', 'Trần Thị Cẩm', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- Trưởng Khoa CNTT
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'truongkhoa.cntt@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('truongkhoa.cntt@tvu.edu.vn', 'Lê Hoàng Dũng', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- Trưởng Khoa Kinh tế
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'truongkhoa.kt@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('truongkhoa.kt@tvu.edu.vn', 'Phạm Thu Hiền', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- Trưởng phòng TCNS
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'truongphong.tcns@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('truongphong.tcns@tvu.edu.vn', 'Võ Minh Khoa', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- BGH 1
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'phohieutruong@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('phohieutruong@tvu.edu.vn', 'Huỳnh Thị Lan', 'NguoiDuyet', v_ma_nguoi_duyet);
    
    -- BGH 2 (Hiệu trưởng)
    SELECT ma_nguoi_duyet INTO v_ma_nguoi_duyet FROM nguoi_duyet WHERE email = 'hieutruong@tvu.edu.vn';
    INSERT INTO nguoi_dung (email, full_name, role, ma_nguoi_duyet)
    VALUES ('hieutruong@tvu.edu.vn', 'Ngô Thanh Minh', 'NguoiDuyet', v_ma_nguoi_duyet);
END $$;

-- ================================================
-- 8. ROLES & USER_ROLES (RBAC)
-- ================================================

INSERT INTO roles (role_name, description, permissions) VALUES
('VIEN_CHUC', 'Viên chức', '{"create_hoso": true, "view_own_hoso": true, "upload_docs": true, "submit_report": true}'::jsonb),
('NGUOI_DUYET', 'Người duyệt', '{"view_hoso": true, "approve": true, "reject": true, "request_supplement": true, "sign_digital": true}'::jsonb),
('TRUONG_KHOA', 'Trưởng khoa/đơn vị', '{"view_unit_hoso": true, "approve_level_3": true, "manage_unit": true}'::jsonb),
('TCNS', 'Phòng TCNS', '{"view_all_hoso": true, "check_legal": true, "create_report": true, "approve_level_4": true}'::jsonb),
('BGH', 'Ban Giám hiệu', '{"view_all_hoso": true, "final_approve": true, "create_decision": true, "sign_official": true}'::jsonb),
('CHI_BO', 'Chi bộ', '{"view_member_hoso": true, "approve_level_1": true, "review_report": true}'::jsonb),
('DANG_UY', 'Đảng ủy', '{"view_dang_vien_hoso": true, "approve_level_2": true, "party_decision": true}'::jsonb),
('ADMIN', 'Quản trị hệ thống', '{"full_access": true, "manage_users": true, "system_config": true, "view_audit": true}'::jsonb);

-- Gán roles cho users
DO $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
BEGIN
    -- Admin
    SELECT user_id INTO v_user_id FROM nguoi_dung WHERE email = 'admin@tvu.edu.vn';
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'ADMIN';
    INSERT INTO user_roles (user_id, role_id) VALUES (v_user_id, v_role_id);
    
    -- Viên chức roles
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'VIEN_CHUC';
    INSERT INTO user_roles (user_id, role_id)
    SELECT user_id, v_role_id FROM nguoi_dung WHERE role = 'VienChuc';
    
    -- BGH role
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'BGH';
    INSERT INTO user_roles (user_id, role_id)
    SELECT nd.user_id, v_role_id 
    FROM nguoi_dung nd
    JOIN nguoi_duyet nguoi ON nd.ma_nguoi_duyet = nguoi.ma_nguoi_duyet
    WHERE nguoi.vai_tro = 'BGH';
    
    -- TCNS role
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'TCNS';
    INSERT INTO user_roles (user_id, role_id)
    SELECT nd.user_id, v_role_id 
    FROM nguoi_dung nd
    JOIN nguoi_duyet nguoi ON nd.ma_nguoi_duyet = nguoi.ma_nguoi_duyet
    WHERE nguoi.vai_tro = 'TCNS';
    
    -- Chi bộ role
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'CHI_BO';
    INSERT INTO user_roles (user_id, role_id)
    SELECT nd.user_id, v_role_id 
    FROM nguoi_dung nd
    JOIN nguoi_duyet nguoi ON nd.ma_nguoi_duyet = nguoi.ma_nguoi_duyet
    WHERE nguoi.vai_tro = 'BiThuChiBo';
    
    -- Đảng ủy role
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'DANG_UY';
    INSERT INTO user_roles (user_id, role_id)
    SELECT nd.user_id, v_role_id 
    FROM nguoi_dung nd
    JOIN nguoi_duyet nguoi ON nd.ma_nguoi_duyet = nguoi.ma_nguoi_duyet
    WHERE nguoi.vai_tro = 'BiThuDangUy';
    
    -- Trưởng khoa role
    SELECT role_id INTO v_role_id FROM roles WHERE role_name = 'TRUONG_KHOA';
    INSERT INTO user_roles (user_id, role_id)
    SELECT nd.user_id, v_role_id 
    FROM nguoi_dung nd
    JOIN nguoi_duyet nguoi ON nd.ma_nguoi_duyet = nguoi.ma_nguoi_duyet
    WHERE nguoi.vai_tro = 'TruongDonVi';
END $$;

-- ================================================
-- 9. SAMPLE HỒ SƠ (Testing workflow)
-- ================================================

-- Hồ sơ 1: Đảng viên (Nguyễn Văn An) → Đi qua 7 bước
DO $$
DECLARE
    v_ma_vien_chuc UUID;
    v_user_id UUID;
    v_loai_chuyen_di UUID;
    v_nguon_kinh_phi UUID;
BEGIN
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'nguyenvana@tvu.edu.vn';
    SELECT user_id INTO v_user_id FROM nguoi_dung WHERE email = 'nguyenvana@tvu.edu.vn';
    SELECT ma_loai INTO v_loai_chuyen_di FROM loai_chuyen_di WHERE ten_loai = 'Hội nghị/Hội thảo' LIMIT 1;
    SELECT ma_kinh_phi INTO v_nguon_kinh_phi FROM nguon_kinh_phi WHERE ten_nguon = 'Ngân sách Nhà nước' LIMIT 1;
    
    INSERT INTO ho_so_di_nuoc_ngoai (
        ma_vien_chuc, loai_chuyen_di, nguon_kinh_phi, 
        quoc_gia_den, to_chuc_moi, 
        thoi_gian_bat_dau, thoi_gian_ket_thuc,
        muc_dich, kinh_phi_du_kien, muc_do_uu_tien,
        trang_thai, nguoi_tao
    ) VALUES (
        v_ma_vien_chuc, v_loai_chuyen_di, v_nguon_kinh_phi,
        'Singapore', 'National University of Singapore',
        CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '50 days',
        'Tham dự hội nghị quốc tế về AI và Machine Learning',
        15000000, 'Cao',
        'MoiTao', v_user_id
    );
END $$;

-- Hồ sơ 2: Không phải Đảng viên (Lê Hoàng Cường) → Bỏ qua Chi bộ, Đảng ủy
DO $$
DECLARE
    v_ma_vien_chuc UUID;
    v_user_id UUID;
    v_loai_chuyen_di UUID;
    v_nguon_kinh_phi UUID;
BEGIN
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'lehoangc@tvu.edu.vn';
    SELECT user_id INTO v_user_id FROM nguoi_dung WHERE email = '
    ';
    SELECT ma_loai INTO v_loai_chuyen_di FROM loai_chuyen_di WHERE ten_loai = 'Đào tạo' LIMIT 1;
    SELECT ma_kinh_phi INTO v_nguon_kinh_phi FROM nguon_kinh_phi WHERE ten_nguon = 'Tài trợ nước ngoài' LIMIT 1;
    
    INSERT INTO ho_so_di_nuoc_ngoai (
        ma_vien_chuc, loai_chuyen_di, nguon_kinh_phi, 
        quoc_gia_den, to_chuc_moi, 
        thoi_gian_bat_dau, thoi_gian_ket_thuc,
        muc_dich, kinh_phi_du_kien, muc_do_uu_tien,
        trang_thai, nguoi_tao
    ) VALUES (
        v_ma_vien_chuc, v_loai_chuyen_di, v_nguon_kinh_phi,
        'Nhật Bản', 'Tokyo Institute of Technology',
        CURRENT_DATE + INTERVAL '60 days', CURRENT_DATE + INTERVAL '90 days',
        'Đào tạo ngắn hạn về IoT và Embedded Systems',
        0, 'BinhThuong',
        'MoiTao', v_user_id
    );
END $$;

-- Hồ sơ 3: Từ chối tự động (thời gian < 30 ngày)
DO $$
DECLARE
    v_ma_vien_chuc UUID;
    v_user_id UUID;
    v_loai_chuyen_di UUID;
    v_nguon_kinh_phi UUID;
BEGIN
    SELECT ma_vien_chuc INTO v_ma_vien_chuc FROM vien_chuc WHERE email = 'phamthid@tvu.edu.vn';
    SELECT user_id INTO v_user_id FROM nguoi_dung WHERE email = 'phamthid@tvu.edu.vn';
    SELECT ma_loai INTO v_loai_chuyen_di FROM loai_chuyen_di WHERE ten_loai = 'Công tác' LIMIT 1;
    SELECT ma_kinh_phi INTO v_nguon_kinh_phi FROM nguon_kinh_phi WHERE ten_nguon = 'Tự túc' LIMIT 1;
    
    -- Hồ sơ này sẽ bị từ chối tự động vì thoi_gian_bat_dau < 30 ngày
    INSERT INTO ho_so_di_nuoc_ngoai (
        ma_vien_chuc, loai_chuyen_di, nguon_kinh_phi, 
        quoc_gia_den, to_chuc_moi, 
        thoi_gian_bat_dau, thoi_gian_ket_thuc,
        muc_dich, kinh_phi_du_kien, muc_do_uu_tien,
        trang_thai, nguoi_tao
    ) VALUES (
        v_ma_vien_chuc, v_loai_chuyen_di, v_nguon_kinh_phi,
        'Thái Lan', 'Chulalongkorn University',
        CURRENT_DATE + INTERVAL '20 days', CURRENT_DATE + INTERVAL '25 days',
        'Công tác trao đổi học thuật',
        5000000, 'BinhThuong',
        'MoiTao', v_user_id
    );
END $$;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Seed Data v4.0 đã được load thành công!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Dữ liệu mẫu:';
    RAISE NOTICE '  • 6 loại chuyến đi + 6 nguồn kinh phí';
    RAISE NOTICE '  • 4 đơn vị + 2 Chi bộ + 1 Đảng ủy';
    RAISE NOTICE '  • 7 người duyệt (5 cấp)';
    RAISE NOTICE '  • 5 viên chức (2 Đảng viên, 3 không)';
    RAISE NOTICE '  • 13 user accounts';
    RAISE NOTICE '  • 8 roles với RBAC';
    RAISE NOTICE '  • 3 hồ sơ test (workflow tự động)';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Test accounts (Password: 123456):';
    RAISE NOTICE '  Admin: admin@tvu.edu.vn';
    RAISE NOTICE '  Đảng viên: nguyenvana@tvu.edu.vn';
    RAISE NOTICE '  Không Đảng viên: lehoangc@tvu.edu.vn';
    RAISE NOTICE '  Bí thư Chi bộ: bithu.chibo.cntt@tvu.edu.vn';
    RAISE NOTICE '  BGH: hieutruong@tvu.edu.vn';
    RAISE NOTICE '==================================================';
END $$;
