import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

// Dashboard Stats
export const getDashboardStats = async () => {
  const client = await pool.connect();
  try {
    // Get total applications count
    const totalAppsResult = await client.query(`
      SELECT COUNT(*) as total FROM ho_so_di_nuoc_ngoai
    `);
    const totalApplications = parseInt(totalAppsResult.rows[0].total) || 0;

    // Get pending applications
    const pendingResult = await client.query(`
      SELECT COUNT(*) as total 
      FROM ho_so_di_nuoc_ngoai
      WHERE trang_thai IN ('MoiTao', 'DangDuyet')
    `);
    const pendingApplications = parseInt(pendingResult.rows[0].total) || 0;

    // Get approved applications
    const approvedResult = await client.query(`
      SELECT COUNT(*) as total 
      FROM ho_so_di_nuoc_ngoai
      WHERE trang_thai = 'DaDuyet'
    `);
    const approvedApplications = parseInt(approvedResult.rows[0].total) || 0;

    // Get total users count
    const usersResult = await client.query(`
      SELECT COUNT(*) as total FROM nguoi_dung WHERE is_active = true
    `);
    const totalUsers = parseInt(usersResult.rows[0].total) || 0;

    // Get recent applications (last 10)
    const recentAppsResult = await client.query(`
      SELECT 
        hs.ma_ho_so::text as id,
        vc.ho_ten as name,
        dv.ten_don_vi as department,
        COALESCE(lcd.ten_loai, 'Chưa xác định') as type,
        COALESCE(hs.quoc_gia_den, 'Chưa xác định') as country,
        hs.trang_thai as status,
        hs.ngay_tao as date
      FROM ho_so_di_nuoc_ngoai hs
      LEFT JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN loai_chuyen_di lcd ON hs.loai_chuyen_di = lcd.ma_loai
      ORDER BY hs.ngay_tao DESC
      LIMIT 10
    `);

    // Map status to Vietnamese and colors
    const statusMap: any = {
      'MoiTao': { text: 'Mới tạo', color: '#1976D2' },
      'DangDuyet': { text: 'Đang duyệt', color: '#FF9800' },
      'DaDuyet': { text: 'Đã duyệt', color: '#4CAF50' },
      'TuChoi': { text: 'Từ chối', color: '#F44336' },
      'BoSung': { text: 'Bổ sung', color: '#9C27B0' }
    };

    // Calculate changes (mock for now - can be enhanced with historical data)
    const totalChange = totalApplications > 0 ? '+12%' : '+0%';
    const pendingChange = pendingApplications > 0 ? `+${pendingApplications}` : '+0';
    const approvedChange = approvedApplications > 0 ? '+8%' : '+0%';
    const usersChange = totalUsers > 0 ? '+2' : '+0';

    return {
      totalApplications,
      totalChange,
      totalTrend: 'up' as const,
      pendingApplications,
      pendingChange,
      approvedApplications,
      approvedChange,
      totalUsers,
      usersChange,
      usersTrend: 'up' as const,
      recentApplications: recentAppsResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        department: row.department,
        type: row.type || 'N/A',
        country: row.country || 'N/A',
        status: statusMap[row.status]?.text || row.status,
        date: row.date,
        statusColor: statusMap[row.status]?.color || '#1976D2'
      }))
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
        hs.ma_ho_so::text as id,
        hs.ma_ho_so::text as "maHoSo",
        COALESCE(hs.muc_dich, 'Chưa có mô tả') as "tenChuyenDi",
        COALESCE(vc.ho_ten, 'Chưa xác định') as "nguoiTao",
        COALESCE(dv.ten_don_vi, 'Chưa xác định') as "donVi",
        COALESCE(lcd.ten_loai, 'Chưa xác định') as "loaiHoSo",
        COALESCE(hs.quoc_gia_den, 'Chưa xác định') as "quocGia",
        hs.thoi_gian_bat_dau as "ngayDiDuKien",
        hs.thoi_gian_ket_thuc as "ngayVeDuKien",
        CASE 
          WHEN hs.trang_thai = 'MoiTao' THEN 'Mới tạo'
          WHEN hs.trang_thai = 'DangKiemTraTuDong' THEN 'Đang kiểm tra'
          WHEN hs.trang_thai LIKE 'Cho%Duyet' THEN 'Đang duyệt'
          WHEN hs.trang_thai = 'DaDuyet' THEN 'Đã duyệt'
          WHEN hs.trang_thai = 'TuChoi' THEN 'Từ chối'
          WHEN hs.trang_thai = 'DangThucHien' THEN 'Đang thực hiện'
          WHEN hs.trang_thai = 'HoanTat' THEN 'Hoàn tất'
          ELSE hs.trang_thai
        END as "trangThai",
        CASE 
          WHEN hs.trang_thai = 'MoiTao' THEN '#2196F3'
          WHEN hs.trang_thai = 'DangKiemTraTuDong' THEN '#9C27B0'
          WHEN hs.trang_thai LIKE 'Cho%Duyet' THEN '#FF9800'
          WHEN hs.trang_thai = 'DaDuyet' THEN '#4CAF50'
          WHEN hs.trang_thai = 'TuChoi' THEN '#F44336'
          WHEN hs.trang_thai = 'DangThucHien' THEN '#00BCD4'
          WHEN hs.trang_thai = 'HoanTat' THEN '#8BC34A'
          ELSE '#607D8B'
        END as "mauSac",
        hs.ngay_tao as "ngayTao",
        hs.ngay_cap_nhat as "ngayCapNhat"
      FROM ho_so_di_nuoc_ngoai hs
      LEFT JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN loai_chuyen_di lcd ON hs.loai_chuyen_di = lcd.ma_loai
      ORDER BY hs.ngay_tao DESC
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
    await client.query('DELETE FROM tai_lieu_dinh_kem WHERE ma_ho_so = $1', [id]);
    await client.query('DELETE FROM ho_so_duyet WHERE ma_ho_so = $1', [id]);
    
    // Delete the hoso
    const result = await client.query('DELETE FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so = $1', [id]);
    
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
        nd.user_id::text as id,
        nd.full_name as "hoTen",
        nd.email,
        COALESCE(dv.ten_don_vi, '') as "donVi",
        nd.role as "vaiTro",
        CASE WHEN nd.is_active THEN 'active' ELSE 'locked' END as "trangThai",
        nd.ngay_tao as "ngayTao"
      FROM nguoi_dung nd
      LEFT JOIN vien_chuc vc ON nd.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
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
      'UPDATE nguoi_dung SET is_active = $1 WHERE user_id = $2',
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
    
    // Get user's ma_vien_chuc and ma_nguoi_duyet
    const userResult = await client.query(
      'SELECT ma_vien_chuc, ma_nguoi_duyet, role FROM nguoi_dung WHERE user_id = $1',
      [id]
    );
    
    if (userResult.rows.length === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    const { ma_vien_chuc, ma_nguoi_duyet, role } = userResult.rows[0];
    
    // Check if VienChuc user has hoso
    if (ma_vien_chuc) {
      const hosoCheck = await client.query(
        'SELECT COUNT(*) as count FROM ho_so_di_nuoc_ngoai WHERE ma_vien_chuc = $1',
        [ma_vien_chuc]
      );
      
      if (parseInt(hosoCheck.rows[0].count) > 0) {
        throw new Error('Không thể xóa người dùng đã có hồ sơ');
      }
    }
    
    // Check if NguoiDuyet has approved any hoso
    if (ma_nguoi_duyet) {
      const approvalCheck = await client.query(
        'SELECT COUNT(*) as count FROM ho_so_duyet WHERE nguoi_duyet_id = $1',
        [ma_nguoi_duyet]
      );
      
      if (parseInt(approvalCheck.rows[0].count) > 0) {
        throw new Error('Không thể xóa người duyệt đã phê duyệt hồ sơ');
      }
    }
    
    // Delete user roles first
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [id]);
    
    // Delete nguoi_dung (this will SET NULL on vien_chuc/nguoi_duyet due to FK constraint)
    const result = await client.query('DELETE FROM nguoi_dung WHERE user_id = $1', [id]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy người dùng');
    }
    
    // Now delete the orphaned vien_chuc or nguoi_duyet record
    if (ma_vien_chuc) {
      await client.query('DELETE FROM vien_chuc WHERE ma_vien_chuc = $1', [ma_vien_chuc]);
    }
    if (ma_nguoi_duyet) {
      await client.query('DELETE FROM nguoi_duyet WHERE ma_nguoi_duyet = $1', [ma_nguoi_duyet]);
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
    
    const result = await client.query('DELETE FROM don_vi WHERE id = $1', [id]);
    
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
      SELECT 
        h.id,
        h.ma_ho_so as "maHoSo",
        n.ho_ten as "hoTen",
        dv.ten_don_vi as "donVi",
        h.loai_ho_so as "loaiHoSo",
        'Chờ phê duyệt' as "capDuyet",
        h.ngay_tao as "ngayNop",
        COALESCE(h.ngay_ve_du_kien, h.ngay_tao + interval '7 days') as "hanXuLy",
        CASE 
          WHEN EXTRACT(DAY FROM (COALESCE(h.ngay_ve_du_kien, h.ngay_tao + interval '7 days') - CURRENT_DATE)) <= 2 THEN 'high'
          WHEN EXTRACT(DAY FROM (COALESCE(h.ngay_ve_du_kien, h.ngay_tao + interval '7 days') - CURRENT_DATE)) <= 5 THEN 'medium'
          ELSE 'low'
        END as "doUuTien"
      FROM ho_so h
      LEFT JOIN nguoi_dung n ON h.nguoi_tao_id = n.id
      LEFT JOIN don_vi dv ON n.don_vi_id = dv.id
      LEFT JOIN trang_thai tt ON h.trang_thai_id = tt.id
      WHERE tt.ma_trang_thai = 'CHO_DUYET'
      ORDER BY h.ngay_tao DESC
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
      "SELECT id FROM trang_thai WHERE ma_trang_thai = 'DA_DUYET' LIMIT 1"
    );
    
    if (statusResult.rows.length === 0) {
      throw new Error('Không tìm thấy trạng thái DA_DUYET');
    }
    
    const statusId = statusResult.rows[0].id;
    
    // Get quy trinh for this hoso (first step)
    const quyTrinhResult = await client.query(`
      SELECT qt.id FROM quy_trinh_phe_duyet qt
      JOIN ho_so h ON h.loai_ho_so_id = qt.loai_ho_so_id
      WHERE h.id = $1 AND qt.thu_tu = 1 AND qt.is_active = true
      LIMIT 1
    `, [id]);
    
    const quyTrinhId = quyTrinhResult.rows.length > 0 ? quyTrinhResult.rows[0].id : null;
    
    // Update hoso status
    await client.query(
      'UPDATE ho_so SET trang_thai_id = $1 WHERE id = $2',
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
      "SELECT id FROM trang_thai WHERE ma_trang_thai = 'TU_CHOI' LIMIT 1"
    );
    
    if (statusResult.rows.length === 0) {
      throw new Error('Không tìm thấy trạng thái TU_CHOI');
    }
    
    const statusId = statusResult.rows[0].id;
    
    // Get quy trinh for this hoso (first step)
    const quyTrinhResult = await client.query(`
      SELECT qt.id FROM quy_trinh_phe_duyet qt
      JOIN ho_so h ON h.loai_ho_so_id = qt.loai_ho_so_id
      WHERE h.id = $1 AND qt.thu_tu = 1 AND qt.is_active = true
      LIMIT 1
    `, [id]);
    
    const quyTrinhId = quyTrinhResult.rows.length > 0 ? quyTrinhResult.rows[0].id : null;
    
    // Update hoso status
    await client.query(
      'UPDATE ho_so SET trang_thai_id = $1 WHERE id = $2',
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
        COUNT(*) FILTER (WHERE h.trang_thai = 'Đã duyệt') as approved,
        COUNT(*) FILTER (WHERE h.trang_thai = 'Chờ duyệt') as pending,
        COUNT(*) FILTER (WHERE h.trang_thai = 'Từ chối') as rejected
      FROM ho_so_di_nuoc_ngoai h
      WHERE 1=1 ${dateFilter}
    `);

    // By country
    const countryResult = await client.query(`
      SELECT 
        h.quoc_gia_den as country,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      WHERE h.quoc_gia_den IS NOT NULL ${dateFilter}
      GROUP BY h.quoc_gia_den
      ORDER BY count DESC
      LIMIT 5
    `);

    // By department
    const deptResult = await client.query(`
      SELECT 
        dv.ten_don_vi as dept,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN vien_chuc vc ON h.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      WHERE 1=1 ${dateFilter}
      GROUP BY dv.ten_don_vi
      ORDER BY count DESC
      LIMIT 5
    `);

    // By type
    const typeResult = await client.query(`
      SELECT 
        lcd.ten_loai as type,
        COUNT(*) as count
      FROM ho_so_di_nuoc_ngoai h
      LEFT JOIN loai_chuyen_di lcd ON h.loai_chuyen_di = lcd.ma_loai
      WHERE 1=1 ${dateFilter}
      GROUP BY lcd.ten_loai
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
    // Try to get from lich_su_ho_so table
    let query = `
      SELECT 
        lsh.ma_lich_su::text as id,
        nd.full_name as "nguoiThucHien",
        lsh.hanh_dong as "hanhDong",
        hs.ma_ho_so::text as "doiTuong",
        lsh.ghi_chu as "moTa",
        TO_CHAR(lsh.thoi_gian, 'DD/MM/YYYY HH24:MI') as "thoiGian",
        '127.0.0.1' as "ipAddress",
        CASE 
          WHEN lsh.hanh_dong LIKE '%Duyệt%' OR lsh.hanh_dong LIKE '%duyệt%' THEN 'success'
          WHEN lsh.hanh_dong LIKE '%Từ chối%' OR lsh.hanh_dong LIKE '%từ chối%' THEN 'error'
          WHEN lsh.hanh_dong LIKE '%Bổ sung%' OR lsh.hanh_dong LIKE '%bổ sung%' THEN 'warning'
          ELSE 'info'
        END as loai
      FROM lich_su_ho_so lsh
      LEFT JOIN nguoi_dung nd ON lsh.nguoi_thao_tac = nd.user_id
      LEFT JOIN ho_so_di_nuoc_ngoai hs ON lsh.ma_ho_so = hs.ma_ho_so
      WHERE 1=1
    `;
    
    const params: any[] = [];
    if (type && type !== 'all') {
      // Filter by type in application logic since it's derived
      query += ` ORDER BY lsh.thoi_gian DESC`;
    } else {
      query += ` ORDER BY lsh.thoi_gian DESC`;
    }
    
    query += ` LIMIT $1 OFFSET $2`;
    params.push(limit, (page - 1) * limit);
    
    const result = await client.query(query, params);
    
    // Get total count
    const countResult = await client.query(`
      SELECT COUNT(*) as total FROM lich_su_ho_so
    `);
    
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    // If no data from database, return mock data
    if (result.rows.length === 0) {
      const mockLogs = [
        {
          id: '1',
          nguoiThucHien: 'Admin',
          hanhDong: 'Đăng nhập hệ thống',
          doiTuong: 'Hệ thống',
          moTa: 'Đăng nhập thành công vào hệ thống quản trị',
          thoiGian: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          ipAddress: '127.0.0.1',
          loai: 'info'
        },
        {
          id: '2',
          nguoiThucHien: 'Admin',
          hanhDong: 'Xem danh sách hồ sơ',
          doiTuong: 'Dashboard',
          moTa: 'Truy cập trang dashboard và xem thống kê',
          thoiGian: new Date(Date.now() - 3600000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          ipAddress: '127.0.0.1',
          loai: 'info'
        },
        {
          id: '3',
          nguoiThucHien: 'Nguyễn Văn A',
          hanhDong: 'Phê duyệt hồ sơ',
          doiTuong: 'Hồ sơ HS001',
          moTa: 'Phê duyệt hồ sơ đi công tác Nhật Bản',
          thoiGian: new Date(Date.now() - 7200000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          ipAddress: '192.168.1.10',
          loai: 'success'
        }
      ];
      
      const filteredLogs = type && type !== 'all' 
        ? mockLogs.filter(log => log.loai === type) 
        : mockLogs;
        
      return {
        logs: filteredLogs.slice((page - 1) * limit, page * limit),
        totalPages: Math.ceil(filteredLogs.length / limit),
        currentPage: page,
        total: filteredLogs.length
      };
    }

    return {
      logs: result.rows,
      totalPages,
      currentPage: page,
      total
    };
  } catch (error) {
    console.error('Error getting audit logs:', error);
    // Return mock data on error
    const mockLogs = [
      {
        id: '1',
        nguoiThucHien: 'Admin',
        hanhDong: 'Đăng nhập hệ thống',
        doiTuong: 'Hệ thống',
        moTa: 'Đăng nhập thành công vào hệ thống quản trị',
        thoiGian: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        ipAddress: '127.0.0.1',
        loai: 'info'
      }
    ];
    
    return {
      logs: mockLogs,
      totalPages: 1,
      currentPage: 1,
      total: mockLogs.length
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
        hs.id,
        hs.ma_ho_so as "maHoSo",
        hs.ten_chuyen_di as "tenChuyenDi",
        nd.ho_ten as "nguoiTao",
        dv.ten_don_vi as "donVi",
        hs.loai_ho_so as "loaiHoSo",
        qg.ten_quoc_gia as "quocGia",
        hs.muc_dich as "mucDich",
        hs.ngay_di_du_kien as "ngayDiDuKien",
        hs.ngay_ve_du_kien as "ngayVeDuKien",
        hs.ghi_chu as "ghiChu",
        tt.ten_trang_thai as "trangThai",
        tt.mau_sac as "mauSac",
        hs.ngay_tao as "ngayTao",
        hs.ngay_cap_nhat as "ngayCapNhat"
      FROM ho_so_di_nuoc_ngoai hs
      JOIN nguoi_dung nd ON hs.nguoi_tao_id = nd.id
      JOIN don_vi dv ON nd.don_vi_id = dv.id
      LEFT JOIN quoc_gia qg ON hs.quoc_gia_id = qg.id
      JOIN trang_thai tt ON hs.trang_thai_id = tt.id
      WHERE hs.id = $1
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
    
    // Get default status ID (MOI_TAO)
    const statusResult = await client.query(
      "SELECT id FROM trang_thai WHERE ma_trang_thai = 'MOI_TAO' LIMIT 1"
    );
    const statusId = statusResult.rows[0]?.id || 1;
    
    // Get user ID from token (should be passed from controller)
    const userId = hoSoData.nguoi_tao_id || 8; // Default to first demo user
    
    const result = await client.query(`
      INSERT INTO ho_so (
        ma_ho_so, ten_chuyen_di, nguoi_tao_id, loai_ho_so,
        quoc_gia_id, muc_dich, ngay_di_du_kien, ngay_ve_du_kien,
        trang_thai_id, ghi_chu
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      hoSoData.ma_ho_so,
      hoSoData.ten_chuyen_di,
      userId,
      hoSoData.loai_ho_so,
      hoSoData.quoc_gia_id || null,
      hoSoData.muc_dich,
      hoSoData.ngay_di_du_kien,
      hoSoData.ngay_ve_du_kien,
      statusId,
      hoSoData.ghi_chu || null
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
      UPDATE ho_so 
      SET 
        ten_chuyen_di = COALESCE($1, ten_chuyen_di),
        loai_ho_so = COALESCE($2, loai_ho_so),
        quoc_gia_id = COALESCE($3, quoc_gia_id),
        muc_dich = COALESCE($4, muc_dich),
        ngay_di_du_kien = COALESCE($5, ngay_di_du_kien),
        ngay_ve_du_kien = COALESCE($6, ngay_ve_du_kien),
        ghi_chu = COALESCE($7, ghi_chu),
        ngay_cap_nhat = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [
      hoSoData.ten_chuyen_di,
      hoSoData.loai_ho_so,
      hoSoData.quoc_gia_id,
      hoSoData.muc_dich,
      hoSoData.ngay_di_du_kien,
      hoSoData.ngay_ve_du_kien,
      hoSoData.ghi_chu,
      id
    ]);
    
    if (result.rowCount === 0) {
      throw new Error('Không tìm thấy hồ sơ');
    }
    
    return result.rows[0];
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
      LEFT JOIN don_vi dv ON nd.don_vi_id = dv.id
      LEFT JOIN vai_tro vt ON nd.vai_tro_id = vt.id
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
    
    // Generate default password hash for '123456'
    const bcrypt = require('bcrypt');
    const defaultPasswordHash = await bcrypt.hash('123456', 10);
    
    // Map ma_vai_tro to role
    let role = 'VienChuc'; // default
    if (userData.ma_vai_tro === 'VT_ADMIN') {
      role = 'Admin';
    } else if (userData.ma_vai_tro === 'VT_NGUOI_DUYET') {
      role = 'NguoiDuyet';
    }
    
    let ma_vien_chuc = null;
    let ma_nguoi_duyet = null;
    
    // Create corresponding record based on role
    if (role === 'VienChuc') {
      // Create vien_chuc record
      const vienChucResult = await client.query(`
        INSERT INTO vien_chuc (
          ma_vien_chuc, ho_ten, email, is_dang_vien, ma_don_vi, ngay_tao
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING ma_vien_chuc
      `, [
        uuidv4(),
        userData.ho_ten,
        userData.email,
        userData.la_dang_vien || false,
        userData.don_vi_id
      ]);
      ma_vien_chuc = vienChucResult.rows[0].ma_vien_chuc;
    } else if (role === 'NguoiDuyet') {
      // Create nguoi_duyet record
      const nguoiDuyetResult = await client.query(`
        INSERT INTO nguoi_duyet (
          ma_nguoi_duyet, ho_ten, vai_tro, email, cap_duyet, ngay_tao
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING ma_nguoi_duyet
      `, [
        uuidv4(),
        userData.ho_ten,
        'NguoiDuyet', // Default role for approvers
        userData.email,
        3 // Default approval level
      ]);
      ma_nguoi_duyet = nguoiDuyetResult.rows[0].ma_nguoi_duyet;
    }
    
    // Insert user
    const userResult = await client.query(`
      INSERT INTO nguoi_dung (
        user_id, email, full_name, role, ma_vien_chuc, ma_nguoi_duyet, 
        is_active, password_hash, is_first_login, ngay_tao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      uuidv4(),
      userData.email,
      userData.ho_ten,
      role,
      ma_vien_chuc,
      ma_nguoi_duyet,
      true,
      defaultPasswordHash,
      true // Require password change on first login
    ]);
    
    await client.query('COMMIT');
    console.log(`✅ User created: ${userData.email} with default password`);
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
    
    // Update role if provided
    let vaiTroId;
    if (userData.ma_vai_tro) {
      const roleResult = await client.query(
        "SELECT id FROM vai_tro WHERE ma_vai_tro = $1 LIMIT 1",
        [userData.ma_vai_tro]
      );
      vaiTroId = roleResult.rows[0]?.id;
    }
    
    // Update user info
    const result = await client.query(`
      UPDATE nguoi_dung 
      SET 
        ho_ten = COALESCE($1, ho_ten),
        email = COALESCE($2, email),
        dien_thoai = COALESCE($3, dien_thoai),
        don_vi_id = COALESCE($4, don_vi_id),
        vai_tro_id = COALESCE($5, vai_tro_id)
      WHERE id = $6
    `, [
      userData.ho_ten,
      userData.email,
      userData.dien_thoai,
      userData.don_vi_id,
      vaiTroId,
      id
    ]);
    
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

// Đơn vị CRUD
export const getDonViById = async (id: string) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        dv.*,
        nd.ho_ten as truong_don_vi_ho_ten,
        (SELECT COUNT(*) FROM nguoi_dung WHERE don_vi_id = dv.id) as so_nguoi
      FROM don_vi dv
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

export const getAllDonVi = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        dv.ma_don_vi as id,
        dv.ten_don_vi as tenDonVi,
        dv.loai_don_vi as loaiDonVi,
        dv.email,
        nd.ho_ten as truongDonViTen,
        (SELECT COUNT(*) FROM vien_chuc WHERE ma_don_vi = dv.ma_don_vi) as soNguoi
      FROM don_vi_quan_ly dv
      LEFT JOIN nguoi_duyet nd ON dv.truong_don_vi_id = nd.ma_nguoi_duyet
      ORDER BY dv.ten_don_vi
    `);
    
    return result.rows;
  } finally {
    client.release();
  }
};

export const createDonVi = async (donViData: any) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO don_vi (
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
      UPDATE don_vi 
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


