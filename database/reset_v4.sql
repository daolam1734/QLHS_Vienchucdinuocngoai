-- ================================================
-- RESET DATA SCRIPT for QLHS v4.0
-- Keeps structure, clears and reloads sample data
-- ================================================

SET client_encoding = 'UTF8';

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Truncate all tables (in dependency order)
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE roles CASCADE;
TRUNCATE TABLE lich_su_ho_so CASCADE;
TRUNCATE TABLE nhat_ky_audit CASCADE;
TRUNCATE TABLE chu_ky_so CASCADE;
TRUNCATE TABLE bao_cao_sau_chuyen_di CASCADE;
TRUNCATE TABLE ho_so_duyet CASCADE;
TRUNCATE TABLE tai_lieu_dinh_kem CASCADE;
TRUNCATE TABLE thong_bao CASCADE;
TRUNCATE TABLE quyet_dinh CASCADE;
TRUNCATE TABLE ho_so_di_nuoc_ngoai CASCADE;
TRUNCATE TABLE nguoi_dung CASCADE;
TRUNCATE TABLE nguon_kinh_phi CASCADE;
TRUNCATE TABLE loai_chuyen_di CASCADE;
TRUNCATE TABLE vien_chuc CASCADE;
TRUNCATE TABLE chi_bo CASCADE;
TRUNCATE TABLE dang_uy CASCADE;
TRUNCATE TABLE don_vi_quan_ly CASCADE;
TRUNCATE TABLE nguoi_duyet CASCADE;
TRUNCATE TABLE dieu_kien_tu_dong CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Reload seed data
\i 'D:/DoanChuyenNganh/QLHS-DiNuocNgoai/database/seed_data_v4.sql'

-- Verification
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'RESET COMPLETED - Fresh Data Loaded!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Current data:';
    RAISE NOTICE '  Users: % rows', (SELECT COUNT(*) FROM nguoi_dung);
    RAISE NOTICE '  Staff: % rows', (SELECT COUNT(*) FROM vien_chuc);
    RAISE NOTICE '  Approvers: % rows', (SELECT COUNT(*) FROM nguoi_duyet);
    RAISE NOTICE '  Records: % rows', (SELECT COUNT(*) FROM ho_so_di_nuoc_ngoai);
    RAISE NOTICE '  Workflows: % rows', (SELECT COUNT(*) FROM ho_so_duyet);
    RAISE NOTICE '==================================================';
END $$;
