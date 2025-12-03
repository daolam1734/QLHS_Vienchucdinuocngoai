-- ================================================
-- MIGRATION: Production Schema → Schema v4
-- Date: 2024-11-30
-- Purpose: Upgrade database to support 7-level workflow
-- WARNING: This is a BREAKING CHANGE
-- ================================================

-- BACKUP FIRST!
-- pg_dump -U postgres -d qlhs_db > backup_before_v4_migration.sql

BEGIN;

-- ================================================
-- STEP 1: CREATE MISSING TABLES
-- ================================================

-- 1.1 Table: don_vi_quan_ly
CREATE TABLE IF NOT EXISTS don_vi_quan_ly (
    ma_don_vi UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_don_vi VARCHAR(255) NOT NULL,
    loai_don_vi VARCHAR(50) NOT NULL,
    truong_don_vi_id UUID,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 Table: chi_bo
CREATE TABLE IF NOT EXISTS chi_bo (
    ma_chi_bo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_chi_bo VARCHAR(255) NOT NULL,
    bi_thu_id UUID,
    thuoc_don_vi UUID,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.3 Table: dang_uy
CREATE TABLE IF NOT EXISTS dang_uy (
    ma_dang_uy UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_dang_uy VARCHAR(255) NOT NULL DEFAULT 'Đảng ủy Trường ĐH Trà Vinh',
    bi_thu_id UUID,
    pho_bi_thu_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.4 Table: roles
CREATE TABLE IF NOT EXISTS roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    ngay_gan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_role UNIQUE(user_id, role_id)
);

-- 1.6 Table: quyet_dinh
CREATE TABLE IF NOT EXISTS quyet_dinh (
    ma_quyet_dinh UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL UNIQUE,
    so_quyet_dinh VARCHAR(50) NOT NULL UNIQUE,
    ngay_ban_hanh DATE NOT NULL DEFAULT CURRENT_DATE,
    nguoi_ky_id UUID,
    file_pdf_path TEXT,
    noi_dung_quyet_dinh TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1.7 Table: thong_bao
CREATE TABLE IF NOT EXISTS thong_bao (
    ma_thong_bao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so UUID NOT NULL,
    loai_thong_bao VARCHAR(50) NOT NULL,
    nguoi_nhan UUID NOT NULL,
    tieu_de VARCHAR(500) NOT NULL,
    noi_dung TEXT NOT NULL,
    da_doc BOOLEAN DEFAULT FALSE,
    da_gui_email BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_doc TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_thongbao_nguoinhan ON thong_bao(nguoi_nhan);
CREATE INDEX IF NOT EXISTS idx_thongbao_dadoc ON thong_bao(da_doc);

-- 1.8 Table: dieu_kien_tu_dong
CREATE TABLE IF NOT EXISTS dieu_kien_tu_dong (
    ma_dieu_kien UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_dieu_kien VARCHAR(255) NOT NULL,
    loai_kiem_tra VARCHAR(50) NOT NULL,
    tham_so JSONB,
    thong_bao_loi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    thu_tu_kiem_tra INT DEFAULT 0,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- STEP 2: ALTER EXISTING TABLES - ADD MISSING COLUMNS
-- ================================================

-- 2.1 vien_chuc: Add ma_chi_bo, ma_don_vi
ALTER TABLE vien_chuc 
    ADD COLUMN IF NOT EXISTS ma_chi_bo UUID,
    ADD COLUMN IF NOT EXISTS ma_don_vi UUID;

-- 2.2 nguoi_duyet: Add email, cap_duyet, is_active
ALTER TABLE nguoi_duyet 
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS cap_duyet INT,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add unique constraint on email
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'nguoi_duyet_email_key') THEN
        ALTER TABLE nguoi_duyet ADD CONSTRAINT nguoi_duyet_email_key UNIQUE (email);
    END IF;
END $$;

-- 2.3 ho_so_di_nuoc_ngoai: Add missing columns
ALTER TABLE ho_so_di_nuoc_ngoai
    ADD COLUMN IF NOT EXISTS quoc_gia_den VARCHAR(255),
    ADD COLUMN IF NOT EXISTS to_chuc_moi VARCHAR(500),
    ADD COLUMN IF NOT EXISTS kinh_phi_du_kien DECIMAL(15,2),
    ADD COLUMN IF NOT EXISTS ghi_chu TEXT,
    ADD COLUMN IF NOT EXISTS nguoi_tao UUID;

-- Rename columns to match v4
DO $$
BEGIN
    -- Rename ma_loai to loai_chuyen_di (if not already renamed)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_di_nuoc_ngoai' AND column_name = 'ma_loai') THEN
        ALTER TABLE ho_so_di_nuoc_ngoai RENAME COLUMN ma_loai TO loai_chuyen_di;
    END IF;
    
    -- Rename ma_kinh_phi to nguon_kinh_phi
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_di_nuoc_ngoai' AND column_name = 'ma_kinh_phi') THEN
        ALTER TABLE ho_so_di_nuoc_ngoai RENAME COLUMN ma_kinh_phi TO nguon_kinh_phi;
    END IF;
    
    -- Rename ly_do_chuyen_di to muc_dich
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_di_nuoc_ngoai' AND column_name = 'ly_do_chuyen_di') THEN
        ALTER TABLE ho_so_di_nuoc_ngoai RENAME COLUMN ly_do_chuyen_di TO muc_dich;
    END IF;
    
    -- Rename priority to muc_do_uu_tien
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_di_nuoc_ngoai' AND column_name = 'priority') THEN
        ALTER TABLE ho_so_di_nuoc_ngoai RENAME COLUMN priority TO muc_do_uu_tien;
    END IF;
END $$;

-- Update trang_thai values and CHECK constraint
ALTER TABLE ho_so_di_nuoc_ngoai DROP CONSTRAINT IF EXISTS ho_so_di_nuoc_ngoai_trang_thai_check;
ALTER TABLE ho_so_di_nuoc_ngoai ADD CONSTRAINT ho_so_di_nuoc_ngoai_trang_thai_check 
    CHECK (trang_thai IN ('MoiTao', 'DangKiemTraTuDong', 'ChoChiBoDuyet', 'ChoDangUyDuyet', 
                          'ChoDonViDuyet', 'ChoTCHCDuyet', 'ChoBGHDuyet', 'DaDuyet', 
                          'DangThucHien', 'ChoBaoCao', 'HoanTat', 'TuChoi', 'BoSung'));

-- 2.4 ho_so_duyet: Add cap_duyet, vai_tro_duyet
ALTER TABLE ho_so_duyet
    ADD COLUMN IF NOT EXISTS cap_duyet INT,
    ADD COLUMN IF NOT EXISTS vai_tro_duyet VARCHAR(100);

-- Rename columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_duyet' AND column_name = 'ma_ho_so_duyet') THEN
        ALTER TABLE ho_so_duyet RENAME COLUMN ma_ho_so_duyet TO ma_duyet;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ho_so_duyet' AND column_name = 'ma_nguoi_duyet') THEN
        ALTER TABLE ho_so_duyet RENAME COLUMN ma_nguoi_duyet TO nguoi_duyet_id;
    END IF;
END $$;

-- Migrate thu_tu_duyet to cap_duyet (if data exists)
UPDATE ho_so_duyet SET cap_duyet = thu_tu_duyet WHERE cap_duyet IS NULL;

-- 2.5 lich_su_ho_so: Add hanh_dong column
ALTER TABLE lich_su_ho_so
    ADD COLUMN IF NOT EXISTS hanh_dong VARCHAR(100);

-- Rename columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lich_su_ho_so' AND column_name = 'ma_history') THEN
        ALTER TABLE lich_su_ho_so RENAME COLUMN ma_history TO ma_lich_su;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lich_su_ho_so' AND column_name = 'nguoi_cap_nhat') THEN
        ALTER TABLE lich_su_ho_so RENAME COLUMN nguoi_cap_nhat TO nguoi_thao_tac;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lich_su_ho_so' AND column_name = 'ngay_cap_nhat') THEN
        ALTER TABLE lich_su_ho_so RENAME COLUMN ngay_cap_nhat TO thoi_gian;
    END IF;
END $$;

-- Populate hanh_dong from trang_thai_moi (for existing records)
UPDATE lich_su_ho_so 
SET hanh_dong = CASE 
    WHEN trang_thai_moi = 'ChoDuyet' THEN 'GuiDuyet'
    WHEN trang_thai_moi = 'DaDuyet' THEN 'PheDuyet'
    WHEN trang_thai_moi = 'TuChoi' THEN 'TuChoi'
    ELSE 'CapNhat'
END
WHERE hanh_dong IS NULL;

-- 2.6 bao_cao_sau_chuyen_di: Add extended fields
ALTER TABLE bao_cao_sau_chuyen_di
    ADD COLUMN IF NOT EXISTS ket_qua_dat_duoc TEXT,
    ADD COLUMN IF NOT EXISTS kien_nghi TEXT,
    ADD COLUMN IF NOT EXISTS tai_lieu_kem TEXT,
    ADD COLUMN IF NOT EXISTS chi_bo_danh_gia TEXT,
    ADD COLUMN IF NOT EXISTS chi_bo_nguoi_danh_gia UUID,
    ADD COLUMN IF NOT EXISTS chi_bo_ngay_danh_gia TIMESTAMP,
    ADD COLUMN IF NOT EXISTS tchc_nguoi_ky UUID,
    ADD COLUMN IF NOT EXISTS tchc_ngay_ky TIMESTAMP,
    ADD COLUMN IF NOT EXISTS tchc_y_kien TEXT,
    ADD COLUMN IF NOT EXISTS ngay_hoan_tat TIMESTAMP;

-- Rename noi_dung to noi_dung_bao_cao
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bao_cao_sau_chuyen_di' AND column_name = 'noi_dung') THEN
        ALTER TABLE bao_cao_sau_chuyen_di RENAME COLUMN noi_dung TO noi_dung_bao_cao;
    END IF;
END $$;

-- Update trang_thai constraint
ALTER TABLE bao_cao_sau_chuyen_di DROP CONSTRAINT IF EXISTS bao_cao_sau_chuyen_di_trang_thai_check;
ALTER TABLE bao_cao_sau_chuyen_di ADD CONSTRAINT bao_cao_sau_chuyen_di_trang_thai_check 
    CHECK (trang_thai IN ('MoiTao', 'ChoChiBoDanhGia', 'ChoTCHCKy', 'HoanTat', 'ChuaNop', 'DaNop', 'DaDuyet', 'TuChoi'));

-- 2.7 chu_ky_so: Restructure for v4
ALTER TABLE chu_ky_so
    ADD COLUMN IF NOT EXISTS ma_ho_so UUID,
    ADD COLUMN IF NOT EXISTS loai_van_ban VARCHAR(50),
    ADD COLUMN IF NOT EXISTS nguoi_ky_id UUID,
    ADD COLUMN IF NOT EXISTS cap_duyet INT,
    ADD COLUMN IF NOT EXISTS chu_ky_data TEXT,
    ADD COLUMN IF NOT EXISTS thoi_gian_ky TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);

-- Rename if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chu_ky_so' AND column_name = 'doi_tuong_id') THEN
        -- Migrate doi_tuong_id to ma_ho_so (if it's related to ho_so)
        UPDATE chu_ky_so SET ma_ho_so = doi_tuong_id WHERE ma_ho_so IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chu_ky_so' AND column_name = 'loai_doi_tuong') THEN
        UPDATE chu_ky_so SET loai_van_ban = loai_doi_tuong WHERE loai_van_ban IS NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chu_ky_so' AND column_name = 'ngay_ky') THEN
        UPDATE chu_ky_so SET thoi_gian_ky = ngay_ky WHERE thoi_gian_ky IS NULL;
    END IF;
END $$;

-- ================================================
-- STEP 3: RECREATE nhat_ky_audit (structure is too different)
-- ================================================

-- Drop and recreate
DROP TABLE IF EXISTS nhat_ky_audit CASCADE;

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
-- STEP 4: ADD FOREIGN KEYS
-- ================================================

-- 4.1 vien_chuc foreign keys
ALTER TABLE vien_chuc 
    DROP CONSTRAINT IF EXISTS fk_vienchuc_chibo,
    ADD CONSTRAINT fk_vienchuc_chibo FOREIGN KEY (ma_chi_bo) REFERENCES chi_bo(ma_chi_bo) ON DELETE SET NULL;

ALTER TABLE vien_chuc 
    DROP CONSTRAINT IF EXISTS fk_vienchuc_donvi,
    ADD CONSTRAINT fk_vienchuc_donvi FOREIGN KEY (ma_don_vi) REFERENCES don_vi_quan_ly(ma_don_vi) ON DELETE RESTRICT;

-- 4.2 don_vi_quan_ly foreign keys
ALTER TABLE don_vi_quan_ly
    DROP CONSTRAINT IF EXISTS fk_donvi_truong,
    ADD CONSTRAINT fk_donvi_truong FOREIGN KEY (truong_don_vi_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.3 chi_bo foreign keys
ALTER TABLE chi_bo
    DROP CONSTRAINT IF EXISTS fk_chibo_bithu,
    ADD CONSTRAINT fk_chibo_bithu FOREIGN KEY (bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

ALTER TABLE chi_bo
    DROP CONSTRAINT IF EXISTS fk_chibo_donvi,
    ADD CONSTRAINT fk_chibo_donvi FOREIGN KEY (thuoc_don_vi) REFERENCES don_vi_quan_ly(ma_don_vi) ON DELETE SET NULL;

-- 4.4 dang_uy foreign keys
ALTER TABLE dang_uy
    DROP CONSTRAINT IF EXISTS fk_danguy_bithu,
    ADD CONSTRAINT fk_danguy_bithu FOREIGN KEY (bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

ALTER TABLE dang_uy
    DROP CONSTRAINT IF EXISTS fk_danguy_phobithu,
    ADD CONSTRAINT fk_danguy_phobithu FOREIGN KEY (pho_bi_thu_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.5 user_roles foreign keys
ALTER TABLE user_roles
    DROP CONSTRAINT IF EXISTS fk_userrole_user,
    ADD CONSTRAINT fk_userrole_user FOREIGN KEY (user_id) REFERENCES nguoi_dung(user_id) ON DELETE CASCADE;

ALTER TABLE user_roles
    DROP CONSTRAINT IF EXISTS fk_userrole_role,
    ADD CONSTRAINT fk_userrole_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE;

-- 4.6 quyet_dinh foreign keys
ALTER TABLE quyet_dinh
    DROP CONSTRAINT IF EXISTS fk_quyetdinh_hoso,
    ADD CONSTRAINT fk_quyetdinh_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE;

ALTER TABLE quyet_dinh
    DROP CONSTRAINT IF EXISTS fk_quyetdinh_nguoiky,
    ADD CONSTRAINT fk_quyetdinh_nguoiky FOREIGN KEY (nguoi_ky_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.7 thong_bao foreign keys
ALTER TABLE thong_bao
    DROP CONSTRAINT IF EXISTS fk_thongbao_hoso,
    ADD CONSTRAINT fk_thongbao_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE;

ALTER TABLE thong_bao
    DROP CONSTRAINT IF EXISTS fk_thongbao_nguoi,
    ADD CONSTRAINT fk_thongbao_nguoi FOREIGN KEY (nguoi_nhan) REFERENCES nguoi_dung(user_id) ON DELETE CASCADE;

-- 4.8 bao_cao_sau_chuyen_di foreign keys
ALTER TABLE bao_cao_sau_chuyen_di
    DROP CONSTRAINT IF EXISTS fk_baocao_chibo,
    ADD CONSTRAINT fk_baocao_chibo FOREIGN KEY (chi_bo_nguoi_danh_gia) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

ALTER TABLE bao_cao_sau_chuyen_di
    DROP CONSTRAINT IF EXISTS fk_baocao_tchc,
    ADD CONSTRAINT fk_baocao_tchc FOREIGN KEY (tchc_nguoi_ky) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.9 chu_ky_so foreign keys (update)
ALTER TABLE chu_ky_so
    DROP CONSTRAINT IF EXISTS fk_chuky_hoso,
    ADD CONSTRAINT fk_chuky_hoso FOREIGN KEY (ma_ho_so) REFERENCES ho_so_di_nuoc_ngoai(ma_ho_so) ON DELETE CASCADE;

ALTER TABLE chu_ky_so
    DROP CONSTRAINT IF EXISTS fk_chuky_nguoi,
    ADD CONSTRAINT fk_chuky_nguoi FOREIGN KEY (nguoi_ky_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.10 ho_so_duyet foreign key update
ALTER TABLE ho_so_duyet DROP CONSTRAINT IF EXISTS fk_hosoduyet_nguoiduyet;
ALTER TABLE ho_so_duyet 
    ADD CONSTRAINT fk_duyet_nguoi FOREIGN KEY (nguoi_duyet_id) REFERENCES nguoi_duyet(ma_nguoi_duyet) ON DELETE SET NULL;

-- 4.11 lich_su_ho_so foreign key update
ALTER TABLE lich_su_ho_so DROP CONSTRAINT IF EXISTS fk_history_user;
ALTER TABLE lich_su_ho_so 
    ADD CONSTRAINT fk_lichsu_nguoi FOREIGN KEY (nguoi_thao_tac) REFERENCES nguoi_dung(user_id) ON DELETE SET NULL;

-- ================================================
-- STEP 5: CREATE INDEXES
-- ================================================

CREATE INDEX IF NOT EXISTS idx_hosoduyet_capduyet ON ho_so_duyet(cap_duyet);
CREATE INDEX IF NOT EXISTS idx_hosoduyet_trangthai ON ho_so_duyet(trang_thai);
CREATE INDEX IF NOT EXISTS idx_lichsu_mahoso ON lich_su_ho_so(ma_ho_so);
CREATE INDEX IF NOT EXISTS idx_lichsu_thoigian ON lich_su_ho_so(thoi_gian DESC);
CREATE INDEX IF NOT EXISTS idx_chuky_mahoso ON chu_ky_so(ma_ho_so);

-- ================================================
-- STEP 6: INSERT DEFAULT DATA
-- ================================================

-- Insert default roles
INSERT INTO roles (role_name, description, permissions) VALUES
('ADMIN', 'Administrator - Full access', '{"all": true}'::jsonb),
('VIEN_CHUC', 'Viên chức - Submit applications', '{"submit_application": true, "view_own": true}'::jsonb),
('NGUOI_DUYET', 'Người duyệt - Approve applications', '{"approve": true, "view_all": true}'::jsonb),
('CHI_BO', 'Bí thư Chi bộ', '{"approve_chi_bo": true}'::jsonb),
('DANG_UY', 'Đảng ủy', '{"approve_dang_uy": true}'::jsonb)
ON CONFLICT (role_name) DO NOTHING;

-- Insert default Đảng ủy
INSERT INTO dang_uy (ma_dang_uy, ten_dang_uy, is_active) VALUES
(gen_random_uuid(), 'Đảng ủy Trường Đại học Trà Vinh', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample validation rule
INSERT INTO dieu_kien_tu_dong (ten_dieu_kien, loai_kiem_tra, tham_so, thong_bao_loi, is_active, thu_tu_kiem_tra) VALUES
('Kiểm tra thời gian tối thiểu', 'ThoiGian', '{"min_days_before": 30}'::jsonb, 
 'Phải đăng ký trước ít nhất 30 ngày trước ngày đi', TRUE, 1)
ON CONFLICT DO NOTHING;

COMMIT;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Count tables (should be 18)
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';

-- Check new tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('don_vi_quan_ly', 'chi_bo', 'dang_uy', 'roles', 'user_roles', 'quyet_dinh', 'thong_bao', 'dieu_kien_tu_dong')
ORDER BY table_name;

-- Verify column changes
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'ho_so_duyet'
AND column_name IN ('cap_duyet', 'vai_tro_duyet', 'nguoi_duyet_id');

-- ================================================
-- ROLLBACK INSTRUCTIONS
-- ================================================
-- If migration fails, restore from backup:
-- psql -U postgres -d qlhs_db < backup_before_v4_migration.sql
