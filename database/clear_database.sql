-- Script xóa sạch tất cả dữ liệu trong database
-- Chạy script này để reset database về trạng thái rỗng

-- Xóa các bảng cũ (từ schema cũ nếu có)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS reset_tokens CASCADE;

-- Xóa các bảng chính (nếu có)
DROP TABLE IF EXISTS lich_su_phe_duyet CASCADE;
DROP TABLE IF EXISTS file_dinh_kem CASCADE;
DROP TABLE IF EXISTS cong_viec CASCADE;
DROP TABLE IF EXISTS ho_so CASCADE;
DROP TABLE IF EXISTS nguoi_dung CASCADE;
DROP TABLE IF EXISTS don_vi CASCADE;
DROP TABLE IF EXISTS quoc_gia CASCADE;
DROP TABLE IF EXISTS trang_thai CASCADE;
DROP TABLE IF EXISTS loai_file CASCADE;
DROP TABLE IF EXISTS loai_cong_viec CASCADE;
DROP TABLE IF EXISTS vai_tro CASCADE;

-- Xóa sequences (nếu có)
DROP SEQUENCE IF EXISTS ho_so_ma_ho_so_seq CASCADE;
DROP SEQUENCE IF EXISTS nguoi_dung_ma_nguoi_dung_seq CASCADE;
DROP SEQUENCE IF EXISTS don_vi_ma_don_vi_seq CASCADE;
DROP SEQUENCE IF EXISTS quoc_gia_ma_quoc_gia_seq CASCADE;
DROP SEQUENCE IF EXISTS file_dinh_kem_ma_file_seq CASCADE;
DROP SEQUENCE IF EXISTS lich_su_phe_duyet_ma_lich_su_seq CASCADE;
DROP SEQUENCE IF EXISTS cong_viec_ma_cong_viec_seq CASCADE;

SELECT 'Database cleared successfully! All tables and sequences dropped.' as status;
