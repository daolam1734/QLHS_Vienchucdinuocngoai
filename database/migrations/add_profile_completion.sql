-- Migration: Add profile completion tracking
-- Date: 2025-12-01

-- Add profile completion flag to vien_chuc table
ALTER TABLE vien_chuc 
ADD COLUMN IF NOT EXISTS is_profile_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP WITHOUT TIME ZONE;

-- Add comments
COMMENT ON COLUMN vien_chuc.is_profile_completed IS 'True if user has completed their profile information';
COMMENT ON COLUMN vien_chuc.profile_completed_at IS 'Timestamp when profile was completed';

-- Update existing records with complete info as completed
UPDATE vien_chuc 
SET is_profile_completed = true,
    profile_completed_at = CURRENT_TIMESTAMP
WHERE so_cmnd IS NOT NULL 
  AND dien_thoai IS NOT NULL 
  AND dia_chi IS NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_vien_chuc_profile_completed 
ON vien_chuc(is_profile_completed);

SELECT 'Migration completed: Profile completion tracking added' as status;
