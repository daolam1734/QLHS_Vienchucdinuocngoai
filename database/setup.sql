-- ================================================
-- DATABASE SETUP SCRIPT: QLHS Đi Nước Ngoài
-- Trường Đại học Trà Vinh
-- Encoding: UTF-8
-- Version: 1.0 - November 30, 2025
-- Description: Complete database setup (drop, create, schema, seed)
-- ================================================

-- Disconnect all active connections (PostgreSQL 13+)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'qlhs_dinuocngoai'
  AND pid <> pg_backend_pid();

-- Drop and recreate database
DROP DATABASE IF EXISTS qlhs_dinuocngoai;
CREATE DATABASE qlhs_dinuocngoai
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Vietnamese_Vietnam.1258'
    LC_CTYPE = 'Vietnamese_Vietnam.1258'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE qlhs_dinuocngoai IS 'Hệ thống Quản lý Hồ sơ Viên chức Đi Nước Ngoài - Trường ĐH Trà Vinh';

-- Connect to the new database
\c qlhs_dinuocngoai

-- Run schema
\echo 'Creating schema...'
\i schema.sql

-- Run seed data
\echo 'Inserting seed data...'
\i seed_data.sql

-- Verify installation
\echo ''
\echo '============================================'
\echo 'DATABASE SETUP COMPLETED!'
\echo '============================================'
\echo ''

-- Show summary
SELECT 
    'Database' as type, 
    'qlhs_dinuocngoai' as name,
    pg_size_pretty(pg_database_size('qlhs_dinuocngoai')) as size
UNION ALL
SELECT 
    'Tables' as type,
    COUNT(*)::text as name,
    pg_size_pretty(SUM(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint) as size
FROM pg_tables
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Views' as type,
    COUNT(*)::text as name,
    '-' as size
FROM pg_views
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Functions' as type,
    COUNT(*)::text as name,
    '-' as size
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';

\echo ''
\echo 'Run "\dt" to list all tables'
\echo 'Run "\dv" to list all views'
\echo 'Run "\df" to list all functions'
\echo ''
