-- ================================================
-- SCHEMA DATABASE: QLHS Đi Nước Ngoài
-- Trường Đại học Trà Vinh
-- Encoding: UTF-8
-- Version: 3.1 - Updated November 30, 2025
-- Improvements:
--   - Standardized naming conventions (Vietnamese with underscore)
--   - Added roles & user_roles tables for better permission management
--   - Auto-assign approver workflow with triggers
--   - Enhanced history tracking with approver info
--   - Standardized status naming (PascalCase)
--   - Added ON DELETE SET NULL for FK relationships
--   - FIXED: Data integrity issues with foreign key references
--   - FIXED: Trigger logic to use proper user_id references
--   - ADDED: Enhanced views for reporting (vw_ho_so_tong_quan, vw_chi_tiet_duyet, vw_thong_ke_duyet)
--   - ADDED: Utility functions (get_ho_so_theo_trang_thai, thong_ke_ho_so_theo_thang)
--   - ENHANCED: Approval workflow with better status tracking
-- ================================================

SET client_encoding = 'UTF8';

-- Drop tables if exists (for clean reinstall)
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS lich_su_ho_so CASCADE;
DROP TABLE IF EXISTS nhat_ky_audit CASCADE;
DROP TABLE IF EXISTS chu_ky_so CASCADE;
DROP TABLE IF EXISTS bao_cao_sau_chuyen_di CASCADE;
DROP TABLE IF EXISTS ho_so_duyet CASCADE;
DROP TABLE IF EXISTS tai_lieu_dinh_kem CASCADE;
DROP TABLE IF EXISTS ho_so_di_nuoc_ngoai CASCADE;
DROP TABLE IF EXISTS nguoi_dung CASCADE;
DROP TABLE IF EXISTS nguon_kinh_phi CASCADE;
DROP TABLE IF EXISTS loai_chuyen_di CASCADE;
DROP TABLE IF EXISTS nguoi_duyet CASCADE;
DROP TABLE IF EXISTS vien_chuc CASCADE;

-- ================================================
-- BẢNG VIÊN CHỨC
-- ================================================

CREATE TABLE vien_chuc (
    ma_vien_chuc UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE,
    so_cccd VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_dang_vien BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- BẢNG NGƯỜI DUYỆT
-- ================================================

CREATE TABLE nguoi_duyet (
    ma_nguoi_duyet UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(100) NOT NULL,
    chuc_danh VARCHAR(100),
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
-- BẢNG NGƯỜI DÙNG (SSO - Single Sign On)
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
        (role = 'Admin' AND ma_vien_chuc IS NULL AND ma_nguoi_duyet IS NULL)
    )
);

-- ================================================
-- BẢNG ROLES (Phân quyền nâng cao)
-- ================================================

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level INT DEFAULT 0, -- Cấp độ phê duyệt (0=VienChuc, 1=TruongKhoa, 2=BGH, 3=Admin)
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    ngay_gan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, role_id),
    CONSTRAINT fk_userroles_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_userroles_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- ================================================
-- BẢNG HỒ SƠ ĐI NƯỚC NGOÀI
-- ================================================

CREATE TABLE ho_so_di_nuoc_ngoai (
    ma_ho_so UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_vien_chuc UUID NOT NULL,
    ma_loai UUID NOT NULL,
    ma_kinh_phi UUID NOT NULL,
    ly_do_chuyen_di TEXT NOT NULL,
    thoi_gian_bat_dau DATE NOT NULL,
    thoi_gian_ket_thuc DATE NOT NULL,
    trang_thai VARCHAR(20) DEFAULT 'MoiTao' CHECK (trang_thai IN ('MoiTao','DangXuLy','DaDuyet','TuChoi')),
    priority VARCHAR(20) DEFAULT 'TrungBinh' CHECK (priority IN ('Cao','TrungBinh','Thap')),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vienchuc FOREIGN KEY (ma_vien_chuc) REFERENCES vien_chuc(ma_vien_chuc),
    CONSTRAINT fk_loai FOREIGN KEY (ma_loai) REFERENCES loai_chuyen_di(ma_loai),
    CONSTRAINT fk_kinhphi FOREIGN KEY (ma_kinh_phi) REFERENCES nguon_kinh_phi(ma_kinh_phi),
    CONSTRAINT chk_thoigian CHECK (thoi_gian_ket_thuc >= thoi_gian_bat_dau)
);

