-- =====================================================
-- Database: qlhs_dinuocngoai
-- Description: Hệ thống quản lý hồ sơ đi nước ngoài 
--              Trường Đại học Trà Vinh
-- Version: 3.0 - Updated với quy trình thực tế
-- Date: 2025-11-26
-- =====================================================

-- Create database (run this separately in psql)
-- CREATE DATABASE qlhs_dinuocngoai
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'en_US.UTF-8'
--     LC_CTYPE = 'en_US.UTF-8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Connect to database
-- \c qlhs_dinuocngoai

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP TABLES (for clean reinstall)
-- =====================================================
DROP TABLE IF EXISTS lich_su_he_thong CASCADE;
DROP TABLE IF EXISTS cau_hinh_he_thong CASCADE;
DROP TABLE IF EXISTS bao_cao_ket_qua CASCADE;
DROP TABLE IF EXISTS ho_so_dang CASCADE;
DROP TABLE IF EXISTS lich_su_phe_duyet CASCADE;
DROP TABLE IF EXISTS quy_trinh_phe_duyet CASCADE;
DROP TABLE IF EXISTS quyet_dinh_bgh CASCADE;
DROP TABLE IF EXISTS file_dinh_kem CASCADE;
DROP TABLE IF EXISTS ho_so_di_nuoc_ngoai CASCADE;
DROP TABLE IF EXISTS phan_quyen CASCADE;
DROP TABLE IF EXISTS nguoi_dung CASCADE;
DROP TABLE IF EXISTS dm_quoc_gia CASCADE;
DROP TABLE IF EXISTS dm_loai_ho_so CASCADE;
DROP TABLE IF EXISTS dm_vai_tro CASCADE;
DROP TABLE IF EXISTS dm_chi_bo CASCADE;
DROP TABLE IF EXISTS dm_don_vi CASCADE;
DROP TABLE IF EXISTS dm_trang_thai CASCADE;

