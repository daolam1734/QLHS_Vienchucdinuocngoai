import pool from '../config/database';

// Dashboard Stats
export const getDashboardStats = async () => {
  const client = await pool.connect();
  try {
    // Total applications
    const totalResult = await client.query(
      'SELECT COUNT(*) as total FROM ho_so_di_nuoc_ngoai'
    );
    const total = parseInt(totalResult.rows[0].total);

    // Pending applications
    const pendingResult = await client.query(`
      SELECT COUNT(*) as pending 
      FROM ho_so_di_nuoc_ngoai h
      JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      WHERE tt.ma_trang_thai = 'CHO_DUYET'
    `);
    const pending = parseInt(pendingResult.rows[0].pending);

    // Approved applications
    const approvedResult = await client.query(`
      SELECT COUNT(*) as approved 
      FROM ho_so_di_nuoc_ngoai h
      JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      WHERE tt.ma_trang_thai = 'DA_DUYET'
    `);
    const approved = parseInt(approvedResult.rows[0].approved);

    // Total users
    const usersResult = await client.query(
      'SELECT COUNT(*) as users FROM nguoi_dung WHERE is_active = true'
    );
    const users = parseInt(usersResult.rows[0].users);

    // Recent applications
    const recentResult = await client.query(`
      SELECT 
        h.id,
        h.ma_ho_so,
        n.ho_ten as name,
        dv.ten_don_vi as department,
        lhs.ten_loai_ho_so as type,
        qg.ten_quoc_gia as country,
        h.ngay_tao as date,
        tt.ma_trang_thai as status
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
      LEFT JOIN dm_don_vi dv ON n.don_vi_id = dv.id
      LEFT JOIN dm_loai_ho_so lhs ON h.loai_ho_so_id = lhs.id
      LEFT JOIN dm_quoc_gia qg ON h.quoc_gia_den_id = qg.id
      LEFT JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      ORDER BY h.ngay_tao DESC
      LIMIT 5
    `);

    const recentApplications = recentResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      department: row.department,
      type: row.type,
      country: row.country,
      date: row.date,
      status: getStatusText(row.status),
      statusColor: getStatusColor(row.status)
    }));

    return {
      totalApplications: total,
      totalChange: '+12%',
      totalTrend: 'up',
      pendingApplications: pending,
      pendingChange: `+${pending}`,
      approvedApplications: approved,
      approvedChange: '+8%',
      totalUsers: users,
      usersChange: '+2%',
      usersTrend: 'up',
      recentApplications
    };
  } finally {
    client.release();
  }
};