-- ================================================
-- BẢNG TÀI LIỆU ĐÍNH KÈM
-- ================================================

CREATE TABLE tai_lieu_dinh_kem (
    ma_tai_lieu UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    ten_tai_lieu VARCHAR(255) NOT NULL,
    loai_tai_lieu VARCHAR(100),
    duong_dan VARCHAR(500) NOT NULL,
    is_tu_sinh BOOLEAN DEFAULT FALSE,
    kich_thuoc BIGINT,
    ngay_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE
);

-- ================================================
-- BẢNG HỒ SƠ DUYỆT
-- ================================================

CREATE TABLE ho_so_duyet (
    ma_ho_so_duyet UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    ma_nguoi_duyet UUID NOT NULL,
    ngay_duyet TIMESTAMP,
    trang_thai VARCHAR(20) DEFAULT 'ChoDuyet' CHECK (trang_thai IN ('ChoDuyet','Duyet','TuChoi')),
    y_kien TEXT,
    thu_tu_duyet INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hosoduyet_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_hosoduyet_nguoiduyet FOREIGN KEY (ma_nguoi_duyet) REFERENCES nguoi_duyet(ma_nguoi_duyet),
    CONSTRAINT uq_hoso_thutu UNIQUE(ma_ho_so, thu_tu_duyet)
);

-- ================================================
-- BẢNG BÁO CÁO SAU CHUYẾN ĐI
-- ================================================

CREATE TABLE bao_cao_sau_chuyen_di (
    ma_bao_cao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_nop TIMESTAMP,
    trang_thai VARCHAR(20) DEFAULT 'ChuaNop' CHECK (trang_thai IN ('ChuaNop','DaNop','DaDuyet','TuChoi')),
    duong_dan_file_pdf VARCHAR(500),
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_baocao_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE
);

-- ================================================
-- BẢNG CHỮ KÝ SỐ
-- ================================================

CREATE TABLE chu_ky_so (
    ma_chu_ky UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doi_tuong_id UUID NOT NULL,
    loai_doi_tuong VARCHAR(20) NOT NULL CHECK (loai_doi_tuong IN ('HoSo','BaoCao')),
    ngay_ky TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loai_ky VARCHAR(50) NOT NULL CHECK (loai_ky IN ('ChuKySoVienChuc','ChuKySoNguoiDuyet')),
    duong_dan_tai_lieu_ky VARCHAR(500)
);

-- ================================================
-- BẢNG LỊCH SỬ HỒ SƠ (Enhanced with approver tracking)
-- ================================================

CREATE TABLE lich_su_ho_so (
    ma_history UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    trang_thai_cu VARCHAR(20),
    trang_thai_moi VARCHAR(20),
    nguoi_cap_nhat UUID,
    ma_nguoi_duyet UUID, -- Track which approver made the change
    thu_tu_duyet INT, -- Track approval level
    hanh_dong VARCHAR(100), -- Action type: TaoMoi, CapNhat, PheDuyet, TuChoi
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ghi_chu TEXT,
    CONSTRAINT fk_history_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (nguoi_cap_nhat) REFERENCES nguoi_dung(user_id),
    CONSTRAINT fk_history_nguoiduyet FOREIGN KEY (ma_nguoi_duyet) REFERENCES nguoi_duyet(ma_nguoi_duyet)
);

-- ================================================
-- BẢNG NHẬT KÝ AUDIT
-- ================================================

