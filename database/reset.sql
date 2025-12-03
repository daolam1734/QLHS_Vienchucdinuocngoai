-- ================================================
-- DATABASE RESET SCRIPT: QLHS Đi Nước Ngoài
-- Trường Đại học Trà Vinh
-- Version: 1.0 - November 30, 2025
-- Description: Reset database to clean state (keep structure, clear data)
-- ================================================

SET client_encoding = 'UTF8';

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Clear all data (in reverse order of dependencies)
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE lich_su_ho_so CASCADE;
TRUNCATE TABLE nhat_ky_audit CASCADE;
TRUNCATE TABLE chu_ky_so CASCADE;
TRUNCATE TABLE bao_cao_sau_chuyen_di CASCADE;
TRUNCATE TABLE tai_lieu_dinh_kem CASCADE;
TRUNCATE TABLE ho_so_duyet CASCADE;
TRUNCATE TABLE ho_so_di_nuoc_ngoai CASCADE;
TRUNCATE TABLE nguoi_dung CASCADE;
TRUNCATE TABLE roles CASCADE;
TRUNCATE TABLE nguon_kinh_phi CASCADE;
TRUNCATE TABLE loai_chuyen_di CASCADE;
TRUNCATE TABLE nguoi_duyet CASCADE;
TRUNCATE TABLE vien_chuc CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Re-insert seed data
\i seed_data.sql

SELECT 'Database reset completed! All tables cleared and seed data reloaded.' as result;
