import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { loginRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith('@tvu.edu.vn')) {
        throw new Error('Email phải có định dạng @tvu.edu.vn');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
];

// Change password validation rules
const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Mật khẩu cũ không được để trống'),
  body('newPassword')
    .notEmpty()
    .withMessage('Mật khẩu mới không được để trống')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('Mật khẩu mới phải khác mật khẩu cũ');
      }
      return true;
    }),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Xác nhận mật khẩu không được để trống')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    }),
];

// Forgot password validation rules
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith('@tvu.edu.vn')) {
        throw new Error('Email phải có định dạng @tvu.edu.vn');
      }
      return true;
    }),
];

// Public routes
router.post(
  '/login',
  loginRateLimiter,
  validate(loginValidation),
  authController.login
);

router.post(
  '/forgot-password',
  validate(forgotPasswordValidation),
  authController.forgotPassword
);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, authController.getProfile);

router.post(
  '/change-password',
  authenticateToken,
  validate(changePasswordValidation),
  authController.changePassword
);

// Logout route - authentication is optional (best effort logging)
router.post('/logout', (req, res, next) => {
  // Try to authenticate but don't fail if token is invalid
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    authenticateToken(req, res, (err) => {
      // Continue even if authentication fails
      next();
    });
  } else {
    next();
  }
}, authController.logout);

export default router;
