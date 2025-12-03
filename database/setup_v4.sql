-- ================================================
-- COMPLETE SETUP SCRIPT for QLHS v4.0
-- Drops existing database and creates fresh setup
-- ================================================

-- Terminate existing connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'qlhs_dinuocngoai' AND pid <> pg_backend_pid();

-- Drop and recreate database
DROP DATABASE IF EXISTS qlhs_dinuocngoai;
CREATE DATABASE qlhs_dinuocngoai
    WITH ENCODING 'UTF8'
    LC_COLLATE = 'Vietnamese_Vietnam.1258'
    LC_CTYPE = 'Vietnamese_Vietnam.1258'
    TEMPLATE template0;

\c qlhs_dinuocngoai

-- Run schema v4.0
\i 'D:/DoanChuyenNganh/QLHS-DiNuocNgoai/database/schema_v4.sql'

-- Run seed data v4.0
\i 'D:/DoanChuyenNganh/QLHS-DiNuocNgoai/database/seed_data_v4.sql'

-- Verification
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'SETUP COMPLETED - Database v4.0 Ready!';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Verification:';
    RAISE NOTICE '  Tables: % rows', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '  Views: % rows', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public');
    RAISE NOTICE '  Triggers: % rows', (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public');
    RAISE NOTICE '  Users: % rows', (SELECT COUNT(*) FROM nguoi_dung);
    RAISE NOTICE '  Records: % rows', (SELECT COUNT(*) FROM ho_so_di_nuoc_ngoai);
    RAISE NOTICE '==================================================';
END $$;
