-- ================================================
-- SCHEMA DATABASE: QLHS Đi Nước Ngoài v4.0
-- Trường Đại học Trà Vinh
-- Encoding: UTF-8
-- Version: 4.0 - November 30, 2025
-- New Features:
--   - Hỗ trợ workflow đầy đủ theo quy trình TVU
--   - Thêm Chi bộ, Đảng ủy vào quy trình duyệt
--   - Workflow động: tự động bỏ qua bước Đảng nếu không phải Đảng viên
--   - Kiểm tra điều kiện tự động trước khi duyệt
--   - Sinh Quyết định + Thông báo tự động
--   - Báo cáo sau chuyến đi có review từ Chi bộ
--   - 7 cấp duyệt: Chi bộ → Đảng ủy → Đơn vị → TCHC → BGH → Báo cáo
-- ================================================

SET client_encoding = 'UTF8';

-- Drop existing tables
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS lich_su_ho_so CASCADE;
DROP TABLE IF EXISTS nhat_ky_audit CASCADE;
DROP TABLE IF EXISTS chu_ky_so CASCADE;
DROP TABLE IF EXISTS bao_cao_sau_chuyen_di CASCADE;
DROP TABLE IF EXISTS ho_so_duyet CASCADE;
DROP TABLE IF EXISTS tai_lieu_dinh_kem CASCADE;
DROP TABLE IF EXISTS thong_bao CASCADE;
DROP TABLE IF EXISTS quyet_dinh CASCADE;
DROP TABLE IF EXISTS ho_so_di_nuoc_ngoai CASCADE;
DROP TABLE IF EXISTS nguoi_dung CASCADE;
DROP TABLE IF EXISTS nguon_kinh_phi CASCADE;
DROP TABLE IF EXISTS loai_chuyen_di CASCADE;
DROP TABLE IF EXISTS dang_uy CASCADE;
DROP TABLE IF EXISTS chi_bo CASCADE;
DROP TABLE IF EXISTS don_vi_quan_ly CASCADE;
DROP TABLE IF EXISTS nguoi_duyet CASCADE;
DROP TABLE IF EXISTS vien_chuc CASCADE;
DROP TABLE IF EXISTS dieu_kien_tu_dong CASCADE;

-- ================================================
-- BẢNG VIÊN CHỨC (Enhanced)
-- ================================================

