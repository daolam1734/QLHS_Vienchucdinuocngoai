import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthRequest, AuthTokenPayload } from '../types';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực',
      });
      return;
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({
            success: false,
            message: 'Token đã hết hạn',
          });
          return;
        }
        res.status(403).json({
          success: false,
          message: 'Token không hợp lệ',
        });
        return;
      }

      req.user = decoded as AuthTokenPayload;
      next();
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Chưa xác thực',
      });
      return;
    }

    if (!roles.includes(req.user.ma_vai_tro)) {
      res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
      return;
    }

    next();
  };
};
