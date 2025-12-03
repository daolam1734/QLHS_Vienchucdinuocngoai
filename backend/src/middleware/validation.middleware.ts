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
  body('ten_chuyen_di').notEmpty().withMessage('Tên chuyến đi là bắt buộc'),
  body('loai_ho_so').notEmpty().withMessage('Loại hồ sơ là bắt buộc'),
  body('muc_dich').notEmpty().withMessage('Mục đích là bắt buộc'),
  body('ngay_di_du_kien').notEmpty().withMessage('Ngày đi dự kiến là bắt buộc')
    .isISO8601().withMessage('Ngày đi dự kiến không hợp lệ'),
  body('ngay_ve_du_kien').notEmpty().withMessage('Ngày về dự kiến là bắt buộc')
    .isISO8601().withMessage('Ngày về dự kiến không hợp lệ'),
  body('quoc_gia_id').optional().isInt(),
  body('ghi_chu').optional(),
];

export const validateHoSoUpdate = [
  body('ten_chuyen_di').optional().notEmpty(),
  body('loai_ho_so').optional().notEmpty(),
  body('muc_dich').optional().notEmpty(),
  body('quoc_gia_id').optional().isInt(),
  body('ngay_di_du_kien').optional().isISO8601(),
  body('ngay_ve_du_kien').optional().isISO8601(),
  body('ghi_chu').optional(),
];

// Validation rules for User
export const validateUser = [
  body('ho_ten').notEmpty().withMessage('Họ tên là bắt buộc'),
  body('email').notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ'),
  body('ma_vai_tro').notEmpty().withMessage('Vai trò là bắt buộc')
    .isIn(['VT_VIEN_CHUC', 'VT_NGUOI_DUYET', 'VT_ADMIN']).withMessage('Vai trò không hợp lệ'),
  body('dien_thoai').optional().isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('don_vi_id').if(body('ma_vai_tro').equals('VT_VIEN_CHUC')).notEmpty().withMessage('Đơn vị là bắt buộc cho Viên chức'),
  body('la_dang_vien').optional().isBoolean().withMessage('Đảng viên phải là true/false'),
];

export const validateUserUpdate = [
  body('ho_ten').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('dien_thoai').optional().isMobilePhone('vi-VN'),
  body('don_vi_id').optional().isInt(),
  body('ma_vai_tro').optional().notEmpty(),
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

