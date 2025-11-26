import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê dashboard' });
  }
};

// Hồ sơ Management
export const getAllHoSo = async (req: Request, res: Response) => {
  try {
    const hoSoList = await adminService.getAllHoSo();
    res.json(hoSoList);
  } catch (error: any) {
    console.error('Error getting hoso list:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hồ sơ' });
  }
};

export const deleteHoSo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteHoSo(id);
    res.json({ message: 'Xóa hồ sơ thành công' });
  } catch (error: any) {
    console.error('Error deleting hoso:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi xóa hồ sơ' });
  }
};

// User Management
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;
    
    await adminService.updateUserStatus(id, trangThai);
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error: any) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi cập nhật trạng thái' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi xóa người dùng' });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.resetUserPassword(id);
    res.json({ message: 'Đã gửi email đặt lại mật khẩu' });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi đặt lại mật khẩu' });
  }
};

// Đơn vị Management
export const getAllDonVi = async (req: Request, res: Response) => {
  try {
    const donViList = await adminService.getAllDonVi();
    res.json(donViList);
  } catch (error: any) {
    console.error('Error getting donvi list:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn vị' });
  }
};

export const deleteDonVi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteDonVi(id);
    res.json({ message: 'Xóa đơn vị thành công' });
  } catch (error: any) {
    console.error('Error deleting donvi:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi xóa đơn vị' });
  }
};

// Approval Queue
export const getApprovalQueue = async (req: Request, res: Response) => {
  try {
    const queue = await adminService.getApprovalQueue();
    res.json(queue);
  } catch (error: any) {
    console.error('Error getting approval queue:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách phê duyệt' });
  }
};

export const approveHoSo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.ma_nguoi_dung;
    
    await adminService.approveHoSo(id, userId);
    res.json({ message: 'Phê duyệt hồ sơ thành công' });
  } catch (error: any) {
    console.error('Error approving hoso:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi phê duyệt hồ sơ' });
  }
};

export const rejectHoSo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user?.ma_nguoi_dung;
    
    await adminService.rejectHoSo(id, userId, reason);
    res.json({ message: 'Từ chối hồ sơ thành công' });
  } catch (error: any) {
    console.error('Error rejecting hoso:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi từ chối hồ sơ' });
  }
};

// Reports
export const getReports = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query;
    const reports = await adminService.getReports(timeRange as string);
    res.json(reports);
  } catch (error: any) {
    console.error('Error getting reports:', error);
    res.status(500).json({ message: 'Lỗi khi lấy báo cáo' });
  }
};

export const exportReports = async (req: Request, res: Response) => {
  try {
    const { timeRange } = req.query;
    // TODO: Implement Excel export
    res.json({ message: 'Chức năng xuất Excel đang được phát triển' });
  } catch (error: any) {
    console.error('Error exporting reports:', error);
    res.status(500).json({ message: 'Lỗi khi xuất báo cáo' });
  }
};

// Audit Logs
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', type } = req.query;
    const logs = await adminService.getAuditLogs(
      parseInt(page as string),
      parseInt(limit as string),
      type as string
    );
    res.json(logs);
  } catch (error: any) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ message: 'Lỗi khi lấy nhật ký hoạt động' });
  }
};