CREATE TABLE nhat_ky_audit (
    ma_log UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doi_tuong_id UUID NOT NULL,
    loai_doi_tuong VARCHAR(20) NOT NULL CHECK (loai_doi_tuong IN ('HoSo','BaoCao')),
    hanh_dong VARCHAR(100) NOT NULL,
    ma_nguoi_thuc_hien UUID,
    chi_tiet JSONB,
    ip_address VARCHAR(45),
    ngay_thuc_hien TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (ma_nguoi_thuc_hien) REFERENCES nguoi_dung(user_id)
);

-- ================================================
-- INDEXES
-- ================================================

CREATE INDEX idx_hoso_trangthai_priority ON ho_so_di_nuoc_ngoai(trang_thai, priority);
CREATE INDEX idx_hoso_ngaytao ON ho_so_di_nuoc_ngoai(ngay_tao DESC);
CREATE INDEX idx_hoso_mavienchuc ON ho_so_di_nuoc_ngoai(ma_vien_chuc);
CREATE INDEX idx_hosoduyet_mahoso ON ho_so_duyet(ma_ho_so);
CREATE INDEX idx_hosoduyet_nguoiduyet ON ho_so_duyet(ma_nguoi_duyet);
CREATE INDEX idx_chuky_doituong ON chu_ky_so(doi_tuong_id, loai_doi_tuong);
CREATE INDEX idx_audit_doituong ON nhat_ky_audit(doi_tuong_id, loai_doi_tuong);
CREATE INDEX idx_audit_ngay ON nhat_ky_audit(ngay_thuc_hien DESC);
CREATE INDEX idx_nguoidung_email ON nguoi_dung(email);
CREATE INDEX idx_vienchuc_email ON vien_chuc(email);

-- ================================================
-- TRIGGER AUTO-ASSIGN NGƯỜI DUYỆT
-- ================================================

CREATE OR REPLACE FUNCTION assign_nguoi_duyet_auto()
RETURNS TRIGGER AS $$
DECLARE
    v_nguoi_duyet_khoa UUID;
    v_nguoi_duyet_bgh UUID;
    v_user_id UUID;