// Hồ sơ Management
export const getAllHoSo = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        h.id,
        h.ma_ho_so as "maHoSo",
        n.ho_ten as "hoTen",
        dv.ten_don_vi as "donVi",
        lhs.ten_loai_ho_so as "loaiHoSo",
        qg.ten_quoc_gia as "quocGia",
        h.ngay_tao as "ngayNop",
        tt.ten_trang_thai as "trangThai"
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
      LEFT JOIN dm_don_vi dv ON n.don_vi_id = dv.id
      LEFT JOIN dm_loai_ho_so lhs ON h.loai_ho_so_id = lhs.id
      LEFT JOIN dm_quoc_gia qg ON h.quoc_gia_den_id = qg.id
      LEFT JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      ORDER BY h.ngay_tao DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const deleteHoSo = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Delete related records first
    await client.query('DELETE FROM file_dinh_kem WHERE ho_so_id = $1', [id]);
    await client.query('DELETE FROM lich_su_phe_duyet WHERE ho_so_id = $1', [id]);
    
    // Delete the hoso
    const result = await client.query('DELETE FROM ho_so_di_nuoc_ngoai WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy hồ sơ');
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// User Management
export const getAllUsers = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        nd.id,
        nd.username,
        nd.ho_ten as "hoTen",
        nd.email,
        dv.ten_don_vi as "donVi",
        vt.ten_vai_tro as "vaiTro",
        CASE WHEN nd.is_active THEN 'active' ELSE 'locked' END as "trangThai",
        nd.ngay_tao as "ngayTao"
      FROM nguoi_dung nd
      LEFT JOIN dm_don_vi dv ON nd.don_vi_id = dv.id
      LEFT JOIN phan_quyen pq ON nd.id = pq.nguoi_dung_id
      LEFT JOIN dm_vai_tro vt ON pq.vai_tro_id = vt.id
      ORDER BY nd.ngay_tao DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const updateUserStatus = async (id: string, trangThai: string) => {
  const client = await pool.connect();
  try {
    const active = trangThai === 'active';
    const result = await client.query(
      'UPDATE nguoi_dung SET is_active = $1 WHERE id = $2',
      [active, id]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
  } finally {
    client.release();
  }
};

export const deleteUser = async (id: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if user has hoso
    const hosoCheck = await client.query(
      'SELECT COUNT(*) as count FROM ho_so_di_nuoc_ngoai WHERE nguoi_dung_id = $1',
      [id]
    );
    
    if (parseInt(hosoCheck.rows[0].count) > 0) {
      throw new Error('Không thể xóa người dùng đã có hồ sơ');
    }
    
    // Delete related records
    await client.query('DELETE FROM phan_quyen WHERE nguoi_dung_id = $1', [id]);
    
    // Delete user
    const result = await client.query('DELETE FROM nguoi_dung WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const resetUserPassword = async (id: string) => {
  // TODO: Implement password reset email
  console.log('Reset password for user:', id);
  // In production, generate reset token and send email
};

// Đơn vị Management
export const getAllDonVi = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        dv.id,
        dv.ma_don_vi as "maDonVi",
        dv.ten_don_vi as "tenDonVi",
        dv.loai_don_vi as "loaiDonVi",
        nd.ho_ten as "truongDonVi",
        (SELECT COUNT(*) FROM nguoi_dung WHERE don_vi_id = dv.id AND is_active = true) as "soNguoi",
        dv.email,
        dv.so_dien_thoai as "dienThoai"
      FROM dm_don_vi dv
      LEFT JOIN nguoi_dung nd ON dv.truong_don_vi_id = nd.id
      ORDER BY dv.ma_don_vi
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const deleteDonVi = async (id: string) => {
  const client = await pool.connect();
  try {
    // Check if donvi has users
    const userCheck = await client.query(
      'SELECT COUNT(*) as count FROM nguoi_dung WHERE don_vi_id = $1',
      [id]
    );
    
    if (parseInt(userCheck.rows[0].count) > 0) {
      throw new Error('Không thể xóa đơn vị đang có người dùng');
    }
    
    const result = await client.query('DELETE FROM dm_don_vi WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đơn vị');
    }
  } finally {
    client.release();
  }
};

// Approval Queue
export const getApprovalQueue = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT DISTINCT ON (h.id)
        h.id,
        h.ma_ho_so as "maHoSo",
        n.ho_ten as "hoTen",
        dv.ten_don_vi as "donVi",
        lhs.ten_loai_ho_so as "loaiHoSo",
        COALESCE(
          CASE 
            WHEN qt.thu_tu = 1 THEN 'Trưởng đơn vị'
            WHEN qt.thu_tu = 2 THEN 'TCHC'
            WHEN qt.thu_tu = 3 THEN 'BGH'
            ELSE 'Chưa xác định'
          END,
          'Trưởng đơn vị'
        ) as "capDuyet",
        h.ngay_tao as "ngayNop",
        COALESCE(h.thoi_gian_du_kien_ve, h.ngay_tao + interval '7 days') as "hanXuLy",
        CASE 
          WHEN EXTRACT(DAY FROM (COALESCE(h.thoi_gian_du_kien_ve, h.ngay_tao + interval '7 days') - CURRENT_DATE)) <= 2 THEN 'high'
          WHEN EXTRACT(DAY FROM (COALESCE(h.thoi_gian_du_kien_ve, h.ngay_tao + interval '7 days') - CURRENT_DATE)) <= 5 THEN 'medium'
          ELSE 'low'
        END as "doUuTien"
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
      LEFT JOIN dm_don_vi dv ON n.don_vi_id = dv.id
      LEFT JOIN dm_loai_ho_so lhs ON h.loai_ho_so_id = lhs.id
      LEFT JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      LEFT JOIN lich_su_phe_duyet lspd ON h.id = lspd.ho_so_id
      LEFT JOIN quy_trinh_phe_duyet qt ON lspd.quy_trinh_id = qt.id
      WHERE tt.ma_trang_thai = 'CHO_DUYET'
      ORDER BY h.id, "doUuTien" DESC, h.ngay_tao DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
};

