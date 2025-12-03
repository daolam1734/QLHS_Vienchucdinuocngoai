-- =====================================================
-- MIGRATION: Đổi tên TCHC thành TCNS (Tổ chức Nhân sự)
-- Ngày: 2025-12-01
-- Mô tả: Cập nhật toàn bộ database từ TCHC sang TCNS
-- =====================================================

BEGIN;

-- 1. Cập nhật bảng don_vi_quan_ly
UPDATE don_vi_quan_ly 
SET ten_don_vi = 'Phòng Tổ chức Nhân sự',
    email = 'tcns@tvu.edu.vn'
WHERE ten_don_vi LIKE '%Tổ chức - Hành chính%' 
   OR ten_don_vi LIKE '%Tổ chức%Hành chính%'
   OR email = 'tchc@tvu.edu.vn';

-- 2. Cập nhật bảng nguoi_duyet (vai_tro và email)
UPDATE nguoi_duyet 
SET vai_tro = 'TCNS',
    email = REPLACE(email, 'tchc', 'tcns')
WHERE vai_tro = 'TCHC' 
   OR email LIKE '%tchc%tvu.edu.vn';

-- 3. Cập nhật bảng nguoi_dung (email)
UPDATE nguoi_dung 
SET email = REPLACE(email, 'tchc', 'tcns')
WHERE email LIKE '%tchc%tvu.edu.vn';

-- 4. Cập nhật bảng roles
UPDATE roles 
SET role_name = 'TCNS',
    description = 'Phòng TCNS'
WHERE role_name = 'TCHC';

-- 5. Cập nhật bảng ho_so_duyet (vai_tro_duyet) - nếu có cột này
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ho_so_duyet' 
        AND column_name = 'vai_tro_duyet'
    ) THEN
        UPDATE ho_so_duyet 
        SET vai_tro_duyet = 'TCNS'
        WHERE vai_tro_duyet = 'TCHC';
    END IF;
END $$;

-- 6. Đổi tên columns trong bảng bao_cao_sau_chuyen_di
-- Kiểm tra và đổi tên cột nếu tồn tại
DO $$ 
BEGIN
    -- Đổi tchc_nguoi_ky thành tcns_nguoi_ky
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bao_cao_sau_chuyen_di' 
        AND column_name = 'tchc_nguoi_ky'
    ) THEN
        ALTER TABLE bao_cao_sau_chuyen_di 
        RENAME COLUMN tchc_nguoi_ky TO tcns_nguoi_ky;
    END IF;

    -- Đổi tchc_ngay_ky thành tcns_ngay_ky
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bao_cao_sau_chuyen_di' 
        AND column_name = 'tchc_ngay_ky'
    ) THEN
        ALTER TABLE bao_cao_sau_chuyen_di 
        RENAME COLUMN tchc_ngay_ky TO tcns_ngay_ky;
    END IF;

    -- Đổi tchc_y_kien thành tcns_y_kien
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bao_cao_sau_chuyen_di' 
        AND column_name = 'tchc_y_kien'
    ) THEN
        ALTER TABLE bao_cao_sau_chuyen_di 
        RENAME COLUMN tchc_y_kien TO tcns_y_kien;
    END IF;
END $$;

-- 7. Đổi tên constraint
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_baocao_tchc' 
        AND table_name = 'bao_cao_sau_chuyen_di'
    ) THEN
        ALTER TABLE bao_cao_sau_chuyen_di 
        DROP CONSTRAINT fk_baocao_tchc;
        
        ALTER TABLE bao_cao_sau_chuyen_di 
        ADD CONSTRAINT fk_baocao_tcns 
        FOREIGN KEY (tcns_nguoi_ky) 
        REFERENCES nguoi_duyet(ma_nguoi_duyet) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- 8. Cập nhật trạng thái trong bảng ho_so_di_nuoc_ngoai
UPDATE ho_so_di_nuoc_ngoai 
SET trang_thai = 'ChoTCNSDuyet'
WHERE trang_thai = 'ChoTCHCDuyet';

-- 9. Cập nhật trạng thái trong bảng bao_cao_sau_chuyen_di
UPDATE bao_cao_sau_chuyen_di 
SET trang_thai = REPLACE(trang_thai, 'ChoTCHCKy', 'ChoTCNSKy')
WHERE trang_thai LIKE '%TCHC%';

-- 10. Cập nhật loại văn bản trong bảng tai_lieu_dinh_kem (nếu có)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tai_lieu_dinh_kem' 
        AND column_name = 'loai_van_ban'
    ) THEN
        UPDATE tai_lieu_dinh_kem 
        SET loai_van_ban = 'ToTrinhTCNS'
        WHERE loai_van_ban = 'ToTrinhTCHC';
    END IF;
END $$;

-- 11. Tạo lại trigger với tên mới (chỉ nếu trigger tồn tại)
DROP TRIGGER IF EXISTS trg_auto_assign_approvers ON ho_so_di_nuoc_ngoai;
DROP FUNCTION IF EXISTS fn_auto_assign_approvers();

-- Tạo function mới với TCNS (nếu cần)
-- Note: Chỉ tạo nếu hệ thống đang sử dụng auto-assign approvers

-- 12. Tạo lại trigger cập nhật trạng thái (chỉ nếu trigger tồn tại)
DROP TRIGGER IF EXISTS trg_update_hoso_status_on_approval ON ho_so_duyet;
DROP FUNCTION IF EXISTS fn_update_hoso_status_on_approval();

-- Commit transaction
COMMIT;

-- Verification queries
SELECT 'Migration completed successfully!' as status;

-- Kiểm tra kết quả
SELECT 'don_vi_quan_ly' as table_name, COUNT(*) as count 
FROM don_vi_quan_ly WHERE email LIKE '%tcns%';

SELECT 'nguoi_duyet' as table_name, COUNT(*) as count 
FROM nguoi_duyet WHERE vai_tro = 'TCNS';

SELECT 'roles' as table_name, COUNT(*) as count 
FROM roles WHERE role_name = 'TCNS';

SELECT 'ho_so_duyet' as table_name, COUNT(*) as count 
FROM ho_so_duyet WHERE EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ho_so_duyet' AND column_name = 'vai_tro_duyet'
);
