import { Request, Response } from 'express';
import masterDataService from '../services/master-data.service';

export class MasterDataController {
  /**
   * GET /api/master-data/loai-chuyen-di
   */
  async getLoaiChuyenDi(req: Request, res: Response) {
    try {
      const data = await masterDataService.getLoaiChuyenDi();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/master-data/don-vi
   */
  async getDonVi(req: Request, res: Response) {
    try {
      const data = await masterDataService.getDonVi();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/master-data/chi-bo
   */
  async getChiBo(req: Request, res: Response) {
    try {
      const data = await masterDataService.getChiBo();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/master-data/nguoi-duyet
   */
  async getNguoiDuyet(req: Request, res: Response) {
    try {
      const cap_duyet = req.query.cap_duyet ? parseInt(req.query.cap_duyet as string) : undefined;
      const vai_tro = req.query.vai_tro as string;

      const data = await masterDataService.getNguoiDuyet(cap_duyet, vai_tro);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/master-data/roles
   */
  async getRoles(req: Request, res: Response) {
    try {
      const data = await masterDataService.getRoles();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/master-data/vien-chuc/:ma_vien_chuc?
   */
  async getVienChuc(req: Request, res: Response) {
    try {
      const { ma_vien_chuc } = req.params;
      const data = await masterDataService.getVienChuc(ma_vien_chuc);
      
      if (ma_vien_chuc && !data) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy viên chức' });
      }

      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new MasterDataController();
