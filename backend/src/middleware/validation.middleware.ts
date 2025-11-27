import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    const extractedErrors = errors.array().map((err: any) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: extractedErrors,
    });
  };
};

// Validation rules for Hồ sơ
export const validateHoSo = [
  body('loai_ho_so_id').notEmpty().withMessage('Loại hồ sơ là bắt buộc'),
  body('quoc_gia_den_id').notEmpty().withMessage('Quốc gia đến là bắt buộc'),
  body('muc_dich_chuyen_di').notEmpty().withMessage('Mục đích chuyến đi là bắt buộc'),
  body('dia_chi_luu_tru').notEmpty().withMessage('Địa chỉ lưu trú là bắt buộc'),
  body('thoi_gian_du_kien_di').isISO8601().withMessage('Thời gian dự kiến đi không hợp lệ'),
  body('thoi_gian_du_kien_ve').isISO8601().withMessage('Thời gian dự kiến về không hợp lệ'),
  body('nguon_kinh_phi').notEmpty().withMessage('Nguồn kinh phí là bắt buộc'),
];

export const validateHoSoUpdate = [
  body('loai_ho_so_id').optional().isInt(),
  body('quoc_gia_den_id').optional().isInt(),
  body('thoi_gian_du_kien_di').optional().isISO8601(),
  body('thoi_gian_du_kien_ve').optional().isISO8601(),
];

// Validation rules for User
export const validateUser = [
  body('username').notEmpty().withMessage('Tên đăng nhập là bắt buộc')
    .isLength({ min: 3 }).withMessage('Tên đăng nhập tối thiểu 3 ký tự'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  body('ho_ten').notEmpty().withMessage('Họ tên là bắt buộc'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('so_dien_thoai').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('don_vi_id').notEmpty().withMessage('Đơn vị là bắt buộc'),
];

export const validateUserUpdate = [
  body('ho_ten').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('so_dien_thoai').optional().isMobilePhone('vi-VN'),
  body('don_vi_id').optional().isInt(),
];

export const validateUserStatus = [
  body('trangThai').isIn(['active', 'locked']).withMessage('Trạng thái không hợp lệ'),
];

// Validation rules for Đơn vị
export const validateDonVi = [
  body('ten_don_vi').notEmpty().withMessage('Tên đơn vị là bắt buộc'),
  body('loai_don_vi').notEmpty().withMessage('Loại đơn vị là bắt buộc'),
  body('email').optional().isEmail().withMessage('Email không hợp lệ'),
  body('so_dien_thoai').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
];

export const validateDonViUpdate = [
  body('ten_don_vi').optional().notEmpty(),
  body('loai_don_vi').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('so_dien_thoai').optional().isMobilePhone('vi-VN'),
];

