import pool from '../config/database';

export interface CreateHoSoDTO {
  ma_vien_chuc: string;
  loai_chuyen_di: string;
  quoc_gia_den: string;
  to_chuc_moi: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  muc_dich: string;
  muc_do_uu_tien?: string;
  nguoi_tao: string;
}

export interface UpdateHoSoDTO {
  loai_chuyen_di?: string;
  quoc_gia_den?: string;
  to_chuc_moi?: string;
  thoi_gian_bat_dau?: string;
  thoi_gian_ket_thuc?: string;
  muc_dich?: string;
  muc_do_uu_tien?: string;
}

export class HoSoService {
  /**
   * Tạo hồ sơ mới
   * Trigger tự động sẽ:
   * - Kiểm tra điều kiện tự động
   * - Tạo workflow (có/không qua Chi bộ)
   * - Ghi lịch sử
   */
  async createHoSo(data: CreateHoSoDTO) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO ho_so_di_nuoc_ngoai (
          ma_vien_chuc, loai_chuyen_di,
          quoc_gia_den, to_chuc_moi,
          thoi_gian_bat_dau, thoi_gian_ket_thuc,
          muc_dich, muc_do_uu_tien,
          nguoi_tao
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          data.ma_vien_chuc,
          data.loai_chuyen_di,
          data.quoc_gia_den,
          data.to_chuc_moi,
          data.thoi_gian_bat_dau,
          data.thoi_gian_ket_thuc,
          data.muc_dich,
          data.muc_do_uu_tien || 'BinhThuong',
          data.nguoi_tao
        ]
      );

      await client.query('COMMIT');

      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Lấy danh sách hồ sơ
   */
  async getHoSoList(filters?: {
    ma_vien_chuc?: string;
    trang_thai?: string;
    tu_ngay?: string;
    den_ngay?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = `
      SELECT 
        hs.*,
        vc.ho_ten as ten_vien_chuc,
        vc.email as email_vien_chuc,
        vc.is_dang_vien,
        dv.ten_don_vi,
        ld.ten_loai as loai_chuyen_di_text,
        nd.full_name as nguoi_tao_name
      FROM ho_so_di_nuoc_ngoai hs
      JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN loai_chuyen_di ld ON hs.loai_chuyen_di = ld.ma_loai
      LEFT JOIN nguoi_dung nd ON hs.nguoi_tao = nd.user_id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (filters?.ma_vien_chuc) {
      query += ` AND hs.ma_vien_chuc = $${paramCount}`;
      params.push(filters.ma_vien_chuc);
      paramCount++;
    }

    if (filters?.trang_thai) {
      query += ` AND hs.trang_thai = $${paramCount}`;
      params.push(filters.trang_thai);
      paramCount++;
    }

    if (filters?.tu_ngay) {
      query += ` AND hs.ngay_tao >= $${paramCount}`;
      params.push(filters.tu_ngay);
      paramCount++;
    }

    if (filters?.den_ngay) {
      query += ` AND hs.ngay_tao <= $${paramCount}`;
      params.push(filters.den_ngay);
      paramCount++;
    }

    query += ` ORDER BY hs.ngay_tao DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Lấy chi tiết hồ sơ
   */
  async getHoSoById(ma_ho_so: string) {
    const result = await pool.query(
      `SELECT 
        hs.*,
        vc.ho_ten as ten_vien_chuc,
        vc.email as email_vien_chuc,
        vc.is_dang_vien,
        vc.so_cccd,
        dv.ten_don_vi,
        ld.ten_loai as loai_chuyen_di_text,
        nd.full_name as nguoi_tao_name
      FROM ho_so_di_nuoc_ngoai hs
      JOIN vien_chuc vc ON hs.ma_vien_chuc = vc.ma_vien_chuc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN loai_chuyen_di ld ON hs.loai_chuyen_di = ld.ma_loai
      LEFT JOIN nguoi_dung nd ON hs.nguoi_tao = nd.user_id
      WHERE hs.ma_ho_so = $1`,
      [ma_ho_so]
    );

    return result.rows[0] || null;
  }

  /**
   * Cập nhật hồ sơ (chỉ khi trạng thái cho phép)
   */
  async updateHoSo(ma_ho_so: string, data: UpdateHoSoDTO) {
    // Kiểm tra trạng thái
    const hoSo = await this.getHoSoById(ma_ho_so);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    if (!['MoiTao', 'BoSung'].includes(hoSo.trang_thai)) {
      throw new Error('Không thể cập nhật hồ sơ ở trạng thái hiện tại');
    }

    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(data).forEach(key => {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push((data as any)[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return hoSo;
    }

    values.push(ma_ho_so);

    const result = await pool.query(
      `UPDATE ho_so_di_nuoc_ngoai
       SET ${fields.join(', ')}
       WHERE ma_ho_so = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  /**
   * Xóa hồ sơ (chỉ khi ở trạng thái MoiTao)
   */
  async deleteHoSo(ma_ho_so: string) {
    const hoSo = await this.getHoSoById(ma_ho_so);
    if (!hoSo) {
      throw new Error('Không tìm thấy hồ sơ');
    }

    if (hoSo.trang_thai !== 'MoiTao') {
      throw new Error('Chỉ có thể xóa hồ sơ ở trạng thái Mới tạo');
    }

    await pool.query('DELETE FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so = $1', [ma_ho_so]);

    return { success: true, message: 'Đã xóa hồ sơ' };
  }

  /**
   * Lấy thống kê hồ sơ
   */
  async getThongKe(ma_vien_chuc?: string) {
    let query = `
      SELECT 
        COUNT(*) as tong_so,
        COUNT(*) FILTER (WHERE trang_thai = 'MoiTao') as moi_tao,
        COUNT(*) FILTER (WHERE trang_thai LIKE 'Cho%Duyet') as dang_duyet,
        COUNT(*) FILTER (WHERE trang_thai = 'DaDuyet') as da_duyet,
        COUNT(*) FILTER (WHERE trang_thai = 'TuChoi') as tu_choi,
        COUNT(*) FILTER (WHERE trang_thai = 'HoanTat') as hoan_tat
      FROM ho_so_di_nuoc_ngoai
    `;

    const params: any[] = [];

    if (ma_vien_chuc) {
      query += ` WHERE ma_vien_chuc = $1`;
      params.push(ma_vien_chuc);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

export default new HoSoService();