export const approveHoSo = async (id: string, userId: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get DA_DUYET status ID
    const statusResult = await client.query(
      "SELECT id FROM dm_trang_thai WHERE ma_trang_thai = 'DA_DUYET' LIMIT 1"
    );
    
    if (statusResult.rows.length === 0) {
      throw new Error('Không tìm thấy trạng thái DA_DUYET');
    }
    
    const statusId = statusResult.rows[0].id;
    
    // Get quy trinh for this hoso (first step)
    const quyTrinhResult = await client.query(`
      SELECT qt.id FROM quy_trinh_phe_duyet qt
      JOIN ho_so_di_nuoc_ngoai h ON h.loai_ho_so_id = qt.loai_ho_so_id
      WHERE h.id = $1 AND qt.thu_tu = 1 AND qt.is_active = true
      LIMIT 1
    `, [id]);
    
    const quyTrinhId = quyTrinhResult.rows.length > 0 ? quyTrinhResult.rows[0].id : null;
    
    // Update hoso status
    await client.query(
      'UPDATE ho_so_di_nuoc_ngoai SET trang_thai_hien_tai_id = $1 WHERE id = $2',
      [statusId, id]
    );
    
    // Insert approval record
    if (quyTrinhId) {
      await client.query(`
        INSERT INTO lich_su_phe_duyet (ho_so_id, quy_trinh_id, nguoi_phe_duyet_id, trang_thai_phe_duyet, ngay_phe_duyet)
        VALUES ($1, $2, $3, 'DONG_Y', CURRENT_TIMESTAMP)
      `, [id, quyTrinhId, userId]);
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const rejectHoSo = async (id: string, userId: string, reason: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get TU_CHOI status ID
    const statusResult = await client.query(
      "SELECT id FROM dm_trang_thai WHERE ma_trang_thai = 'TU_CHOI' LIMIT 1"
    );
    
    if (statusResult.rows.length === 0) {
      throw new Error('Không tìm thấy trạng thái TU_CHOI');
    }
    
    const statusId = statusResult.rows[0].id;
    
    // Get quy trinh for this hoso (first step)
    const quyTrinhResult = await client.query(`
      SELECT qt.id FROM quy_trinh_phe_duyet qt
      JOIN ho_so_di_nuoc_ngoai h ON h.loai_ho_so_id = qt.loai_ho_so_id
      WHERE h.id = $1 AND qt.thu_tu = 1 AND qt.is_active = true
      LIMIT 1
    `, [id]);
    
    const quyTrinhId = quyTrinhResult.rows.length > 0 ? quyTrinhResult.rows[0].id : null;
    
    // Update hoso status
    await client.query(
      'UPDATE ho_so_di_nuoc_ngoai SET trang_thai_hien_tai_id = $1 WHERE id = $2',
      [statusId, id]
    );
    
    // Insert approval record with reason
    if (quyTrinhId) {
      await client.query(`
        INSERT INTO lich_su_phe_duyet (ho_so_id, quy_trinh_id, nguoi_phe_duyet_id, trang_thai_phe_duyet, y_kien_phe_duyet, ngay_phe_duyet)
        VALUES ($1, $2, $3, 'TU_CHOI', $4, CURRENT_TIMESTAMP)
      `, [id, quyTrinhId, userId, reason]);
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Reports
export const getReports = async (timeRange: string = 'month') => {
  const client = await pool.connect();
  try {
    let dateFilter = '';
    switch (timeRange) {
      case 'week':
        dateFilter = "AND h.ngay_tao >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'quarter':
        dateFilter = "AND h.ngay_tao >= CURRENT_DATE - INTERVAL '3 months'";
        break;
      case 'year':
        dateFilter = "AND h.ngay_tao >= CURRENT_DATE - INTERVAL '1 year'";
        break;
      default: // month
        dateFilter = "AND h.ngay_tao >= CURRENT_DATE - INTERVAL '1 month'";
    }

    // Total stats
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE tt.ma_trang_thai = 'DA_DUYET') as approved,
        COUNT(*) FILTER (WHERE tt.ma_trang_thai = 'CHO_DUYET') as pending,
        COUNT(*) FILTER (WHERE tt.ma_trang_thai = 'TU_CHOI') as rejected
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      WHERE 1=1 ${dateFilter}
    `);

    // By country
    const countryResult = await client.query(`
      SELECT 
        qg.ten_quoc_gia as country,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN dm_quoc_gia qg ON h.quoc_gia_den_id = qg.id
      WHERE 1=1 ${dateFilter}
      GROUP BY qg.ten_quoc_gia
      ORDER BY count DESC
      LIMIT 5
    `);

    // By department
    const deptResult = await client.query(`
      SELECT 
        dv.ten_don_vi as dept,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
      LEFT JOIN dm_don_vi dv ON n.don_vi_id = dv.id
      WHERE 1=1 ${dateFilter}
      GROUP BY dv.ten_don_vi
      ORDER BY count DESC
      LIMIT 5
    `);

    // By type
    const typeResult = await client.query(`
      SELECT 
        lhs.ten_loai_ho_so as type,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN dm_loai_ho_so lhs ON h.loai_ho_so_id = lhs.id
      WHERE 1=1 ${dateFilter}
      GROUP BY lhs.ten_loai_ho_so
      ORDER BY count DESC
    `);

    const total = parseInt(statsResult.rows[0].total);
    const byType = typeResult.rows.map(row => ({
      type: row.type,
      count: parseInt(row.count),
      percent: total > 0 ? Math.round((parseInt(row.count) / total) * 100) : 0
    }));

    return {
      totalApplications: total,
      approved: parseInt(statsResult.rows[0].approved),
      pending: parseInt(statsResult.rows[0].pending),
      rejected: parseInt(statsResult.rows[0].rejected),
      byCountry: countryResult.rows,
      byDepartment: deptResult.rows,
      byType
    };
  } finally {
    client.release();
  }
};

// Audit Logs
export const getAuditLogs = async (page: number, limit: number, type?: string) => {
  const client = await pool.connect();
  try {
    const offset = (page - 1) * limit;
    let typeFilter = '';
    const params: any[] = [limit, offset];
    
    if (type && type !== 'all') {
      typeFilter = 'WHERE loai = $3';
      params.push(type);
    }

    const result = await client.query(`
      SELECT 
        ma_nhat_ky as id,
        nguoi_thuc_hien as "nguoiThucHien",
        hanh_dong as "hanhDong",
        doi_tuong as "doiTuong",
        mo_ta as "moTa",
        thoi_gian as "thoiGian",
        ip_address as "ipAddress",
        COALESCE(loai, 'info') as loai
      FROM nhatkyhethong
      ${typeFilter}
      ORDER BY thoi_gian DESC
      LIMIT $1 OFFSET $2
    `, params);

    const countResult = await client.query(
      `SELECT COUNT(*) as total FROM nhatkyhethong ${typeFilter}`,
      type && type !== 'all' ? [type] : []
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      logs: result.rows,
      totalPages,
      currentPage: page,
      total
    };
  } finally {
    client.release();
  }
};

// Helper functions
function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'draft': 'Nháp',
    'pending': 'Chờ duyệt',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối'
  };
  return statusMap[status] || status;
}

function getStatusColor(status: string): string {
  const colorMap: { [key: string]: string } = {
    'draft': '#9E9E9E',
    'pending': '#FF9800',
    'approved': '#4CAF50',
    'rejected': '#F44336'
  };
  return colorMap[status] || '#9E9E9E';
}

// Additional CRUD operations

// Hồ sơ CRUD
export const getHoSoById = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        h.*,
        n.ho_ten as nguoi_dung_ho_ten,
        dv.ten_don_vi,
        lhs.ten_loai_ho_so,
        qg.ten_quoc_gia,
        tt.ten_trang_thai
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
      LEFT JOIN dm_don_vi dv ON n.don_vi_id = dv.id
      LEFT JOIN dm_loai_ho_so lhs ON h.loai_ho_so_id = lhs.id
      LEFT JOIN dm_quoc_gia qg ON h.quoc_gia_den_id = qg.id
      LEFT JOIN dm_trang_thai tt ON h.trang_thai_hien_tai_id = tt.id
      WHERE h.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy hồ sơ');
    }
    
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const createHoSo = async (hoSoData: any) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get default status ID (CHO_DUYET)
    const statusResult = await client.query(
      "SELECT id FROM dm_trang_thai WHERE ma_trang_thai = 'CHO_DUYET' LIMIT 1"
    );
    const statusId = statusResult.rows[0]?.id;
    
    const result = await client.query(`
      INSERT INTO ho_so_di_nuoc_ngoai (
        ma_ho_so, nguoi_dung_id, loai_ho_so_id, quoc_gia_den_id,
        muc_dich_chuyen_di, dia_chi_luu_tru, thoi_gian_du_kien_di,
        thoi_gian_du_kien_ve, nguon_kinh_phi, trang_thai_hien_tai_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      hoSoData.ma_ho_so || `HS${Date.now()}`,
      hoSoData.nguoi_dung_id,
      hoSoData.loai_ho_so_id,
      hoSoData.quoc_gia_den_id,
      hoSoData.muc_dich_chuyen_di,
      hoSoData.dia_chi_luu_tru,
      hoSoData.thoi_gian_du_kien_di,
      hoSoData.thoi_gian_du_kien_ve,
      hoSoData.nguon_kinh_phi,
      statusId
    ]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateHoSo = async (id: string, hoSoData: any) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE ho_so_di_nuoc_ngoai 
      SET 
        loai_ho_so_id = COALESCE($1, loai_ho_so_id),
        quoc_gia_den_id = COALESCE($2, quoc_gia_den_id),
        muc_dich_chuyen_di = COALESCE($3, muc_dich_chuyen_di),
        dia_chi_luu_tru = COALESCE($4, dia_chi_luu_tru),
        thoi_gian_du_kien_di = COALESCE($5, thoi_gian_du_kien_di),
        thoi_gian_du_kien_ve = COALESCE($6, thoi_gian_du_kien_ve),
        nguon_kinh_phi = COALESCE($7, nguon_kinh_phi)
      WHERE id = $8
    `, [
      hoSoData.loai_ho_so_id,
      hoSoData.quoc_gia_den_id,
      hoSoData.muc_dich_chuyen_di,
      hoSoData.dia_chi_luu_tru,
      hoSoData.thoi_gian_du_kien_di,
      hoSoData.thoi_gian_du_kien_ve,
      hoSoData.nguon_kinh_phi,
      id
    ]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy hồ sơ');
    }
  } finally {
    client.release();
  }
};

// User CRUD
export const getUserById = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        nd.*,
        dv.ten_don_vi,
        vt.ten_vai_tro,
        vt.ma_vai_tro
      FROM nguoi_dung nd
      LEFT JOIN dm_don_vi dv ON nd.don_vi_id = dv.id
      LEFT JOIN phan_quyen pq ON nd.id = pq.nguoi_dung_id
      LEFT JOIN dm_vai_tro vt ON pq.vai_tro_id = vt.id
      WHERE nd.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const createUser = async (userData: any) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Import bcrypt for password hashing
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(userData.password || 'password123', 10);
    
    // Insert user
    const userResult = await client.query(`
      INSERT INTO nguoi_dung (
        username, mat_khau, ho_ten, email, so_dien_thoai,
        don_vi_id, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      userData.username,
      hashedPassword,
      userData.ho_ten,
      userData.email,
      userData.so_dien_thoai,
      userData.don_vi_id,
      true
    ]);
    
    const userId = userResult.rows[0].id;
    
    // Assign default role (VT_VIEN_CHUC)
    const roleResult = await client.query(
      "SELECT id FROM dm_vai_tro WHERE ma_vai_tro = $1 LIMIT 1",
      [userData.ma_vai_tro || 'VT_VIEN_CHUC']
    );
    
    if (roleResult.rows.length > 0) {
      await client.query(
        'INSERT INTO phan_quyen (nguoi_dung_id, vai_tro_id) VALUES ($1, $2)',
        [userId, roleResult.rows[0].id]
      );
    }
    
    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateUser = async (id: string, userData: any) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Update user info
    const result = await client.query(`
      UPDATE nguoi_dung 
      SET 
        ho_ten = COALESCE($1, ho_ten),
        email = COALESCE($2, email),
        so_dien_thoai = COALESCE($3, so_dien_thoai),
        don_vi_id = COALESCE($4, don_vi_id)
      WHERE id = $5
    `, [
      userData.ho_ten,
      userData.email,
      userData.so_dien_thoai,
      userData.don_vi_id,
      id
    ]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    // Update role if provided
    if (userData.ma_vai_tro) {
      const roleResult = await client.query(
        "SELECT id FROM dm_vai_tro WHERE ma_vai_tro = $1 LIMIT 1",
        [userData.ma_vai_tro]
      );
      
      if (roleResult.rows.length > 0) {
        await client.query(
          'UPDATE phan_quyen SET vai_tro_id = $1 WHERE nguoi_dung_id = $2',
          [roleResult.rows[0].id, id]
        );
      }
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Đơn vị CRUD
export const getDonViById = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        dv.*,
        nd.ho_ten as truong_don_vi_ho_ten,
        (SELECT COUNT(*) FROM nguoi_dung WHERE don_vi_id = dv.id) as so_nguoi
      FROM dm_don_vi dv
      LEFT JOIN nguoi_dung nd ON dv.truong_don_vi_id = nd.id
      WHERE dv.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Không tìm thấy đơn vị');
    }
    
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const createDonVi = async (donViData: any) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO dm_don_vi (
        ma_don_vi, ten_don_vi, loai_don_vi, truong_don_vi_id,
        email, so_dien_thoai, dia_chi, ghi_chu
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      donViData.ma_don_vi || `DV${Date.now()}`,
      donViData.ten_don_vi,
      donViData.loai_don_vi,
      donViData.truong_don_vi_id,
      donViData.email,
      donViData.so_dien_thoai,
      donViData.dia_chi,
      donViData.ghi_chu
    ]);
    
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const updateDonVi = async (id: string, donViData: any) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE dm_don_vi 
      SET 
        ten_don_vi = COALESCE($1, ten_don_vi),
        loai_don_vi = COALESCE($2, loai_don_vi),
        truong_don_vi_id = COALESCE($3, truong_don_vi_id),
        email = COALESCE($4, email),
        so_dien_thoai = COALESCE($5, so_dien_thoai),
        dia_chi = COALESCE($6, dia_chi),
        ghi_chu = COALESCE($7, ghi_chu)
      WHERE id = $8
    `, [
      donViData.ten_don_vi,
      donViData.loai_don_vi,
      donViData.truong_don_vi_id,
      donViData.email,
      donViData.so_dien_thoai,
      donViData.dia_chi,
      donViData.ghi_chu,
      id
    ]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy đơn vị');
    }
  } finally {
    client.release();
  }
};

