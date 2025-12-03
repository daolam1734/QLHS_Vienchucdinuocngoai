/**
 * Vien Chuc Service
 * Handle database operations for vien chuc
 */

import pool from '../config/database';

interface ProfileData {
  dien_thoai: string;
  dia_chi: string;
  so_cccd?: string;
  trinh_do?: string;
  chuyen_mon?: string;
  chuc_vu?: string;
}

/**
 * Complete profile for new vien chuc
 */
export const completeProfile = async (userId: string, email: string, profileData: ProfileData): Promise<void> => {
  const client = await pool.connect();
  try {
    // Find ma_vien_chuc from nguoi_dung
    const userResult = await client.query(
      'SELECT ma_vien_chuc FROM nguoi_dung WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Không tìm thấy người dùng');
    }

    const maVienChuc = userResult.rows[0].ma_vien_chuc;
    if (!maVienChuc) {
      throw new Error('Người dùng không phải viên chức');
    }

    // Update vien_chuc table with profile data
    await client.query(
      `UPDATE vien_chuc 
       SET dien_thoai = $1,
           dia_chi = $2,
           so_cccd = $3,
           trinh_do = $4,
           chuyen_mon = $5,
           chuc_vu = $6,
           is_profile_completed = true,
           profile_completed_at = CURRENT_TIMESTAMP
       WHERE ma_vien_chuc = $7`,
      [
        profileData.dien_thoai,
        profileData.dia_chi,
        profileData.so_cccd || null,
        profileData.trinh_do || null,
        profileData.chuyen_mon || null,
        profileData.chuc_vu || null,
        maVienChuc
      ]
    );

    console.log(`Profile completed for vien chuc ${maVienChuc} (user ${userId})`);
  } finally {
    client.release();
  }
};

/**
 * Get profile information
 */
export const getProfile = async (userId: string): Promise<any> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
         nd.user_id,
         nd.email,
         nd.role as vai_tro,
         vc.ma_vien_chuc,
         vc.ho_ten,
         vc.dien_thoai,
         vc.dia_chi,
         vc.so_cccd,
         vc.trinh_do,
         vc.chuyen_mon,
         vc.chuc_vu,
         vc.is_profile_completed,
         vc.profile_completed_at,
         vc.is_dang_vien,
         dv.ten_don_vi as don_vi_quan_ly
       FROM nguoi_dung nd
       JOIN vien_chuc vc ON nd.ma_vien_chuc = vc.ma_vien_chuc
       LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
       WHERE nd.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    return result.rows[0];
  } finally {
    client.release();
  }
};

/**
 * Update profile
 */
export const updateProfile = async (userId: string, email: string, profileData: ProfileData): Promise<void> => {
  const client = await pool.connect();
  try {
    // Find ma_vien_chuc from nguoi_dung
    const userResult = await client.query(
      'SELECT ma_vien_chuc FROM nguoi_dung WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Không tìm thấy người dùng');
    }

    const maVienChuc = userResult.rows[0].ma_vien_chuc;
    if (!maVienChuc) {
      throw new Error('Người dùng không phải viên chức');
    }

    // Update vien_chuc table
    await client.query(
      `UPDATE vien_chuc 
       SET dien_thoai = $1,
           dia_chi = $2,
           so_cccd = $3,
           trinh_do = $4,
           chuyen_mon = $5,
           chuc_vu = $6
       WHERE ma_vien_chuc = $7`,
      [
        profileData.dien_thoai,
        profileData.dia_chi,
        profileData.so_cccd || null,
        profileData.trinh_do || null,
        profileData.chuyen_mon || null,
        profileData.chuc_vu || null,
        maVienChuc
      ]
    );

    console.log(`Profile updated for vien chuc ${maVienChuc} (user ${userId})`);
  } finally {
    client.release();
  }
};