BEGIN
    -- FIXED: Tìm user_id của viên chức từ bảng nguoi_dung
    SELECT user_id INTO v_user_id
    FROM nguoi_dung 
    WHERE ma_vien_chuc = NEW.ma_vien_chuc 
    AND role = 'VienChuc'
    LIMIT 1;

    -- Tìm Trưởng khoa (cấp 1)
    SELECT ma_nguoi_duyet INTO v_nguoi_duyet_khoa
    FROM nguoi_duyet
    WHERE vai_tro = 'TruongKhoa'
    ORDER BY ngay_tao ASC
    LIMIT 1;

    -- Tìm BGH (cấp 2)
    SELECT ma_nguoi_duyet INTO v_nguoi_duyet_bgh
    FROM nguoi_duyet
    WHERE vai_tro = 'BGH'
    ORDER BY ngay_tao ASC
    LIMIT 1;

    -- Tạo bước duyệt cấp 1 (Trưởng khoa)
    IF v_nguoi_duyet_khoa IS NOT NULL THEN
        INSERT INTO ho_so_duyet(ma_ho_so, ma_nguoi_duyet, thu_tu_duyet, trang_thai)
        VALUES (NEW.ma_ho_so, v_nguoi_duyet_khoa, 1, 'ChoDuyet');
    END IF;

    -- Tạo bước duyệt cấp 2 (BGH)
    IF v_nguoi_duyet_bgh IS NOT NULL THEN
        INSERT INTO ho_so_duyet(ma_ho_so, ma_nguoi_duyet, thu_tu_duyet, trang_thai)
        VALUES (NEW.ma_ho_so, v_nguoi_duyet_bgh, 2, 'ChoDuyet');
    END IF;

    -- FIXED: Sử dụng user_id thay vì ma_vien_chuc
    INSERT INTO lich_su_ho_so(
        ma_ho_so, trang_thai_cu, trang_thai_moi, nguoi_cap_nhat, hanh_dong, ghi_chu
    )
    VALUES (
        NEW.ma_ho_so, NULL, 'MoiTao', v_user_id, 'TaoMoi', 'Tạo hồ sơ mới'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_nguoi_duyet
AFTER INSERT ON ho_so_di_nuoc_ngoai
FOR EACH ROW EXECUTE FUNCTION assign_nguoi_duyet_auto();

-- ================================================
-- TRIGGER LỊCH SỬ HỒ SƠ (Enhanced)
-- ================================================

CREATE OR REPLACE FUNCTION ghi_lich_su_ho_so()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    IF OLD.trang_thai IS DISTINCT FROM NEW.trang_thai THEN
        -- FIXED: Tìm user_id từ ma_vien_chuc
        SELECT user_id INTO v_user_id
        FROM nguoi_dung 
        WHERE ma_vien_chuc = NEW.ma_vien_chuc 
        AND role = 'VienChuc'
        LIMIT 1;

        INSERT INTO lich_su_ho_so(
            ma_ho_so, 
            trang_thai_cu, 
            trang_thai_moi, 
            nguoi_cap_nhat, 
            hanh_dong,
            ghi_chu
        )
        VALUES (
            NEW.ma_ho_so, 
            OLD.trang_thai, 
            NEW.trang_thai, 
            v_user_id, 
            'CapNhatTrangThai',
            'Tự động cập nhật trạng thái từ ' || OLD.trang_thai || ' sang ' || NEW.trang_thai
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_lich_su_ho_so
AFTER UPDATE ON ho_so_di_nuoc_ngoai
FOR EACH ROW EXECUTE FUNCTION ghi_lich_su_ho_so();

-- ================================================
-- TRIGGER AUTO-PROGRESS APPROVAL WORKFLOW (Enhanced)
-- ================================================

CREATE OR REPLACE FUNCTION handle_approval_progress()
RETURNS TRIGGER AS $$
DECLARE
    v_next_step INT;
    v_all_approved BOOLEAN;
    v_user_id UUID;
BEGIN
    -- FIXED: Lấy user_id của người duyệt
    SELECT user_id INTO v_user_id
    FROM nguoi_dung 
    WHERE ma_nguoi_duyet = NEW.ma_nguoi_duyet 
    AND role = 'NguoiDuyet'
    LIMIT 1;

    -- Khi một bước duyệt được approved
    IF NEW.trang_thai = 'Duyet' AND OLD.trang_thai = 'ChoDuyet' THEN
        
        -- Ghi lịch sử phê duyệt
        INSERT INTO lich_su_ho_so(
            ma_ho_so, trang_thai_cu, trang_thai_moi, nguoi_cap_nhat,
            ma_nguoi_duyet, thu_tu_duyet, hanh_dong, ghi_chu
        )
        VALUES (
            NEW.ma_ho_so, 'ChoDuyet', 'Duyet', v_user_id,
            NEW.ma_nguoi_duyet, NEW.thu_tu_duyet, 'PheDuyet',
            COALESCE(NEW.y_kien, 'Đã phê duyệt')
        );

        -- ENHANCED: Kiểm tra xem có bước tiếp theo không
        SELECT thu_tu_duyet INTO v_next_step
        FROM ho_so_duyet
        WHERE ma_ho_so = NEW.ma_ho_so 
        AND thu_tu_duyet > NEW.thu_tu_duyet
        AND trang_thai = 'ChoDuyet'
        ORDER BY thu_tu_duyet
        LIMIT 1;

        IF v_next_step IS NOT NULL THEN
            -- Vẫn còn bước duyệt tiếp theo
            UPDATE ho_so_di_nuoc_ngoai
            SET trang_thai = 'DangXuLy'
            WHERE ma_ho_so = NEW.ma_ho_so;
        ELSE
            -- Tất cả đã duyệt xong
            UPDATE ho_so_di_nuoc_ngoai
            SET trang_thai = 'DaDuyet'
            WHERE ma_ho_so = NEW.ma_ho_so;
        END IF;

    -- Khi một bước duyệt bị từ chối
    ELSIF NEW.trang_thai = 'TuChoi' AND OLD.trang_thai = 'ChoDuyet' THEN
        
        -- Ghi lịch sử từ chối
        INSERT INTO lich_su_ho_so(
            ma_ho_so, trang_thai_cu, trang_thai_moi, nguoi_cap_nhat,
            ma_nguoi_duyet, thu_tu_duyet, hanh_dong, ghi_chu
        )
        VALUES (
            NEW.ma_ho_so, 'ChoDuyet', 'TuChoi', v_user_id,
            NEW.ma_nguoi_duyet, NEW.thu_tu_duyet, 'TuChoi',
            COALESCE(NEW.y_kien, 'Đã từ chối')
        );

        -- Cập nhật trạng thái hồ sơ thành TuChoi
        UPDATE ho_so_di_nuoc_ngoai
        SET trang_thai = 'TuChoi'
        WHERE ma_ho_so = NEW.ma_ho_so;

        -- ENHANCED: Đánh dấu tất cả các bước duyệt còn lại là không cần thiết
        UPDATE ho_so_duyet
        SET trang_thai = 'TuChoi'
        WHERE ma_ho_so = NEW.ma_ho_so 
        AND thu_tu_duyet > NEW.thu_tu_duyet
        AND trang_thai = 'ChoDuyet';
        
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_approval_progress
AFTER UPDATE ON ho_so_duyet
FOR EACH ROW EXECUTE FUNCTION handle_approval_progress();

-- ================================================
-- TRIGGER CẬP NHẬT THỜI GIAN
-- ================================================

CREATE OR REPLACE FUNCTION cap_nhat_ngay_cap_nhat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ngay_cap_nhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cap_nhat_vien_chuc
BEFORE UPDATE ON vien_chuc
FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trigger_cap_nhat_nguoi_dung
BEFORE UPDATE ON nguoi_dung
FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

CREATE TRIGGER trigger_cap_nhat_ho_so
BEFORE UPDATE ON ho_so_di_nuoc_ngoai
FOR EACH ROW EXECUTE FUNCTION cap_nhat_ngay_cap_nhat();

-- ================================================
-- ENHANCED VIEWS FOR REPORTING
-- ================================================

-- View tổng quan hồ sơ với thông tin duyệt
CREATE OR REPLACE VIEW vw_ho_so_tong_quan AS
SELECT 
    hs.ma_ho_so,
    vc.ho_ten as ten_vien_chuc,
    vc.email,
    lcd.ten_loai as loai_chuyen_di,
    nkp.ten_nguon as nguon_kinh_phi,
    hs.trang_thai,
    hs.priority,
    hs.ngay_tao,
    hs.thoi_gian_bat_dau,
    hs.thoi_gian_ket_thuc,
    -- Thông tin duyệt
    (SELECT COUNT(*) FROM ho_so_duyet hd WHERE hd.ma_ho_so = hs.ma_ho_so) as tong_so_buoc_duyet,
    (SELECT COUNT(*) FROM ho_so_duyet hd WHERE hd.ma_ho_so = hs.ma_ho_so AND hd.trang_thai = 'Duyet') as so_buoc_da_duyet,
    (SELECT COUNT(*) FROM ho_so_duyet hd WHERE hd.ma_ho_so = hs.ma_ho_so AND hd.trang_thai = 'ChoDuyet') as so_buoc_cho_duyet
FROM ho_so_di_nuoc_ngoai hs
JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
JOIN loai_chuyen_di lcd ON hs.ma_loai = lcd.ma_loai
JOIN nguon_kinh_phi nkp ON hs.ma_kinh_phi = nkp.ma_kinh_phi;

-- View chi tiết quy trình duyệt
CREATE OR REPLACE VIEW vw_chi_tiet_duyet AS
SELECT 
    hs.ma_ho_so,
    vc.ho_ten as ten_vien_chuc,
    hs.trang_thai as trang_thai_ho_so,
    hd.thu_tu_duyet,
    hd.trang_thai as trang_thai_duyet,
    nd.ho_ten as nguoi_duyet,
    nd.vai_tro,
    hd.ngay_duyet,
    hd.y_kien
FROM ho_so_di_nuoc_ngoai hs
JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
JOIN ho_so_duyet hd ON hs.ma_ho_so = hd.ma_ho_so
JOIN nguoi_duyet nd ON hd.ma_nguoi_duyet = nd.ma_nguoi_duyet
ORDER BY hs.ma_ho_so, hd.thu_tu_duyet;

-- View thống kê hiệu suất duyệt
CREATE OR REPLACE VIEW vw_thong_ke_duyet AS
SELECT 
    nd.ho_ten as nguoi_duyet,
    nd.vai_tro,
    COUNT(*) as tong_so_duyet,
    COUNT(CASE WHEN hd.trang_thai = 'Duyet' THEN 1 END) as so_duyet,
    COUNT(CASE WHEN hd.trang_thai = 'TuChoi' THEN 1 END) as so_tu_choi,
    COUNT(CASE WHEN hd.trang_thai = 'ChoDuyet' THEN 1 END) as so_cho_duyet,
    AVG(EXTRACT(EPOCH FROM (hd.ngay_duyet - hd.ngay_tao))/86400)::numeric(10,2) as tb_so_ngay_duyet
FROM ho_so_duyet hd
JOIN nguoi_duyet nd ON hd.ma_nguoi_duyet = nd.ma_nguoi_duyet
WHERE hd.ngay_duyet IS NOT NULL
GROUP BY nd.ma_nguoi_duyet, nd.ho_ten, nd.vai_tro;

-- ================================================
-- UTILITY FUNCTIONS FOR MANAGEMENT
-- ================================================

-- Function để lấy hồ sơ theo trạng thái và ưu tiên
CREATE OR REPLACE FUNCTION get_ho_so_theo_trang_thai(
    p_trang_thai VARCHAR DEFAULT NULL,
    p_priority VARCHAR DEFAULT NULL
) RETURNS TABLE (
    ma_ho_so UUID,
    ten_vien_chuc VARCHAR,
    loai_chuyen_di VARCHAR,
    trang_thai VARCHAR,
    priority VARCHAR,
    ngay_tao TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hs.ma_ho_so,
        vc.ho_ten,
        lcd.ten_loai,
        hs.trang_thai,
        hs.priority,
        hs.ngay_tao
    FROM ho_so_di_nuoc_ngoai hs
    JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
    JOIN loai_chuyen_di lcd ON hs.ma_loai = lcd.ma_loai
    WHERE 
        (p_trang_thai IS NULL OR hs.trang_thai = p_trang_thai)
        AND (p_priority IS NULL OR hs.priority = p_priority)
    ORDER BY 
        CASE hs.priority
            WHEN 'Cao' THEN 1
            WHEN 'TrungBinh' THEN 2
            WHEN 'Thap' THEN 3
        END,
        hs.ngay_tao DESC;
END;
$$ LANGUAGE plpgsql;

-- Function để thống kê hồ sơ theo tháng
CREATE OR REPLACE FUNCTION thong_ke_ho_so_theo_thang(
    p_thang INT DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
    p_nam INT DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
) RETURNS TABLE (
    trang_thai VARCHAR,
    so_luong BIGINT,
    ty_le NUMERIC
) AS $$
DECLARE
    v_tong_so BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_tong_so
    FROM ho_so_di_nuoc_ngoai
    WHERE EXTRACT(MONTH FROM ngay_tao) = p_thang
    AND EXTRACT(YEAR FROM ngay_tao) = p_nam;

    RETURN QUERY
    SELECT 
        hs.trang_thai,
        COUNT(*) as so_luong,
        ROUND((COUNT(*) * 100.0 / NULLIF(v_tong_so, 0)), 2) as ty_le
    FROM ho_so_di_nuoc_ngoai hs
    WHERE EXTRACT(MONTH FROM hs.ngay_tao) = p_thang
    AND EXTRACT(YEAR FROM hs.ngay_tao) = p_nam
    GROUP BY hs.trang_thai
    ORDER BY so_luong DESC;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON TABLE vien_chuc IS 'Bảng thông tin viên chức trong hệ thống';
COMMENT ON TABLE nguoi_duyet IS 'Bảng người duyệt hồ sơ (Trưởng khoa, BGH)';
COMMENT ON TABLE nguoi_dung IS 'Bảng tài khoản người dùng với SSO';
COMMENT ON TABLE roles IS 'Bảng phân quyền nâng cao cho hệ thống';
COMMENT ON TABLE user_roles IS 'Bảng gán quyền cho người dùng';
COMMENT ON TABLE ho_so_di_nuoc_ngoai IS 'Bảng hồ sơ đi nước ngoài';
COMMENT ON TABLE ho_so_duyet IS 'Bảng quy trình phê duyệt hồ sơ';
COMMENT ON TABLE bao_cao_sau_chuyen_di IS 'Bảng báo cáo sau khi hoàn thành chuyến đi';
COMMENT ON TABLE nhat_ky_audit IS 'Bảng lưu log hoạt động hệ thống';
COMMENT ON TABLE lich_su_ho_so IS 'Bảng lịch sử thay đổi hồ sơ với tracking người duyệt';

COMMENT ON VIEW vw_ho_so_tong_quan IS 'View tổng quan hồ sơ với thông tin duyệt';
COMMENT ON VIEW vw_chi_tiet_duyet IS 'View chi tiết quy trình duyệt từng hồ sơ';
COMMENT ON VIEW vw_thong_ke_duyet IS 'View thống kê hiệu suất người duyệt';

COMMENT ON FUNCTION get_ho_so_theo_trang_thai IS 'Lấy danh sách hồ sơ theo trạng thái và độ ưu tiên';
COMMENT ON FUNCTION thong_ke_ho_so_theo_thang IS 'Thống kê hồ sơ theo tháng với tỷ lệ phần trăm';

-- ================================================
-- USAGE EXAMPLES (Commented)
-- ================================================

-- Xem tổng quan hồ sơ
-- SELECT * FROM vw_ho_so_tong_quan WHERE trang_thai = 'DangXuLy';

-- Xem chi tiết quy trình duyệt
-- SELECT * FROM vw_chi_tiet_duyet WHERE ma_ho_so = 'your-hoso-id';

-- Thống kê hiệu suất người duyệt
-- SELECT * FROM vw_thong_ke_duyet;

-- Lấy hồ sơ theo trạng thái
-- SELECT * FROM get_ho_so_theo_trang_thai('DangXuLy', 'Cao');

-- Thống kê theo tháng
-- SELECT * FROM thong_ke_ho_so_theo_thang(11, 2025);

-- ================================================
-- COMPLETED
-- ================================================

SELECT 'Schema version 3.1 created successfully! 
✅ Core Schema:
  - 15 tables with proper relationships and constraints
  - Roles & user_roles for advanced permission management
  - Auto-assign approver workflow (2 levels: TruongKhoa, BGH)
  - Auto-progress approval workflow with cascade rejection
  - Enhanced history tracking with approver info
  - ON DELETE SET NULL for FK relationships
  
✅ Triggers & Functions:
  - assign_nguoi_duyet_auto(): Auto-assign approvers on record creation
  - ghi_lich_su_ho_so(): Track status changes automatically
  - handle_approval_progress(): Manage approval workflow automatically
  - cap_nhat_ngay_cap_nhat(): Update timestamps automatically
  
✅ Reporting Views:
  - vw_ho_so_tong_quan: Overview with approval stats
  - vw_chi_tiet_duyet: Detailed approval process
  - vw_thong_ke_duyet: Approver performance metrics
  
✅ Utility Functions:
  - get_ho_so_theo_trang_thai(status, priority): Query records by status
  - thong_ke_ho_so_theo_thang(month, year): Monthly statistics
  
📝 Note: Run seed_data.sql to populate with sample data
' as result;