-- =====================================================
-- BẢNG DANH MỤC CHUNG
-- =====================================================
CREATE TABLE dm_trang_thai (
    id SERIAL PRIMARY KEY,
    ma_trang_thai VARCHAR(50) UNIQUE NOT NULL,
    ten_trang_thai VARCHAR(100) NOT NULL,
    loai_trang_thai VARCHAR(20) NOT NULL CHECK (loai_trang_thai IN ('HANH_CHINH','DANG','HE_THONG')),
    mo_ta TEXT,
    thu_tu_hien_thi INT DEFAULT 0,
    mau_sac VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_trang_thai_loai ON dm_trang_thai(loai_trang_thai);
CREATE INDEX idx_dm_trang_thai_thu_tu ON dm_trang_thai(thu_tu_hien_thi);

COMMENT ON TABLE dm_trang_thai IS 'Danh mục trạng thái của hồ sơ (hành chính, đảng, hệ thống)';

-- =====================================================
CREATE TABLE dm_don_vi (
    id SERIAL PRIMARY KEY,
    ma_don_vi VARCHAR(20) UNIQUE NOT NULL,
    ten_don_vi VARCHAR(200) NOT NULL,
    loai_don_vi VARCHAR(50),
    email VARCHAR(100),
    so_dien_thoai VARCHAR(20),
    truong_don_vi_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_don_vi_ma ON dm_don_vi(ma_don_vi);

COMMENT ON TABLE dm_don_vi IS 'Danh sách các đơn vị/phòng ban trong trường';
COMMENT ON COLUMN dm_don_vi.truong_don_vi_id IS 'ID người dùng là trưởng đơn vị';

-- =====================================================
CREATE TABLE dm_chi_bo (
    id SERIAL PRIMARY KEY,
    ma_chi_bo VARCHAR(20) UNIQUE NOT NULL,
    ten_chi_bo VARCHAR(200) NOT NULL,
    bi_thu_chi_bo_id INT,
    pho_bi_thu_id INT,
    don_vi_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_chi_bo_ma ON dm_chi_bo(ma_chi_bo);

COMMENT ON TABLE dm_chi_bo IS 'Danh sách các chi bộ Đảng';

-- =====================================================
CREATE TABLE dm_vai_tro (
    id SERIAL PRIMARY KEY,
    ma_vai_tro VARCHAR(50) UNIQUE NOT NULL,
    ten_vai_tro VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    cap_duyet INT,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dm_vai_tro_ma ON dm_vai_tro(ma_vai_tro);

COMMENT ON TABLE dm_vai_tro IS 'Danh mục vai trò người dùng';
COMMENT ON COLUMN dm_vai_tro.cap_duyet IS 'Cấp độ phê duyệt (1=Đơn vị, 2=TCNS, 3=BGH)';

-- =====================================================
CREATE TABLE dm_loai_ho_so (
    id SERIAL PRIMARY KEY,
    ma_loai_ho_so VARCHAR(20) UNIQUE NOT NULL,
    ten_loai_ho_so VARCHAR(100) NOT NULL,
    yeu_cau_dang_vien BOOLEAN DEFAULT FALSE,
    yeu_cau_ho_so_dang BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_dm_loai_ho_so_ma ON dm_loai_ho_so(ma_loai_ho_so);

COMMENT ON TABLE dm_loai_ho_so IS 'Loại hồ sơ: Công tác, Việc riêng';
COMMENT ON COLUMN dm_loai_ho_so.yeu_cau_ho_so_dang IS 'TRUE nếu cần làm thủ tục Đảng';

-- =====================================================
CREATE TABLE dm_quoc_gia (
    id SERIAL PRIMARY KEY,
    ma_quoc_gia VARCHAR(10) UNIQUE NOT NULL,
    ten_quoc_gia VARCHAR(100) NOT NULL,
    ten_tieng_anh VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_dm_quoc_gia_ma ON dm_quoc_gia(ma_quoc_gia);

COMMENT ON TABLE dm_quoc_gia IS 'Danh sách các quốc gia';

-- =====================================================
-- BẢNG NGƯỜI DÙNG VÀ PHÂN QUYỀN
-- =====================================================
CREATE TABLE nguoi_dung (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    so_dien_thoai VARCHAR(15),
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('NAM','NU','KHAC')),
    ngay_sinh DATE,
    don_vi_id INT NOT NULL,
    chi_bo_id INT,
    la_dang_vien BOOLEAN DEFAULT FALSE,
    ma_dang_vien VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_locked BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (don_vi_id) REFERENCES dm_don_vi(id) ON DELETE RESTRICT,
    FOREIGN KEY (chi_bo_id) REFERENCES dm_chi_bo(id) ON DELETE SET NULL
);

CREATE INDEX idx_nguoi_dung_username ON nguoi_dung(username);
CREATE INDEX idx_nguoi_dung_email ON nguoi_dung(email);
CREATE INDEX idx_nguoi_dung_don_vi ON nguoi_dung(don_vi_id);
CREATE INDEX idx_nguoi_dung_chi_bo ON nguoi_dung(chi_bo_id);
CREATE INDEX idx_nguoi_dung_la_dang_vien ON nguoi_dung(la_dang_vien);

COMMENT ON TABLE nguoi_dung IS 'Thông tin người dùng hệ thống';
COMMENT ON COLUMN nguoi_dung.la_dang_vien IS 'TRUE nếu là đảng viên';

-- =====================================================
CREATE TABLE phan_quyen (
    id SERIAL PRIMARY KEY,
    nguoi_dung_id INT NOT NULL,
    vai_tro_id INT NOT NULL,
    don_vi_id INT,
    ngay_bat_dau TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_ket_thuc TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    FOREIGN KEY (vai_tro_id) REFERENCES dm_vai_tro(id) ON DELETE CASCADE,
    FOREIGN KEY (don_vi_id) REFERENCES dm_don_vi(id) ON DELETE CASCADE,
    UNIQUE (nguoi_dung_id, vai_tro_id, don_vi_id)
);

CREATE INDEX idx_phan_quyen_nguoi_dung ON phan_quyen(nguoi_dung_id);
CREATE INDEX idx_phan_quyen_vai_tro ON phan_quyen(vai_tro_id);

COMMENT ON TABLE phan_quyen IS 'Phân quyền vai trò cho người dùng';

-- =====================================================
-- BẢNG HỒ SƠ ĐI NƯỚC NGOÀI
-- =====================================================
CREATE TABLE ho_so_di_nuoc_ngoai (
    id SERIAL PRIMARY KEY,
    ma_ho_so VARCHAR(50) UNIQUE NOT NULL,
    nguoi_dung_id INT NOT NULL,
    loai_ho_so_id INT NOT NULL,
    ten_chuyen_di VARCHAR(500) NOT NULL,
    muc_dich_chuyen_di TEXT NOT NULL,
    quoc_gia_den_id INT NOT NULL,
    thanh_pho_den VARCHAR(200),
    co_quan_tiep_nhan VARCHAR(500),
    thoi_gian_du_kien_di TIMESTAMP NOT NULL,
    thoi_gian_du_kien_ve TIMESTAMP NOT NULL,
    thoi_gian_thuc_te_di TIMESTAMP,
    thoi_gian_thuc_te_ve TIMESTAMP,
    so_ngay_du_kien INT GENERATED ALWAYS AS (
        EXTRACT(DAY FROM (thoi_gian_du_kien_ve - thoi_gian_du_kien_di)) + 1
    ) STORED,
    trang_thai_hien_tai_id INT NOT NULL,
    trang_thai_dang_id INT,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_dang_vien BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    FOREIGN KEY (loai_ho_so_id) REFERENCES dm_loai_ho_so(id) ON DELETE RESTRICT,
    FOREIGN KEY (quoc_gia_den_id) REFERENCES dm_quoc_gia(id) ON DELETE RESTRICT,
    FOREIGN KEY (trang_thai_hien_tai_id) REFERENCES dm_trang_thai(id) ON DELETE RESTRICT,
    FOREIGN KEY (trang_thai_dang_id) REFERENCES dm_trang_thai(id) ON DELETE RESTRICT
);

CREATE INDEX idx_ho_so_nguoi_dung ON ho_so_di_nuoc_ngoai(nguoi_dung_id);
CREATE INDEX idx_ho_so_trang_thai ON ho_so_di_nuoc_ngoai(trang_thai_hien_tai_id);
CREATE INDEX idx_ho_so_loai ON ho_so_di_nuoc_ngoai(loai_ho_so_id);
CREATE INDEX idx_ho_so_ngay_tao ON ho_so_di_nuoc_ngoai(ngay_tao);
CREATE INDEX idx_ho_so_thoi_gian_di ON ho_so_di_nuoc_ngoai(thoi_gian_du_kien_di);
CREATE INDEX idx_ho_so_is_urgent ON ho_so_di_nuoc_ngoai(is_urgent);

COMMENT ON TABLE ho_so_di_nuoc_ngoai IS 'Hồ sơ đi nước ngoài của viên chức';
COMMENT ON COLUMN ho_so_di_nuoc_ngoai.trang_thai_dang_id IS 'Trạng thái hồ sơ đảng (nếu có)';

-- =====================================================
-- BẢNG FILE ĐÍNH KÈM
-- =====================================================
CREATE TABLE file_dinh_kem (
    id SERIAL PRIMARY KEY,
    ho_so_id INT,
    ho_so_dang_id INT,
    bao_cao_id INT,
    loai_file VARCHAR(50),
    ten_file_goc VARCHAR(255) NOT NULL,
    ten_file_luu VARCHAR(255) NOT NULL,
    duong_dan_file VARCHAR(500) NOT NULL,
    kich_thuoc BIGINT,
    dinh_dang VARCHAR(20),
    mo_ta TEXT,
    nguoi_upload_id INT NOT NULL,
    ngay_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_upload_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    CHECK (
        (ho_so_id IS NOT NULL AND ho_so_dang_id IS NULL AND bao_cao_id IS NULL) OR
        (ho_so_id IS NULL AND ho_so_dang_id IS NOT NULL AND bao_cao_id IS NULL) OR
        (ho_so_id IS NULL AND ho_so_dang_id IS NULL AND bao_cao_id IS NOT NULL)
    )
);

CREATE INDEX idx_file_ho_so ON file_dinh_kem(ho_so_id);
CREATE INDEX idx_file_loai ON file_dinh_kem(loai_file);
CREATE INDEX idx_file_nguoi_upload ON file_dinh_kem(nguoi_upload_id);
CREATE INDEX idx_file_ngay_upload ON file_dinh_kem(ngay_upload);

COMMENT ON TABLE file_dinh_kem IS 'File đính kèm cho hồ sơ, hồ sơ đảng, báo cáo';
COMMENT ON COLUMN file_dinh_kem.loai_file IS 'QD_CONG_TAC, DON_XIN_PHEP, BIEN_BAN_HOP, etc.';

-- =====================================================
-- BẢNG QUYẾT ĐỊNH BGH
-- =====================================================
CREATE TABLE quyet_dinh_bgh (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL,
    so_quyet_dinh VARCHAR(100) UNIQUE NOT NULL,
    ngay_ky DATE NOT NULL,
    nguoi_ky_id INT NOT NULL,
    file_id INT,
    da_ky_so BOOLEAN DEFAULT FALSE,
    ngay_ky_so TIMESTAMP,
    ghi_chu TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_ky_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES file_dinh_kem(id) ON DELETE SET NULL,
    UNIQUE (ho_so_id)
);

CREATE INDEX idx_qd_bgh_so_quyet_dinh ON quyet_dinh_bgh(so_quyet_dinh);
CREATE INDEX idx_qd_bgh_ngay_ky ON quyet_dinh_bgh(ngay_ky);

COMMENT ON TABLE quyet_dinh_bgh IS 'Quyết định của Ban Giám hiệu';

-- =====================================================
-- BẢNG QUY TRÌNH PHÊ DUYỆT
-- =====================================================
CREATE TABLE quy_trinh_phe_duyet (
    id SERIAL PRIMARY KEY,
    ma_quy_trinh VARCHAR(50) UNIQUE NOT NULL,
    ten_quy_trinh VARCHAR(200) NOT NULL,
    loai_ho_so_id INT NOT NULL,
    thu_tu INT NOT NULL,
    vai_tro_phe_duyet_id INT NOT NULL,
    thoi_gian_xu_ly_toi_da INT,
    is_bat_buoc BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    mo_ta TEXT,
    FOREIGN KEY (loai_ho_so_id) REFERENCES dm_loai_ho_so(id) ON DELETE CASCADE,
    FOREIGN KEY (vai_tro_phe_duyet_id) REFERENCES dm_vai_tro(id) ON DELETE CASCADE,
    UNIQUE (loai_ho_so_id, thu_tu)
);

CREATE INDEX idx_quy_trinh_loai_ho_so ON quy_trinh_phe_duyet(loai_ho_so_id);
CREATE INDEX idx_quy_trinh_vai_tro ON quy_trinh_phe_duyet(vai_tro_phe_duyet_id);

COMMENT ON TABLE quy_trinh_phe_duyet IS 'Quy trình phê duyệt hành chính theo từng loại hồ sơ';
COMMENT ON COLUMN quy_trinh_phe_duyet.thu_tu IS '1=Trưởng đơn vị, 2=TCNS, 3=BGH';

-- =====================================================
-- BẢNG LỊCH SỬ PHÊ DUYỆT (bao gồm chữ ký số)
-- =====================================================
CREATE TABLE lich_su_phe_duyet (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL,
    quy_trinh_id INT NOT NULL,
    nguoi_phe_duyet_id INT,
    trang_thai_phe_duyet VARCHAR(20) NOT NULL CHECK (trang_thai_phe_duyet IN ('DONG_Y','TU_CHOI','YEU_CAU_BO_SUNG')),
    y_kien_phe_duyet TEXT,
    ngay_phe_duyet TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thoi_gian_xu_ly INT,
    is_phe_duyet_cuoi_cung BOOLEAN DEFAULT FALSE,
    da_ky_so BOOLEAN DEFAULT FALSE,
    ngay_ky_so TIMESTAMP,
    file_ky_so_id INT,
    loai_ky_so VARCHAR(20) CHECK (loai_ky_so IN ('TRUONG_DON_VI','PHONG_TCNS','BGH')),
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(id) ON DELETE CASCADE,
    FOREIGN KEY (quy_trinh_id) REFERENCES quy_trinh_phe_duyet(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_phe_duyet_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    FOREIGN KEY (file_ky_so_id) REFERENCES file_dinh_kem(id) ON DELETE SET NULL
);

CREATE INDEX idx_lich_su_ho_so ON lich_su_phe_duyet(ho_so_id);
CREATE INDEX idx_lich_su_quy_trinh ON lich_su_phe_duyet(quy_trinh_id);
CREATE INDEX idx_lich_su_nguoi_duyet ON lich_su_phe_duyet(nguoi_phe_duyet_id);
CREATE INDEX idx_lich_su_ngay_duyet ON lich_su_phe_duyet(ngay_phe_duyet);
CREATE INDEX idx_lich_su_trang_thai ON lich_su_phe_duyet(trang_thai_phe_duyet);

COMMENT ON TABLE lich_su_phe_duyet IS 'Lịch sử phê duyệt hồ sơ qua các cấp';

-- =====================================================
-- BẢNG HỒ SƠ ĐẢNG
-- =====================================================
CREATE TABLE ho_so_dang (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL,
    mau_so VARCHAR(10) NOT NULL CHECK (mau_so IN ('1','2','3','4')),
    ma_ho_so_dang VARCHAR(50) UNIQUE NOT NULL,
    trang_thai_dang_id INT NOT NULL,
    chi_bo_id INT,
    nguoi_tao_id INT NOT NULL,
    ngay_gui_dang_uy TIMESTAMP,
    ngay_dang_uy_phan_hoi TIMESTAMP,
    y_kien_dang_uy TEXT,
    da_dong_y BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(id) ON DELETE CASCADE,
    FOREIGN KEY (trang_thai_dang_id) REFERENCES dm_trang_thai(id) ON DELETE RESTRICT,
    FOREIGN KEY (chi_bo_id) REFERENCES dm_chi_bo(id) ON DELETE SET NULL,
    FOREIGN KEY (nguoi_tao_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    UNIQUE (ho_so_id, mau_so)
);

CREATE INDEX idx_ho_so_dang_ho_so ON ho_so_dang(ho_so_id);
CREATE INDEX idx_ho_so_dang_trang_thai ON ho_so_dang(trang_thai_dang_id);
CREATE INDEX idx_ho_so_dang_chi_bo ON ho_so_dang(chi_bo_id);

COMMENT ON TABLE ho_so_dang IS 'Hồ sơ đảng cho đảng viên đi nước ngoài';
COMMENT ON COLUMN ho_so_dang.mau_so IS 'Mẫu 1=Đơn xin phép, 2=Quyết định, 3=Biên bản họp, 4=Đề nghị Đảng ủy';

-- =====================================================
-- BẢNG BÁO CÁO KẾT QUẢ
-- =====================================================
CREATE TABLE bao_cao_ket_qua (
    id SERIAL PRIMARY KEY,
    ho_so_id INT NOT NULL,
    ma_bao_cao VARCHAR(50) UNIQUE NOT NULL,
    nguoi_bao_cao_id INT NOT NULL,
    tieu_de VARCHAR(255),
    tom_tat TEXT,
    noi_dung_bao_cao TEXT NOT NULL,
    thoi_gian_thuc_te_di TIMESTAMP,
    thoi_gian_thuc_te_ve TIMESTAMP,
    da_gui_bao_cao_dang_uy BOOLEAN DEFAULT FALSE,
    ngay_gui_dang_uy TIMESTAMP,
    da_gui_bao_cao_tcns BOOLEAN DEFAULT FALSE,
    ngay_gui_tcns TIMESTAMP,
    ngay_bao_cao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(id) ON DELETE CASCADE,
    FOREIGN KEY (nguoi_bao_cao_id) REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    UNIQUE (ho_so_id)
);

CREATE INDEX idx_bao_cao_ho_so ON bao_cao_ket_qua(ho_so_id);
CREATE INDEX idx_bao_cao_nguoi_bao_cao ON bao_cao_ket_qua(nguoi_bao_cao_id);
CREATE INDEX idx_bao_cao_ngay_bao_cao ON bao_cao_ket_qua(ngay_bao_cao);

COMMENT ON TABLE bao_cao_ket_qua IS 'Báo cáo kết quả sau khi đi nước ngoài';

-- =====================================================
-- BẢNG CẤU HÌNH HỆ THỐNG
-- =====================================================
CREATE TABLE cau_hinh_he_thong (
    id SERIAL PRIMARY KEY,
    ma_cau_hinh VARCHAR(100) UNIQUE NOT NULL,
    gia_tri_cau_hinh TEXT,
    kieu_du_lieu VARCHAR(20) DEFAULT 'STRING' CHECK (kieu_du_lieu IN ('STRING','INT','BOOLEAN','JSON','DATE')),
    mo_ta TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cau_hinh_ma ON cau_hinh_he_thong(ma_cau_hinh);

COMMENT ON TABLE cau_hinh_he_thong IS 'Cấu hình tham số hệ thống';

-- =====================================================
CREATE TABLE lich_su_he_thong (
    id SERIAL PRIMARY KEY,
    loai_su_kien VARCHAR(30) NOT NULL CHECK (loai_su_kien IN ('DANG_NHAP','TAO_HO_SO','DUYET_HO_SO','CAP_NHAT','XOA','BAO_CAO')),
    nguoi_dung_id INT,
    mo_ta_su_kien TEXT NOT NULL,
    chi_tiet_su_kien JSONB,
    dia_chi_ip VARCHAR(45),
    trinh_duyet VARCHAR(255),
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(id) ON DELETE SET NULL
);

CREATE INDEX idx_lich_su_thoi_gian ON lich_su_he_thong(thoi_gian);
CREATE INDEX idx_lich_su_loai_su_kien ON lich_su_he_thong(loai_su_kien);
CREATE INDEX idx_lich_su_nguoi_dung ON lich_su_he_thong(nguoi_dung_id);

COMMENT ON TABLE lich_su_he_thong IS 'Lịch sử hoạt động hệ thống (audit log)';

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ngay_cap_nhat = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dm_don_vi_update
    BEFORE UPDATE ON dm_don_vi
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_nguoi_dung_update
    BEFORE UPDATE ON nguoi_dung
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_ho_so_update
    BEFORE UPDATE ON ho_so_di_nuoc_ngoai
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_ho_so_dang_update
    BEFORE UPDATE ON ho_so_dang
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_bao_cao_update
    BEFORE UPDATE ON bao_cao_ket_qua
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- INITIAL DATA - DANH MỤC TRẠNG THÁI
-- =====================================================
INSERT INTO dm_trang_thai (ma_trang_thai, ten_trang_thai, loai_trang_thai, thu_tu_hien_thi, mau_sac) VALUES
-- Trạng thái hành chính
('DA_TIEP_NHAN', 'Đã tiếp nhận', 'HANH_CHINH', 1, 'blue'),
('CHO_DON_VI', 'Chờ đơn vị phê duyệt', 'HANH_CHINH', 2, 'orange'),
('DV_DA_DUYET', 'Đơn vị đã duyệt', 'HANH_CHINH', 3, 'green'),
('CHO_TCNS', 'Chờ TCNS phê duyệt', 'HANH_CHINH', 4, 'orange'),
('TCNS_DA_DUYET', 'TCNS đã duyệt', 'HANH_CHINH', 5, 'green'),
('CHO_BGH', 'Chờ BGH phê duyệt', 'HANH_CHINH', 6, 'orange'),
('BGH_DA_DUYET', 'BGH đã duyệt', 'HANH_CHINH', 7, 'green'),
('TU_CHOI', 'Từ chối', 'HANH_CHINH', 8, 'red'),
('YEU_CAU_BO_SUNG', 'Yêu cầu bổ sung', 'HANH_CHINH', 9, 'yellow'),

-- Trạng thái đảng
('CHO_CHI_BO', 'Chờ chi bộ xử lý', 'DANG', 10, 'orange'),
('CHI_BO_DA_HOP', 'Chi bộ đã họp', 'DANG', 11, 'green'),
('CHO_DANG_UY', 'Chờ Đảng ủy Khối', 'DANG', 12, 'orange'),
('DANG_UY_DONG_Y', 'Đảng ủy đồng ý', 'DANG', 13, 'green'),
('DANG_UY_TU_CHOI', 'Đảng ủy từ chối', 'DANG', 14, 'red'),

-- Trạng thái hệ thống
('DUOC_PHEP_DI', 'Được phép đi', 'HE_THONG', 15, 'green'),
('DANG_THUC_HIEN', 'Đang thực hiện chuyến đi', 'HE_THONG', 16, 'blue'),
('DA_VE', 'Đã về nước', 'HE_THONG', 17, 'blue'),
('CHO_BAO_CAO', 'Chờ báo cáo', 'HE_THONG', 18, 'orange'),
('HOAN_THANH', 'Hoàn thành', 'HE_THONG', 19, 'green')
ON CONFLICT (ma_trang_thai) DO NOTHING;

-- =====================================================
-- INITIAL DATA - ĐƠN VỊ
-- =====================================================
INSERT INTO dm_don_vi (ma_don_vi, ten_don_vi, loai_don_vi, email) VALUES
('DV001', 'Phòng Tổ chức - Nhân sự', 'Phòng', 'tcns@tvu.edu.vn'),
('DV002', 'Khoa Công nghệ Thông tin', 'Khoa', 'fit@tvu.edu.vn'),
('DV003', 'Khoa Kinh tế', 'Khoa', 'economics@tvu.edu.vn'),
('DV004', 'Khoa Kỹ thuật và Công nghệ', 'Khoa', 'fet@tvu.edu.vn'),
('DV005', 'Ban Giám hiệu', 'Ban', 'bgh@tvu.edu.vn')
ON CONFLICT (ma_don_vi) DO NOTHING;

-- =====================================================
-- INITIAL DATA - CHI BỘ
-- =====================================================
INSERT INTO dm_chi_bo (ma_chi_bo, ten_chi_bo) VALUES
('CB001', 'Chi bộ Khoa Công nghệ Thông tin'),
('CB002', 'Chi bộ Khoa Kinh tế'),
('CB003', 'Chi bộ Khoa Kỹ thuật')
ON CONFLICT (ma_chi_bo) DO NOTHING;

-- =====================================================
-- INITIAL DATA - VAI TRÒ
-- =====================================================
INSERT INTO dm_vai_tro (ma_vai_tro, ten_vai_tro, mo_ta, cap_duyet) VALUES
('VT_ADMIN', 'Quản trị viên', 'Quản trị hệ thống', NULL),
('VT_VIEN_CHUC', 'Viên chức', 'Viên chức/Giảng viên nộp hồ sơ', NULL),
('VT_TRUONG_DV', 'Trưởng đơn vị', 'Trưởng khoa/phòng phê duyệt cấp 1', 1),
('VT_TCNS', 'Phòng TCNS', 'Phòng Tổ chức - Nhân sự phê duyệt cấp 2', 2),
('VT_BGH', 'Ban Giám hiệu', 'Ban Giám hiệu phê duyệt cấp 3', 3),
('VT_BI_THU_CB', 'Bí thư chi bộ', 'Bí thư chi bộ xử lý hồ sơ đảng', NULL),
('VT_DANG_UY', 'Đảng ủy Khối', 'Đảng ủy Khối duyệt hồ sơ đảng', NULL)
ON CONFLICT (ma_vai_tro) DO NOTHING;

-- =====================================================
-- INITIAL DATA - LOẠI HỒ SƠ
-- =====================================================
INSERT INTO dm_loai_ho_so (ma_loai_ho_so, ten_loai_ho_so, yeu_cau_dang_vien, yeu_cau_ho_so_dang) VALUES
('CONG_TAC', 'Công tác', FALSE, FALSE),
('VIEC_RIENG', 'Việc riêng', FALSE, TRUE),
('CONG_TAC_DV', 'Công tác (Đảng viên)', TRUE, TRUE),
('VIEC_RIENG_DV', 'Việc riêng (Đảng viên)', TRUE, TRUE)
ON CONFLICT (ma_loai_ho_so) DO NOTHING;

-- =====================================================
-- INITIAL DATA - QUỐC GIA
-- =====================================================
INSERT INTO dm_quoc_gia (ma_quoc_gia, ten_quoc_gia, ten_tieng_anh) VALUES
('VN', 'Việt Nam', 'Vietnam'),
('US', 'Hoa Kỳ', 'United States'),
('JP', 'Nhật Bản', 'Japan'),
('KR', 'Hàn Quốc', 'South Korea'),
('CN', 'Trung Quốc', 'China'),
('TH', 'Thái Lan', 'Thailand'),
('SG', 'Singapore', 'Singapore'),
('MY', 'Malaysia', 'Malaysia'),
('AU', 'Úc', 'Australia'),
('GB', 'Anh', 'United Kingdom'),
('FR', 'Pháp', 'France'),
('DE', 'Đức', 'Germany')
ON CONFLICT (ma_quoc_gia) DO NOTHING;

-- =====================================================
-- INITIAL DATA - QUY TRÌNH PHÊ DUYỆT
-- =====================================================
-- Quy trình cho CÔNG TÁC (không phải đảng viên)
INSERT INTO quy_trinh_phe_duyet (ma_quy_trinh, ten_quy_trinh, loai_ho_so_id, thu_tu, vai_tro_phe_duyet_id, thoi_gian_xu_ly_toi_da) VALUES
('QT_CT_1', 'Trưởng đơn vị phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'CONG_TAC'), 1, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_TRUONG_DV'), 3),
('QT_CT_2', 'Phòng TCNS phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'CONG_TAC'), 2, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_TCNS'), 3),
('QT_CT_3', 'BGH phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'CONG_TAC'), 3, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_BGH'), 5)
ON CONFLICT (loai_ho_so_id, thu_tu) DO NOTHING;

-- Quy trình cho VIỆC RIÊNG (không phải đảng viên)
INSERT INTO quy_trinh_phe_duyet (ma_quy_trinh, ten_quy_trinh, loai_ho_so_id, thu_tu, vai_tro_phe_duyet_id, thoi_gian_xu_ly_toi_da) VALUES
('QT_VR_1', 'Trưởng đơn vị phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'VIEC_RIENG'), 1, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_TRUONG_DV'), 3),
('QT_VR_2', 'Phòng TCNS phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'VIEC_RIENG'), 2, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_TCNS'), 3),
('QT_VR_3', 'BGH phê duyệt', (SELECT id FROM dm_loai_ho_so WHERE ma_loai_ho_so = 'VIEC_RIENG'), 3, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_BGH'), 5)
ON CONFLICT (loai_ho_so_id, thu_tu) DO NOTHING;

-- =====================================================
-- INITIAL DATA - NGƯỜI DÙNG MẶC ĐỊNH
-- =====================================================
-- Password: admin123 (bcrypt hash)
INSERT INTO nguoi_dung (username, password_hash, ho_ten, email, don_vi_id, is_active) VALUES
('admin', '$2b$10$ou67KK7ktmqhuGmcROLj9edLIQ/qi2T./48OJiaNmwT72VAuTLc0m', 'Quản trị viên', 'admin@tvu.edu.vn', 1, TRUE)
ON CONFLICT (username) DO NOTHING;

-- Gán vai trò Admin
INSERT INTO phan_quyen (nguoi_dung_id, vai_tro_id) VALUES
(1, (SELECT id FROM dm_vai_tro WHERE ma_vai_tro = 'VT_ADMIN'))
ON CONFLICT (nguoi_dung_id, vai_tro_id, don_vi_id) DO NOTHING;

-- =====================================================
-- CẤU HÌNH HỆ THỐNG
-- =====================================================
INSERT INTO cau_hinh_he_thong (ma_cau_hinh, gia_tri_cau_hinh, kieu_du_lieu, mo_ta) VALUES
('MAX_FILE_SIZE', '10485760', 'INT', 'Kích thước file tối đa (bytes) - 10MB'),
('ALLOWED_FILE_TYPES', 'pdf,doc,docx,jpg,png', 'STRING', 'Các loại file được phép upload'),
('THOI_GIAN_DUYET_MAC_DINH', '3', 'INT', 'Thời gian phê duyệt mặc định (ngày)'),
('EMAIL_THONG_BAO', 'true', 'BOOLEAN', 'Bật/tắt email thông báo'),
('YEU_CAU_CHU_KY_SO', 'true', 'BOOLEAN', 'Yêu cầu chữ ký số khi phê duyệt')
ON CONFLICT (ma_cau_hinh) DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Database schema v3.0 created successfully!';
    RAISE NOTICE 'Database: qlhs_dinuocngoai';
    RAISE NOTICE 'Default user: admin / admin123';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Quy trình phê duyệt:';
    RAISE NOTICE '1. Trưởng đơn vị -> 2. TCNS -> 3. BGH';
    RAISE NOTICE 'Đảng viên: Thêm quy trình Đảng sau BGH';
    RAISE NOTICE '==================================================';
END $$;
