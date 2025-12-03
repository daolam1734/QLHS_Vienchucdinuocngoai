import { Request, Response } from 'express';
import workflowService from '../services/workflow.service';

export class WorkflowController {
  /**
   * GET /api/workflow/ho-so/:ma_ho_so
   * Lấy workflow của một hồ sơ
   */
  async getWorkflow(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;

      const workflow = await workflowService.getWorkflowByHoSo(ma_ho_so);

      return res.json({
        success: true,
        data: workflow
      });
    } catch (error: any) {
      console.error('Error getting workflow:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin workflow',
        error: error.message
      });
    }
  }

  /**
   * GET /api/workflow/cho-duyet
   * Lấy danh sách hồ sơ chờ duyệt của người duyệt hiện tại
   */
  async getHoSoChoDuyet(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user.ma_nguoi_duyet) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền duyệt hồ sơ'
        });
      }

      const cap_duyet = req.query.cap_duyet ? parseInt(req.query.cap_duyet as string) : undefined;

      const hoSoList = await workflowService.getHoSoChoDuyet(user.ma_nguoi_duyet, cap_duyet);

      return res.json({
        success: true,
        data: hoSoList,
        count: hoSoList.length
      });
    } catch (error: any) {
      console.error('Error getting ho so cho duyet:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách hồ sơ chờ duyệt',
        error: error.message
      });
    }
  }

  /**
   * POST /api/workflow/approve
   * Thực hiện duyệt hồ sơ
   */
  async approveHoSo(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { ma_duyet, trang_thai, y_kien } = req.body;

      if (!user.ma_nguoi_duyet) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền duyệt hồ sơ'
        });
      }

      if (!ma_duyet || !trang_thai) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      if (!['DaDuyet', 'TuChoi', 'YeuCauBoSung'].includes(trang_thai)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ'
        });
      }

      const result = await workflowService.processApproval({
        ma_duyet,
        trang_thai,
        y_kien,
        nguoi_duyet_id: user.ma_nguoi_duyet
      });

      return res.json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error: any) {
      console.error('Error approving ho so:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xử lý duyệt hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * GET /api/workflow/lich-su/:ma_ho_so
   * Lấy lịch sử hồ sơ
   */
  async getLichSu(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;

      const lichSu = await workflowService.getLichSuHoSo(ma_ho_so);

      return res.json({
        success: true,
        data: lichSu
      });
    } catch (error: any) {
      console.error('Error getting lich su:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy lịch sử hồ sơ',
        error: error.message
      });
    }
  }

  /**
   * GET /api/workflow/buoc-hien-tai/:ma_ho_so
   * Lấy bước duyệt hiện tại
   */
  async getBuocHienTai(req: Request, res: Response) {
    try {
      const { ma_ho_so } = req.params;

      const buocHienTai = await workflowService.getBuocDuyetHienTai(ma_ho_so);

      return res.json({
        success: true,
        data: buocHienTai
      });
    } catch (error: any) {
      console.error('Error getting buoc hien tai:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy bước duyệt hiện tại',
        error: error.message
      });
    }
  }

  /**
   * GET /api/workflow/thong-ke
   * Lấy thống kê workflow của người duyệt
   */
  async getThongKe(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user.ma_nguoi_duyet) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem thống kê'
        });
      }

      const thongKe = await workflowService.getThongKeWorkflow(user.ma_nguoi_duyet);

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

export default new WorkflowController();