CREATE TABLE vien_chuc (
    ma_vien_chuc UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE,
    so_cccd VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_dang_vien BOOLEAN DEFAULT FALSE,  -- Xác định workflow có đi qua Chi bộ không
    ma_chi_bo UUID,                       -- Thuộc Chi bộ nào (nếu là Đảng viên)
    ma_don_vi UUID NOT NULL,              -- Thuộc Đơn vị nào (Khoa/Phòng)
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- BẢNG ĐƠN VỊ QUẢN LÝ (Khoa/Phòng ban)
-- ================================================

CREATE TABLE don_vi_quan_ly (
    ma_don_vi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_don_vi VARCHAR(255) NOT NULL,       -- VD: "Khoa Công nghệ Thông tin"
    loai_don_vi VARCHAR(50) NOT NULL,       -- "Khoa", "Phong", "Vien"
    truong_don_vi_id UUID,                  -- Người đứng đầu đơn vị (FK → nguoi_duyet)
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- BẢNG CHI BỘ (Tổ chức Đảng cấp cơ sở)
-- ================================================

CREATE TABLE chi_bo (
    ma_chi_bo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_chi_bo VARCHAR(255) NOT NULL,       -- VD: "Chi bộ Khoa CNTT"
    bi_thu_id UUID,                         -- Bí thư Chi bộ (FK → nguoi_duyet)
    thuoc_don_vi UUID,                      -- Thuộc Đơn vị nào
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chibo_donvi FOREIGN KEY (thuoc_don_vi) REFERENCES don_vi_quan_ly(ma_don_vi) ON DELETE SET NULL
);

-- ================================================
-- BẢNG ĐẢNG ỦY (Cấp trường)
-- ================================================

CREATE TABLE dang_uy (
    ma_dang_uy UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_dang_uy VARCHAR(255) NOT NULL DEFAULT 'Đảng ủy Trường ĐH Trà Vinh',
    bi_thu_id UUID,                         -- Bí thư Đảng ủy (FK → nguoi_duyet)
    pho_bi_thu_id UUID,                     -- Phó Bí thư (FK → nguoi_duyet)
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- BẢNG NGƯỜI DUYỆT (Enhanced with roles)
-- ================================================

CREATE TABLE nguoi_duyet (
    ma_nguoi_duyet UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(100) NOT NULL,          -- "BiThuChiBo", "BiThuDangUy", "TruongDonVi", "TCHC", "BGH"
    chuc_danh VARCHAR(100),                 -- VD: "PGS.TS", "ThS"
    email VARCHAR(255) UNIQUE,
    cap_duyet INT,                          -- Cấp độ duyệt: 1=Chi bộ, 2=Đảng ủy, 3=Đơn vị, 4=TCHC, 5=BGH
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- BẢNG LOẠI CHUYẾN ĐI & NGUỒN KINH PHÍ
-- ================================================

CREATE TABLE loai_chuyen_di (
    ma_loai UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_loai VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE nguon_kinh_phi (
    ma_kinh_phi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_nguon VARCHAR(255) NOT NULL,
    mo_ta TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- ================================================
-- BẢNG ĐIỀU KIỆN TỰ ĐỘNG (Validation Rules)
-- ================================================

CREATE TABLE dieu_kien_tu_dong (
    ma_dieu_kien UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_dieu_kien VARCHAR(255) NOT NULL,    -- VD: "Kiểm tra thời gian tối thiểu"
    loai_kiem_tra VARCHAR(50) NOT NULL,     -- "ThoiGian", "TaiLieu", "KinhPhi", "Custom"
    tham_so JSONB,                          -- Lưu điều kiện dạng JSON
    thong_bao_loi TEXT,                     -- Thông báo khi không đạt
    is_active BOOLEAN DEFAULT TRUE,
    thu_tu_kiem_tra INT DEFAULT 0,          -- Thứ tự kiểm tra
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON COLUMN dieu_kien_tu_dong.tham_so IS 'VD: {"min_days_before": 30, "required_docs": ["CV", "To trinh"]}';

-- ================================================
-- BẢNG NGƯỜI DÙNG (SSO)
-- ================================================

CREATE TABLE nguoi_dung (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('VienChuc','NguoiDuyet','Admin')),
    ma_vien_chuc UUID,
    ma_nguoi_duyet UUID,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_vienchuc FOREIGN KEY (ma_vien_chuc) REFERENCES vien_chuc(ma_vien_chuc) ON DELETE SET NULL,
    CONSTRAINT fk_user_nguoiduyet FOREIGN KEY (ma_nguoi_duyet) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL,
    CONSTRAINT chk_role_mapping CHECK (
        (role = 'VienChuc' AND ma_vien_chuc IS NOT NULL AND ma_nguoi_duyet IS NULL) OR
        (role = 'NguoiDuyet' AND ma_nguoi_duyet IS NOT NULL AND ma_vien_chuc IS NULL) OR
        (role = 'Admin')
    )
);

-- ================================================
-- BẢNG ROLES & USER_ROLES (RBAC)
-- ================================================

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    ngay_gan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_userrole_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_userrole_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    CONSTRAINT uk_user_role UNIQUE(user_id, role_id)
);

-- ================================================
-- BẢNG HỒ SƠ ĐI NƯỚC NGOÀI (Enhanced)
-- ================================================

CREATE TABLE ho_so_di_nuoc_ngoai (
    ma_ho_so UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_vien_chuc UUID NOT NULL,
    loai_chuyen_di UUID NOT NULL,
    nguon_kinh_phi UUID NOT NULL,
    quoc_gia_den VARCHAR(255),
    to_chuc_moi VARCHAR(500),
    thoi_gian_bat_dau DATE NOT NULL,
    thoi_gian_ket_thuc DATE NOT NULL,
    muc_dich TEXT,
    kinh_phi_du_kien DECIMAL(15,2),
    
    -- Trạng thái workflow
    trang_thai VARCHAR(50) DEFAULT 'MoiTao',
    -- Các trạng thái:
    -- 'MoiTao' → 'DangKiemTraTuDong' → 'ChoChiBoDuyet' (nếu Đảng viên)
    -- → 'ChoDangUyDuyet' (nếu Đảng viên) → 'ChoDonViDuyet' 
    -- → 'ChoTCHCDuyet' → 'ChoBGHDuyet' → 'DaDuyet' → 'DangThucHien'
    -- → 'ChoBaoCao' → 'HoanTat' / 'TuChoi' / 'BoSung'
    
    muc_do_uu_tien VARCHAR(20) DEFAULT 'BinhThuong',
    ghi_chu TEXT,
    
    -- Tracking
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoi_tao UUID,
    
    CONSTRAINT fk_hoso_vienchuc FOREIGN KEY (ma_vien_chuc) REFERENCES vien_chuc(ma_vien_chuc) ON DELETE CASCADE,
    CONSTRAINT fk_hoso_loaidi FOREIGN KEY (loai_chuyen_di) REFERENCES loai_chuyen_di(ma_loai) ON DELETE SET NULL,
    CONSTRAINT fk_hoso_kinhphi FOREIGN KEY (nguon_kinh_phi) REFERENCES nguon_kinh_phi(ma_kinh_phi) ON DELETE SET NULL,
    CONSTRAINT fk_hoso_nguoitao FOREIGN KEY (nguoi_tao) REFERENCES nguoi_dung(user_id) ON DELETE SET NULL
);

-- ================================================
-- BẢNG HỒ SƠ DUYỆT (Multi-level Approval)
-- ================================================

CREATE TABLE ho_so_duyet (
    ma_duyet UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    ma_nguoi_duyet UUID NOT NULL,          -- FK → nguoi_duyet
    cap_duyet INT NOT NULL,                 -- 1=Chi bộ, 2=Đảng ủy, 3=Đơn vị, 4=TCNS, 5=BGH, 6=Báo cáo
    vai_tro_duyet VARCHAR(100) NOT NULL,    -- "BiThuChiBo", "BiThuDangUy", "TruongDonVi", "TCNS", "BGH"
    trang_thai VARCHAR(50) DEFAULT 'ChoDuyet',  -- 'ChoDuyet', 'DaDuyet', 'TuChoi', 'YeuCauBoSung', 'BoQua'
    y_kien TEXT,
    ngay_duyet TIMESTAMP,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_duyet_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_duyet_nguoi FOREIGN KEY (nguoi_duyet_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL
);

CREATE INDEX idx_hosoduyet_mahoso ON ho_so_duyet(ma_ho_so);
CREATE INDEX idx_hosoduyet_capduyet ON ho_so_duyet(cap_duyet);
CREATE INDEX idx_hosoduyet_trangthai ON ho_so_duyet(trang_thai);

-- ================================================
-- BẢNG TÀI LIỆU ĐÍNH KÈM
-- ================================================

CREATE TABLE tai_lieu_dinh_kem (
    ma_tai_lieu UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    loai_tai_lieu VARCHAR(100) NOT NULL,    -- "DonDeNghi", "ToTrinh", "GiayMoi", "BaoCaoSauChuyen", "Other"
    ten_file VARCHAR(500) NOT NULL,
    duong_dan_file TEXT NOT NULL,
    kich_thuoc_file BIGINT,
    ngay_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nguoi_upload UUID,
    
    CONSTRAINT fk_tailieu_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_tailieu_nguoi FOREIGN KEY (nguoi_upload) REFERENCES nguoi_dung(user_id) ON DELETE SET NULL
);

-- ================================================
-- BẢNG QUYẾT ĐỊNH (Sinh sau khi BGH duyệt)
-- ================================================

CREATE TABLE quyet_dinh (
    ma_quyet_dinh UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL UNIQUE,          -- 1-1 với hồ sơ
    so_quyet_dinh VARCHAR(50) NOT NULL UNIQUE,  -- VD: "123/QĐ-TVU"
    ngay_ban_hanh DATE NOT NULL DEFAULT CURRENT_DATE,
    nguoi_ky_id UUID,                       -- Người ký (thường là Hiệu trưởng)
    file_pdf_path TEXT,                     -- Đường dẫn file PDF quyết định
    noi_dung_quyet_dinh TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_quyetdinh_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_quyetdinh_nguoiky FOREIGN KEY (nguoi_ky_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL
);

-- ================================================
-- BẢNG THÔNG BÁO (Gửi tự động sau khi có quyết định)
-- ================================================

CREATE TABLE thong_bao (
    ma_thong_bao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    loai_thong_bao VARCHAR(50) NOT NULL,    -- "QuyetDinhDuyet", "YeuCauBoSung", "TuChoi", "NhacNhoBaoCao"
    nguoi_nhan UUID NOT NULL,               -- FK → nguoi_dung
    tieu_de VARCHAR(500) NOT NULL,
    noi_dung TEXT NOT NULL,
    da_doc BOOLEAN DEFAULT FALSE,
    da_gui_email BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_doc TIMESTAMP,
    
    CONSTRAINT fk_thongbao_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_thongbao_nguoi FOREIGN KEY (nguoi_nhan) REFERENCES nguoi_dung(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_thongbao_nguoinhan ON thong_bao(nguoi_nhan);
CREATE INDEX idx_thongbao_dadoc ON thong_bao(da_doc);

-- ================================================
-- BẢNG BÁO CÁO SAU CHUYẾN ĐI (Enhanced)
-- ================================================

CREATE TABLE bao_cao_sau_chuyen_di (
    ma_bao_cao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL UNIQUE,
    noi_dung_bao_cao TEXT NOT NULL,
    ket_qua_dat_duoc TEXT,
    kien_nghi TEXT,
    tai_lieu_kem TEXT,
    
    -- Review từ Chi bộ (nếu là Đảng viên)
    chi_bo_danh_gia TEXT,
    chi_bo_nguoi_danh_gia UUID,            -- FK → nguoi_duyet
    chi_bo_ngay_danh_gia TIMESTAMP,
    
    -- Phòng TCNS ký số hoàn tất
    tcns_nguoi_ky UUID,                     -- FK → nguoi_duyet
    tcns_ngay_ky TIMESTAMP,
    tcns_y_kien TEXT,

    trang_thai VARCHAR(50) DEFAULT 'MoiTao',  -- 'MoiTao', 'ChoChiBoDanhGia', 'ChoTCNSKy', 'HoanTat'
    ngay_nop TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_hoan_tat TIMESTAMP,
    
    CONSTRAINT fk_baocao_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_baocao_chibo FOREIGN KEY (chi_bo_nguoi_danh_gia) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL,
    CONSTRAINT fk_baocao_tchc FOREIGN KEY (tchc_nguoi_ky) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL
);

-- ================================================
-- BẢNG CHỮ KÝ SỐ
-- ================================================

CREATE TABLE chu_ky_so (
    ma_chu_ky UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    loai_van_ban VARCHAR(50) NOT NULL,      -- "DonDeNghi", "YKienChiBo", "YKienDangUy", "XacNhanDonVi", "ToTrinhTCHC", "PheDuyetBGH", "BaoCaoSauChuyen"
    nguoi_ky_id UUID NOT NULL,
    cap_duyet INT,                          -- Tương ứng với ho_so_duyet.cap_duyet
    chu_ky_data TEXT,                       -- Chuỗi mã hóa chữ ký (hash/encrypted)
    thoi_gian_ky TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    
    CONSTRAINT fk_chuky_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_chuky_nguoi FOREIGN KEY (nguoi_ky_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL
);

CREATE INDEX idx_chuky_mahoso ON chu_ky_so(ma_ho_so);

-- ================================================
-- BẢNG LỊCH SỬ HỒ SƠ
-- ================================================

CREATE TABLE lich_su_ho_so (
    ma_lich_su UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    nguoi_thao_tac UUID,
    hanh_dong VARCHAR(100) NOT NULL,        -- "TaoMoi", "CapNhat", "ChoBoDuyet", "DuocDuyet", "BiTuChoi", "YeuCauBoSung", "NopBaoCao", "HoanTat"
    trang_thai_cu VARCHAR(50),
    trang_thai_moi VARCHAR(50),
    ghi_chu TEXT,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_lichsu_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_lichsu_nguoi FOREIGN KEY (nguoi_thao_tac) REFERENCES nguoi_dung(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_lichsu_mahoso ON lich_su_ho_so(ma_ho_so);
CREATE INDEX idx_lichsu_thoigian ON lich_su_ho_so(thoi_gian DESC);

-- ================================================
-- BẢNG NHẬT KÝ AUDIT
-- ================================================

CREATE TABLE nhat_ky_audit (
    ma_audit UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_user ON nhat_ky_audit(user_id);
CREATE INDEX idx_audit_time ON nhat_ky_audit(thoi_gian DESC);

-- ================================================
-- ADD FOREIGN KEYS for cross-references
-- ================================================

ALTER TABLE vien_chuc 
    ADD CONSTRAINT fk_vienchuc_chibo FOREIGN KEY (ma_chi_bo) REFERENCES chi_bo(ma_chi_bo) ON DELETE SET NULL,
    ADD CONSTRAINT fk_vienchuc_donvi FOREIGN KEY (ma_don_vi) REFERENCES don_vi_quan_ly(ma_don_vi) ON DELETE RESTRICT;

ALTER TABLE don_vi_quan_ly
    ADD CONSTRAINT fk_donvi_truong FOREIGN KEY (truong_don_vi_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

ALTER TABLE chi_bo
    ADD CONSTRAINT fk_chibo_bithu FOREIGN KEY (bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

ALTER TABLE dang_uy
    ADD CONSTRAINT fk_danguy_bithu FOREIGN KEY (bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL,
    ADD CONSTRAINT fk_danguy_phobithu FOREIGN KEY (pho_bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- ================================================
-- TRIGGERS
-- ================================================

-- 1. Auto-update timestamp
CREATE OR REPLACE FUNCTION cap_nhat_ngay_cap_nhat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ngay_cap_nhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_vienchuc BEFORE UPDATE ON vien_chuc
    FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_update_nguoidung BEFORE UPDATE ON nguoi_dung
    FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trg_update_hoso BEFORE UPDATE ON ho_so_di_nuoc_ngoai
    FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

-- 2. Kiểm tra điều kiện tự động khi tạo hồ sơ
CREATE OR REPLACE FUNCTION kiem_tra_dieu_kien_tu_dong()
RETURNS TRIGGER AS $$
DECLARE
    v_dieu_kien RECORD;
    v_ngay_bat_dau DATE;
    v_so_ngay_truoc INT;
BEGIN
    v_ngay_bat_dau := NEW.thoi_gian_bat_dau;
    
    -- Lấy tất cả điều kiện active
    FOR v_dieu_kien IN 
        SELECT * FROM dieu_kien_tu_dong 
        WHERE is_active = TRUE 
        ORDER BY thu_tu_kiem_tra
    LOOP
        -- Ví dụ: Kiểm tra thời gian tối thiểu trước khi đi
        IF v_dieu_kien.loai_kiem_tra = 'ThoiGian' THEN
            v_so_ngay_truoc := (v_dieu_kien.tham_so->>'min_days_before')::INT;
            
            IF v_ngay_bat_dau - CURRENT_DATE < v_so_ngay_truoc THEN
                -- Tự động từ chối
                NEW.trang_thai := 'TuChoi';
                NEW.ghi_chu := v_dieu_kien.thong_bao_loi;
                
                -- Ghi log
                INSERT INTO lich_su_ho_so (ma_ho_so, hanh_dong, trang_thai_moi, ghi_chu)
                VALUES (NEW.ma_ho_so, 'TuChoiTuDong', 'TuChoi', v_dieu_kien.thong_bao_loi);
                
                RETURN NEW;
            END IF;
        END IF;
    END LOOP;
    
    -- Nếu qua hết điều kiện, chuyển sang bước tiếp theo
    IF NEW.trang_thai = 'MoiTao' THEN
        NEW.trang_thai := 'DangKiemTraTuDong';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kiem_tra_dieu_kien
    BEFORE INSERT ON ho_so_di_nuoc_ngoai
    FOR EACH ROW EXECUTE FUNCTION kiem_tra_dieu_kien_tu_dong();

-- 3. Auto-assign workflow dựa theo Đảng viên hay không
CREATE OR REPLACE FUNCTION assign_workflow_auto()
RETURNS TRIGGER AS $$
DECLARE
    v_is_dang_vien BOOLEAN;
    v_ma_chi_bo UUID;
    v_ma_don_vi UUID;
    v_bi_thu_chi_bo UUID;
    v_bi_thu_dang_uy UUID;
    v_truong_don_vi UUID;
    v_nguoi_tchc UUID;
    v_bgh UUID;
BEGIN
    -- Lấy thông tin viên chức
    SELECT vc.is_dang_vien, vc.ma_chi_bo, vc.ma_don_vi
    INTO v_is_dang_vien, v_ma_chi_bo, v_ma_don_vi
    FROM vien_chuc vc
    WHERE vc.ma_vien_chuc = NEW.ma_vien_chuc;
    
    -- Nếu là Đảng viên: tạo workflow với Chi bộ
    IF v_is_dang_vien = TRUE THEN
        -- Lấy Bí thư Chi bộ
        SELECT cb.bi_thu_id INTO v_bi_thu_chi_bo
        FROM chi_bo cb
        WHERE cb.ma_chi_bo = v_ma_chi_bo AND cb.is_active = TRUE;
        
        IF v_bi_thu_chi_bo IS NOT NULL THEN
            INSERT INTO ho_so_duyet (ma_ho_so, nguoi_duyet_id, cap_duyet, vai_tro_duyet, trang_thai)
            VALUES (NEW.ma_ho_so, v_bi_thu_chi_bo, 1, 'BiThuChiBo', 'ChoDuyet');
        END IF;
        
        -- Lấy Bí thư Đảng ủy
        SELECT du.bi_thu_id INTO v_bi_thu_dang_uy
        FROM dang_uy du
        WHERE du.is_active = TRUE
        LIMIT 1;
        
        IF v_bi_thu_dang_uy IS NOT NULL THEN
            INSERT INTO ho_so_duyet (ma_ho_so, nguoi_duyet_id, cap_duyet, vai_tro_duyet, trang_thai)
            VALUES (NEW.ma_ho_so, v_bi_thu_dang_uy, 2, 'BiThuDangUy', 'ChoDuyet');
        END IF;
        
        -- Cập nhật trạng thái hồ sơ
        UPDATE ho_so_di_nuoc_ngoai 
        SET trang_thai = 'ChoChiBoDuyet'
        WHERE ma_ho_so = NEW.ma_ho_so;
    ELSE
        -- Không phải Đảng viên: bỏ qua Chi bộ, bắt đầu từ Đơn vị
        UPDATE ho_so_di_nuoc_ngoai 
        SET trang_thai = 'ChoDonViDuyet'
        WHERE ma_ho_so = NEW.ma_ho_so;
    END IF;
    
    -- Lấy Trưởng đơn vị
    SELECT dv.truong_don_vi_id INTO v_truong_don_vi
    FROM don_vi_quan_ly dv
    WHERE dv.ma_don_vi = v_ma_don_vi AND dv.is_active = TRUE;
    
    IF v_truong_don_vi IS NOT NULL THEN
        INSERT INTO ho_so_duyet (ma_ho_so, nguoi_duyet_id, cap_duyet, vai_tro_duyet, trang_thai)
        VALUES (NEW.ma_ho_so, v_truong_don_vi, 3, 'TruongDonVi', 'ChoDuyet');
    END IF;
    
    -- Lấy người TCHC (vai_tro = 'TCHC', cap_duyet = 4)
    SELECT nd.ma_nguoi_duyet INTO v_nguoi_tchc
    FROM nguoi_duyet nd
    WHERE nd.vai_tro = 'TCHC' AND nd.cap_duyet = 4 AND nd.is_active = TRUE
    LIMIT 1;
    
    IF v_nguoi_tchc IS NOT NULL THEN
        INSERT INTO ho_so_duyet (ma_ho_so, nguoi_duyet_id, cap_duyet, vai_tro_duyet, trang_thai)
        VALUES (NEW.ma_ho_so, v_nguoi_tchc, 4, 'TCHC', 'ChoDuyet');
    END IF;
    
    -- Lấy BGH (vai_tro = 'BGH', cap_duyet = 5)
    SELECT nd.ma_nguoi_duyet INTO v_bgh
    FROM nguoi_duyet nd
    WHERE nd.vai_tro = 'BGH' AND nd.cap_duyet = 5 AND nd.is_active = TRUE
    LIMIT 1;
    
    IF v_bgh IS NOT NULL THEN
        INSERT INTO ho_so_duyet (ma_ho_so, nguoi_duyet_id, cap_duyet, vai_tro_duyet, trang_thai)
        VALUES (NEW.ma_ho_so, v_bgh, 5, 'BGH', 'ChoDuyet');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_workflow
    AFTER INSERT ON ho_so_di_nuoc_ngoai
    FOR EACH ROW EXECUTE FUNCTION assign_workflow_auto();

-- 4. Ghi lịch sử khi thay đổi trạng thái
CREATE OR REPLACE FUNCTION ghi_lich_su_ho_so()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.trang_thai IS DISTINCT FROM NEW.trang_thai THEN
        INSERT INTO lich_su_ho_so (
            ma_ho_so, 
            hanh_dong, 
            trang_thai_cu, 
            trang_thai_moi,
            nguoi_thao_tac
        )
        VALUES (
            NEW.ma_ho_so,
            'ThayDoiTrangThai',
            OLD.trang_thai,
            NEW.trang_thai,
            NEW.nguoi_tao
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ghi_lich_su
    AFTER UPDATE ON ho_so_di_nuoc_ngoai
    FOR EACH ROW EXECUTE FUNCTION ghi_lich_su_ho_so();

-- 5. Xử lý workflow khi người duyệt hành động
CREATE OR REPLACE FUNCTION handle_approval_action()
RETURNS TRIGGER AS $$
DECLARE
    v_trang_thai_moi VARCHAR(50);
    v_cap_duyet_ke_tiep INT;
    v_is_dang_vien BOOLEAN;
    v_hieu_truong_id UUID;
BEGIN
    -- Nếu người duyệt từ chối
    IF NEW.trang_thai = 'TuChoi' THEN
        UPDATE ho_so_di_nuoc_ngoai
        SET trang_thai = 'TuChoi'
        WHERE ma_ho_so = NEW.ma_ho_so;
        
        RETURN NEW;
    END IF;
    
    -- Nếu yêu cầu bổ sung
    IF NEW.trang_thai = 'YeuCauBoSung' THEN
        UPDATE ho_so_di_nuoc_ngoai
        SET trang_thai = 'BoSung'
        WHERE ma_ho_so = NEW.ma_ho_so;
        
        RETURN NEW;
    END IF;
    
    -- Nếu duyệt: Chuyển sang bước tiếp theo
    IF NEW.trang_thai = 'DaDuyet' THEN
        -- Lấy thông tin Đảng viên
        SELECT vc.is_dang_vien INTO v_is_dang_vien
        FROM ho_so_di_nuoc_ngoai hs
        JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
        WHERE hs.ma_ho_so = NEW.ma_ho_so;
        
        -- Xác định trạng thái mới dựa trên cấp duyệt
        CASE NEW.cap_duyet
            WHEN 1 THEN  -- Chi bộ duyệt xong → Đảng ủy
                v_trang_thai_moi := 'ChoDangUyDuyet';
            WHEN 2 THEN  -- Đảng ủy duyệt xong → Đơn vị
                v_trang_thai_moi := 'ChoDonViDuyet';
            WHEN 3 THEN  -- Đơn vị duyệt xong → TCNS
                v_trang_thai_moi := 'ChoTCNSDuyet';
            WHEN 4 THEN  -- TCNS duyệt xong → BGH
                v_trang_thai_moi := 'ChoBGHDuyet';
            WHEN 5 THEN  -- BGH duyệt xong → Sinh quyết định
                v_trang_thai_moi := 'DaDuyet';
                
                -- Sinh quyết định tự động
                SELECT nd.ma_nguoi_duyet INTO v_hieu_truong_id
                FROM nguoi_duyet nd
                WHERE nd.vai_tro = 'BGH' AND nd.cap_duyet = 5 AND nd.is_active = TRUE
                LIMIT 1;
                
                INSERT INTO quyet_dinh (ma_ho_so, so_quyet_dinh, nguoi_ky_id, noi_dung_quyet_dinh)
                VALUES (
                    NEW.ma_ho_so, 
                    'QD-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || substring(NEW.ma_ho_so::text, 1, 8),
                    v_hieu_truong_id,
                    'Quyết định cử viên chức đi nước ngoài'
                );
                
                -- Gửi thông báo
                INSERT INTO thong_bao (ma_ho_so, loai_thong_bao, nguoi_nhan, tieu_de, noi_dung)
                SELECT 
                    NEW.ma_ho_so,
                    'QuyetDinhDuyet',
                    nd.user_id,
                    'Hồ sơ đã được phê duyệt',
                    'Hồ sơ của bạn đã được Ban Giám hiệu phê duyệt. Vui lòng xem quyết định đính kèm.'
                FROM ho_so_di_nuoc_ngoai hs
                JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
                JOIN nguoi_dung nd ON nd.ma_vien_chuc = vc.ma_vien_chuc
                WHERE hs.ma_ho_so = NEW.ma_ho_so;
            ELSE
                v_trang_thai_moi := NULL;
        END CASE;
        
        IF v_trang_thai_moi IS NOT NULL THEN
            UPDATE ho_so_di_nuoc_ngoai
            SET trang_thai = v_trang_thai_moi
            WHERE ma_ho_so = NEW.ma_ho_so;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_handle_approval
    AFTER UPDATE ON ho_so_duyet
    FOR EACH ROW 
    WHEN (OLD.trang_thai IS DISTINCT FROM NEW.trang_thai)
    EXECUTE FUNCTION handle_approval_action();

-- ================================================
-- VIEWS for Reporting
-- ================================================

-- 1. Tổng quan hồ sơ với workflow
CREATE OR REPLACE VIEW vw_ho_so_tong_quan AS
SELECT 
    hs.ma_ho_so,
    hs.trang_thai,
    hs.muc_do_uu_tien,
    vc.ho_ten AS ten_vien_chuc,
    vc.is_dang_vien,
    dv.ten_don_vi,
    ld.ten_loai AS loai_chuyen_di,
    hs.quoc_gia_den,
    hs.thoi_gian_bat_dau,
    hs.thoi_gian_ket_thuc,
    hs.ngay_tao,
    COUNT(DISTINCT hsd.ma_duyet) AS tong_buoc_duyet,
    COUNT(DISTINCT CASE WHEN hsd.trang_thai = 'DaDuyet' THEN hsd.ma_duyet END) AS so_buoc_da_duyet,
    MAX(hsd.ngay_duyet) AS ngay_duyet_gan_nhat
FROM ho_so_di_nuoc_ngoai hs
JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
LEFT JOIN loai_chuyen_di ld ON hs.loai_chuyen_di = ld.ma_loai
LEFT JOIN ho_so_duyet hsd ON hs.ma_ho_so = hsd.ma_ho_so
GROUP BY hs.ma_ho_so, vc.ho_ten, vc.is_dang_vien, dv.ten_don_vi, ld.ten_loai;

-- 2. Chi tiết quy trình duyệt
CREATE OR REPLACE VIEW vw_chi_tiet_duyet AS
SELECT 
    hs.ma_ho_so,
    vc.ho_ten AS ten_vien_chuc,
    hsd.cap_duyet,
    hsd.vai_tro_duyet,
    nd.ho_ten AS ten_nguoi_duyet,
    hsd.trang_thai,
    hsd.y_kien,
    hsd.ngay_duyet,
    hsd.ngay_tao AS ngay_gan
FROM ho_so_duyet hsd
JOIN ho_so_di_nuoc_ngoai hs ON hsd.ma_ho_so = hs.ma_ho_so
JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
LEFT JOIN nguoi_duyet nd ON hsd.nguoi_duyet_id = nd.ma_nguoi_duyet
ORDER BY hs.ma_ho_so, hsd.cap_duyet;

-- 3. Thống kê hiệu suất duyệt
CREATE OR REPLACE VIEW vw_thong_ke_duyet AS
SELECT 
    nd.ho_ten AS ten_nguoi_duyet,
    nd.vai_tro,
    nd.cap_duyet,
    COUNT(DISTINCT hsd.ma_ho_so) AS tong_so_duyet,
    COUNT(DISTINCT CASE WHEN hsd.trang_thai = 'DaDuyet' THEN hsd.ma_ho_so END) AS so_da_duyet,
    COUNT(DISTINCT CASE WHEN hsd.trang_thai = 'TuChoi' THEN hsd.ma_ho_so END) AS so_tu_choi,
    COUNT(DISTINCT CASE WHEN hsd.trang_thai = 'ChoDuyet' THEN hsd.ma_ho_so END) AS so_cho_duyet,
    AVG(EXTRACT(EPOCH FROM (hsd.ngay_duyet - hsd.ngay_tao))/86400.0) AS thoi_gian_duyet_trung_binh_ngay
FROM nguoi_duyet nd
LEFT JOIN ho_so_duyet hsd ON nd.ma_nguoi_duyet = hsd.nguoi_duyet_id
GROUP BY nd.ma_nguoi_duyet, nd.ho_ten, nd.vai_tro, nd.cap_duyet;

-- ================================================
-- UTILITY FUNCTIONS
-- ================================================

-- 1. Lấy hồ sơ theo trạng thái và ưu tiên
CREATE OR REPLACE FUNCTION get_ho_so_theo_trang_thai(
    p_trang_thai VARCHAR(50),
    p_uu_tien VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    ma_ho_so UUID,
    ten_vien_chuc VARCHAR(255),
    trang_thai VARCHAR(50),
    muc_do_uu_tien VARCHAR(20),
    ngay_tao TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hs.ma_ho_so,
        vc.ho_ten,
        hs.trang_thai,
        hs.muc_do_uu_tien,
        hs.ngay_tao
    FROM ho_so_di_nuoc_ngoai hs
    JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
    WHERE hs.trang_thai = p_trang_thai
        AND (p_uu_tien IS NULL OR hs.muc_do_uu_tien = p_uu_tien)
    ORDER BY 
        CASE hs.muc_do_uu_tien
            WHEN 'KhanCap' THEN 1
            WHEN 'Cao' THEN 2
            WHEN 'BinhThuong' THEN 3
        END,
        hs.ngay_tao;
END;
$$ LANGUAGE plpgsql;

-- 2. Thống kê hồ sơ theo tháng
CREATE OR REPLACE FUNCTION thong_ke_ho_so_theo_thang(
    p_thang INT,
    p_nam INT
)
RETURNS TABLE (
    trang_thai VARCHAR(50),
    so_luong BIGINT,
    ti_le NUMERIC(5,2)
) AS $$
DECLARE
    v_tong BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_tong
    FROM ho_so_di_nuoc_ngoai
    WHERE EXTRACT(MONTH FROM ngay_tao) = p_thang
        AND EXTRACT(YEAR FROM ngay_tao) = p_nam;
    
    RETURN QUERY
    SELECT 
        hs.trang_thai,
        COUNT(*) AS so_luong,
        ROUND((COUNT(*)::NUMERIC / NULLIF(v_tong, 0)) * 100, 2) AS ti_le
    FROM ho_so_di_nuoc_ngoai hs
    WHERE EXTRACT(MONTH FROM hs.ngay_tao) = p_thang
        AND EXTRACT(YEAR FROM hs.ngay_tao) = p_nam
    GROUP BY hs.trang_thai
    ORDER BY so_luong DESC;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Database Schema v4.0 đã được tạo thành công!';
    RAISE NOTICE 'Hệ thống: Quản lý Hồ sơ Đi Nước Ngoài - TVU';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Các tính năng mới:';
    RAISE NOTICE '  ✓ Workflow đầy đủ 7 cấp duyệt';
    RAISE NOTICE '  ✓ Hỗ trợ quy trình Đảng (Chi bộ + Đảng ủy)';
    RAISE NOTICE '  ✓ Kiểm tra điều kiện tự động';
    RAISE NOTICE '  ✓ Sinh quyết định + thông báo tự động';
    RAISE NOTICE '  ✓ Báo cáo sau chuyến đi có review Chi bộ';
    RAISE NOTICE '  ✓ 14 bảng + 5 triggers + 3 views + 2 functions';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Tiếp theo: Load dữ liệu mẫu từ seed_data_v4.sql';
    RAISE NOTICE '==================================================';
END $$;
