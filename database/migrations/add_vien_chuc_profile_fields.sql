-- Add additional profile fields to vien_chuc table
-- These fields will be filled when user completes their profile

-- Contact information
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS dien_thoai VARCHAR(20);
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS dia_chi TEXT;

-- CMND/CCCD details (so_cccd already exists as primary ID)
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS ngay_cap_cccd DATE;
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS noi_cap_cccd VARCHAR(255);

-- Education
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS trinh_do VARCHAR(100);
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS chuyen_mon VARCHAR(255);

-- Job information
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS chuc_vu VARCHAR(255);

-- Passport information (for international travel)
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS so_ho_chieu VARCHAR(20);
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS ngay_cap_ho_chieu DATE;
ALTER TABLE vien_chuc ADD COLUMN IF NOT EXISTS ngay_het_han_ho_chieu DATE;

-- Comments
COMMENT ON COLUMN vien_chuc.dien_thoai IS 'Số điện thoại liên lạc';
COMMENT ON COLUMN vien_chuc.dia_chi IS 'Địa chỉ liên lạc';
COMMENT ON COLUMN vien_chuc.ngay_cap_cccd IS 'Ngày cấp CCCD';
COMMENT ON COLUMN vien_chuc.noi_cap_cccd IS 'Nơi cấp CCCD';
COMMENT ON COLUMN vien_chuc.trinh_do IS 'Trình độ học vấn (Cử nhân, Thạc sĩ, Tiến sĩ...)';
COMMENT ON COLUMN vien_chuc.chuyen_mon IS 'Chuyên môn đào tạo';
COMMENT ON COLUMN vien_chuc.chuc_vu IS 'Chức vụ hiện tại';
COMMENT ON COLUMN vien_chuc.so_ho_chieu IS 'Số hộ chiếu';
COMMENT ON COLUMN vien_chuc.ngay_cap_ho_chieu IS 'Ngày cấp hộ chiếu';
COMMENT ON COLUMN vien_chuc.ngay_het_han_ho_chieu IS 'Ngày hết hạn hộ chiếu';

-- Update existing records that have complete basic info
UPDATE vien_chuc
SET is_profile_completed = true,
    profile_completed_at = CURRENT_TIMESTAMP
WHERE so_cccd IS NOT NULL 
  AND email IS NOT NULL 
  AND ho_ten IS NOT NULL
  AND is_profile_completed = false;

-- Create index for phone number searches
CREATE INDEX IF NOT EXISTS idx_vien_chuc_dien_thoai ON vien_chuc(dien_thoai);

SELECT 'Migration completed: Additional profile fields added to vien_chuc' as status;
