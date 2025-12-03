import pool from '../config/database';

export class MasterDataService {
  /**
   * Lấy danh sách loại chuyến đi
   */
  async getLoaiChuyenDi() {
    const result = await pool.query(
      `SELECT * FROM loai_chuyen_di WHERE is_active = TRUE ORDER BY ten_loai`
    );
    return result.rows;
  }

  /**
   * Lấy danh sách đơn vị
   */
  async getDonVi() {
    const result = await pool.query(
      `SELECT 
        dv.*,
        nd.ho_ten as ten_truong_don_vi
      FROM don_vi_quan_ly dv
      LEFT JOIN nguoi_duyet nd ON dv.truong_don_vi_id = nd.ma_nguoi_duyet
      WHERE dv.is_active = TRUE 
      ORDER BY dv.ten_don_vi`
    );
    return result.rows;
  }

  /**
   * Lấy danh sách Chi bộ
   */
  async getChiBo() {
    const result = await pool.query(
      `SELECT 
        cb.*,
        nd.ho_ten as ten_bi_thu,
        dv.ten_don_vi
      FROM chi_bo cb
      LEFT JOIN nguoi_duyet nd ON cb.bi_thu_id = nd.ma_nguoi_duyet
      LEFT JOIN don_vi_quan_ly dv ON cb.thuoc_don_vi = dv.ma_don_vi
      WHERE cb.is_active = TRUE 
      ORDER BY cb.ten_chi_bo`
    );
    return result.rows;
  }

  /**
   * Lấy danh sách người duyệt theo cấp
   */
  async getNguoiDuyet(cap_duyet?: number, vai_tro?: string) {
    let query = `
      SELECT * FROM nguoi_duyet 
      WHERE is_active = TRUE
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (cap_duyet) {
      query += ` AND cap_duyet = $${paramCount}`;
      params.push(cap_duyet);
      paramCount++;
    }

    if (vai_tro) {
      query += ` AND vai_tro = $${paramCount}`;
      params.push(vai_tro);
      paramCount++;
    }

    query += ` ORDER BY cap_duyet, ho_ten`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Lấy danh sách roles
   */
  async getRoles() {
    const result = await pool.query(
      `SELECT * FROM roles ORDER BY role_name`
    );
    return result.rows;
  }

  /**
   * Lấy thông tin viên chức
   */
  async getVienChuc(ma_vien_chuc?: string) {
    let query = `
      SELECT 
        vc.*,
        dv.ten_don_vi,
        cb.ten_chi_bo
      FROM vien_chuc vc
      LEFT JOIN don_vi_quan_ly dv ON vc.ma_don_vi = dv.ma_don_vi
      LEFT JOIN chi_bo cb ON vc.ma_chi_bo = cb.ma_chi_bo
    `;

    const params: any[] = [];

    if (ma_vien_chuc) {
      query += ` WHERE vc.ma_vien_chuc = $1`;
      params.push(ma_vien_chuc);
    } else {
      query += ` ORDER BY vc.ho_ten`;
    }

    const result = await pool.query(query, params);
    
    return ma_vien_chuc ? result.rows[0] || null : result.rows;
  }
}

export default new MasterDataService();
