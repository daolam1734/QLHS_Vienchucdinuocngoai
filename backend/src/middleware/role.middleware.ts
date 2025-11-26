import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(user.ma_vai_tro)) {
      res.status(403).json({ message: 'Không có quyền truy cập' });
      return;
    }

    next();
  };
};
