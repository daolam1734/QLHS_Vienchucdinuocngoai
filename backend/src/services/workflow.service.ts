import pool from '../config/database';

export interface WorkflowStep {
  cap_duyet: number;
  vai_tro_duyet: string;
  nguoi_duyet_id: string;
  trang_thai: string;
}

export interface ApprovalAction {
  ma_duyet: string;
  trang_thai: 'DaDuyet' | 'TuChoi' | 'YeuCauBoSung';
  y_kien?: string;
  nguoi_duyet_id: string;
}

export class WorkflowService {
  /**
   * Lấy workflow của hồ sơ (danh sách các bước duyệt)
   */
  async getWorkflowByHoSo(ma_ho_so: string): Promise<WorkflowStep[]> {
    const result = await pool.query(
      `SELECT 
        hsd.ma_duyet,
        hsd.cap_duyet,
        hsd.vai_tro_duyet,
        hsd.nguoi_duyet_id,
        hsd.trang_thai,
        hsd.y_kien,
        hsd.ngay_duyet,
        hsd.ngay_tao,
        nd.ho_ten as ten_nguoi_duyet,
        nd.chuc_danh,
        nd.email
      FROM ho_so_duyet hsd
      LEFT JOIN nguoi_duyet nd ON hsd.nguoi_duyet_id = nd.ma_nguoi_duyet
      WHERE hsd.ma_ho_so = $1
      ORDER BY hsd.cap_duyet ASC`,
      [ma_ho_so]
    );

    return result.rows;
  }

  /**
   * Lấy danh sách hồ sơ chờ duyệt của một người duyệt
   */
  async getHoSoChoDuyet(nguoi_duyet_id: string, cap_duyet?: number) {
    let query = `
      SELECT 
        hs.ma_ho_so,
        hs.trang_thai,
        hs.muc_do_uu_tien,
        hs.ngay_tao,
        hs.thoi_gian_bat_dau,
        hs.thoi_gian_ket_thuc,
        hs.quoc_gia_den,
        hs.muc_dich,
        vc.ho_ten as ten_vien_chuc,
        vc.email as email_vien_chuc,
        vc.is_dang_vien,
        dv.ten_don_vi,
        ld.ten_loai as loai_chuyen_di,
        hsd.ma_duyet,
        hsd.cap_duyet,
        hsd.vai_tro_duyet,
        hsd.ngay_tao as ngay_gan_duyet
      FROM ho_so_duyet hsd
      JOIN ho_so_di_nuoc_ngoai hs ON hsd.ma_ho_so = hs.ma_ho_so
      JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN loai_chuyen_di ld ON hs.loai_chuyen_di = ld.ma_loai
      WHERE hsd.nguoi_duyet_id = $1 
        AND hsd.trang_thai = 'ChoDuyet'
    `;

    const params: any[] = [nguoi_duyet_id];

    if (cap_duyet) {
      query += ` AND hsd.cap_duyet = $2`;
      params.push(cap_duyet);
    }

    query += ` ORDER BY 
      CASE hs.muc_do_uu_tien
        WHEN 'KhanCap' THEN 1
        WHEN 'Cao' THEN 2
        WHEN 'BinhThuong' THEN 3
      END,
      hs.ngay_tao ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Thực hiện hành động duyệt (Duyệt/Từ chối/Yêu cầu bổ sung)
   */
  async processApproval(action: ApprovalAction) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Cập nhật trạng thái duyệt
      const updateResult = await client.query(
        `UPDATE ho_so_duyet
         SET trang_thai = $1,
             y_kien = $2,
             ngay_duyet = CURRENT_TIMESTAMP
         WHERE ma_duyet = $3
         RETURNING ma_ho_so, cap_duyet, vai_tro_duyet`,
        [action.trang_thai, action.y_kien, action.ma_duyet]
      );

      if (updateResult.rows.length === 0) {
        throw new Error('Không tìm thấy bước duyệt');
      }

      const { ma_ho_so, cap_duyet, vai_tro_duyet } = updateResult.rows[0];

      // Trigger trong database sẽ tự động xử lý:
      // - Cập nhật trạng thái hồ sơ
      // - Chuyển sang bước tiếp theo
      // - Sinh quyết định (nếu BGH duyệt)
      // - Gửi thông báo

      await client.query('COMMIT');

      return {
        success: true,
        ma_ho_so,
        cap_duyet,
        vai_tro_duyet,
        message: `Đã ${action.trang_thai === 'DaDuyet' ? 'phê duyệt' : action.trang_thai === 'TuChoi' ? 'từ chối' : 'yêu cầu bổ sung'} hồ sơ`
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Lấy lịch sử hồ sơ
   */
  async getLichSuHoSo(ma_ho_so: string) {
    const result = await pool.query(
      `SELECT 
        lsh.*,
        nd.full_name as ten_nguoi_thao_tac
      FROM lich_su_ho_so lsh
      LEFT JOIN nguoi_dung nd ON lsh.nguoi_thao_tac = nd.user_id
      WHERE lsh.ma_ho_so = $1
      ORDER BY lsh.thoi_gian DESC`,
      [ma_ho_so]
    );

    return result.rows;
  }

  /**
   * Kiểm tra quyền duyệt của người dùng
   */
  async kiemTraQuyenDuyet(nguoi_duyet_id: string, ma_ho_so: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM ho_so_duyet
       WHERE ma_ho_so = $1 
         AND nguoi_duyet_id = $2
         AND trang_thai = 'ChoDuyet'`,
      [ma_ho_so, nguoi_duyet_id]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Lấy bước duyệt hiện tại của hồ sơ
   */
  async getBuocDuyetHienTai(ma_ho_so: string) {
    const result = await pool.query(
      `SELECT 
        hsd.*,
        nd.ho_ten,
        nd.chuc_danh,
        nd.email
      FROM ho_so_duyet hsd
      JOIN nguoi_duyet nd ON hsd.nguoi_duyet_id = nd.ma_nguoi_duyet
      WHERE hsd.ma_ho_so = $1 
        AND hsd.trang_thai = 'ChoDuyet'
      ORDER BY hsd.cap_duyet ASC
      LIMIT 1`,
      [ma_ho_so]
    );

    return result.rows[0] || null;
  }

  /**
   * Lấy thống kê workflow
   */
  async getThongKeWorkflow(nguoi_duyet_id: string) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE hsd.trang_thai = 'ChoDuyet') as cho_duyet,
        COUNT(*) FILTER (WHERE hsd.trang_thai = 'DaDuyet') as da_duyet,
        COUNT(*) FILTER (WHERE hsd.trang_thai = 'TuChoi') as tu_choi,
        COUNT(*) FILTER (WHERE hsd.trang_thai = 'YeuCauBoSung') as yeu_cau_bo_sung,
        AVG(EXTRACT(EPOCH FROM (hsd.ngay_duyet - hsd.ngay_tao))/86400.0) FILTER (WHERE hsd.trang_thai = 'DaDuyet') as thoi_gian_duyet_tb
      FROM ho_so_duyet hsd
      WHERE hsd.nguoi_duyet_id = $1`,
      [nguoi_duyet_id]
    );

    return result.rows[0];
  }
}

export default new WorkflowService();
