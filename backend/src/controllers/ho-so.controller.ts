import { Request, Response } from 'express';
import hoSoService from '../services/ho-so.service';

export class HoSoController {
  /**
   * POST /api/ho-so
   * Tạo hồ sơ mới
   */
  async createHoSo(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user.ma_vien_chuc) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ viên chức mới có thể tạo hồ sơ'
        });
      }

      const data = {
        ...req.body,
        ma_vien_chuc: user.ma_vien_chuc,
        nguoi_tao: user.user_id
      };

      const hoSo = await hoSoService.createHoSo(data);

      return res.status(201).json({
        success: true,
        data: hoSo,
        message: 'Tạo hồ sơ thành công'
      });
    } catch (error: any) {
      console.error('Error creating ho so:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ho-so
   * Lấy danh sách hồ sơ
   */
  async getHoSoList(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const filters: any = {
        trang_thai: req.query.trang_thai as string,
        tu_ngay: req.query.tu_ngay as string,
        den_ngay: req.query.den_ngay as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      // Nếu là viên chức, chỉ xem hồ sơ của mình
      if (user.role === 'VienChuc') {
        filters.ma_vien_chuc = user.ma_vien_chuc;
      }

      const hoSoList = await hoSoService.getHoSoList(filters);

      return res.json({
        success: true,
        data: hoSoList,
        count: hoSoList.length
      });
    } catch (error: any) {
      console.error('Error getting ho so list:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ho-so/:ma_ho_so
   * Lấy chi tiết hồ sơ
   */
  async getHoSoById(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;

      const hoSo = await hoSoService.getHoSoById(ma_ho_so);

      if (!hoSo) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hồ sơ'
        });
      }

      return res.json({
        success: true,
        data: hoSo
      });
    } catch (error: any) {
      console.error('Error getting ho so:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/ho-so/:ma_ho_so
   * Cập nhật hồ sơ
   */
  async updateHoSo(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;
      const user = (req as any).user;

      // Kiểm tra quyền
      const hoSo = await hoSoService.getHoSoById(ma_ho_so);
      if (!hoSo) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hồ sơ'
        });
      }

      if (user.role === 'VienChuc' && hoSo.ma_vien_chuc !== user.ma_vien_chuc) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền sửa hồ sơ này'
        });
      }

      const updatedHoSo = await hoSoService.updateHoSo(ma_ho_so, req.body);

      return res.json({
        success: true,
        data: updatedHoSo,
        message: 'Cập nhật hồ sơ thành công'
      });
    } catch (error: any) {
      console.error('Error updating ho so:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/ho-so/:ma_ho_so
   * Xóa hồ sơ
   */
  async deleteHoSo(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;
      const user = (req as any).user;

      // Kiểm tra quyền
      const hoSo = await hoSoService.getHoSoById(ma_ho_so);
      if (!hoSo) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy hồ sơ'
        });
      }

      if (user.role === 'VienChuc' && hoSo.ma_vien_chuc !== user.ma_vien_chuc) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xóa hồ sơ này'
        });
      }

      const result = await hoSoService.deleteHoSo(ma_ho_so);

      return res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      console.error('Error deleting ho so:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi xóa hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ho-so/thong-ke/overview
   * Lấy thống kê hồ sơ
   */
  async getThongKe(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const ma_vien_chuc = user.role === 'VienChuc' ? user.ma_vien_chuc : undefined;

      const thongKe = await hoSoService.getThongKe(ma_vien_chuc);

      return res.json({
        success: true,
        data: thongKe
      });
    } catch (error: any) {
      console.error('Error getting thong ke:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê',
        error: error.message
      });
    }
  }
}

export default new HoSoController();
