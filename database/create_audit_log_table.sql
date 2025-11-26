-- Create Audit Log table if not exists
CREATE TABLE IF NOT EXISTS NhatKyHeThong (
    ma_nhat_ky SERIAL PRIMARY KEY,
    nguoi_thuc_hien VARCHAR(100),
    hanh_dong VARCHAR(255) NOT NULL,
    doi_tuong VARCHAR(255),
    mo_ta TEXT,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    loai VARCHAR(20) DEFAULT 'info' CHECK (loai IN ('info', 'success', 'warning', 'error'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_nhatky_thoigian ON NhatKyHeThong(thoi_gian DESC);
CREATE INDEX IF NOT EXISTS idx_nhatky_loai ON NhatKyHeThong(loai);
CREATE INDEX IF NOT EXISTS idx_nhatky_nguoi ON NhatKyHeThong(nguoi_thuc_hien);

COMMENT ON TABLE NhatKyHeThong IS 'Nhật ký hoạt động hệ thống';
COMMENT ON COLUMN NhatKyHeThong.loai IS 'Loại log: info, success, warning, error';
