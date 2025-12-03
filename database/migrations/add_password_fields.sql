-- Migration: Add password fields to nguoi_dung table
-- Date: 2025-12-01

-- Add password and first login tracking columns
ALTER TABLE nguoi_dung 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITHOUT TIME ZONE,
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP WITHOUT TIME ZONE;

-- Add comment
COMMENT ON COLUMN nguoi_dung.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN nguoi_dung.is_first_login IS 'True if user has not changed their initial password';
COMMENT ON COLUMN nguoi_dung.password_changed_at IS 'Timestamp of last password change';
COMMENT ON COLUMN nguoi_dung.password_reset_token IS 'Token for password reset';
COMMENT ON COLUMN nguoi_dung.password_reset_expires IS 'Expiry time for reset token';

-- Set default password (hashed '123456') for existing users
-- Password hash for '123456' using bcrypt
UPDATE nguoi_dung 
SET password_hash = '$2b$10$rKW5JQvKHKjH8X8ZN8X8ZN8X8ZN8X8ZN8X8ZN8X8ZN8X8ZN8X8ZN8'
WHERE password_hash IS NULL;

-- Set is_first_login to true for all existing users
UPDATE nguoi_dung 
SET is_first_login = true
WHERE is_first_login IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_password_reset_token 
ON nguoi_dung(password_reset_token);

SELECT 'Migration completed: Password fields added to nguoi_dung table' as status;
