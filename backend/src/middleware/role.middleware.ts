import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    
    // Support both ma_vai_tro and role fields for backward compatibility
    const userRole = user?.ma_vai_tro || user?.role;
    
    console.log('🔒 Role check:', {
      user: user,
      allowedRoles: allowedRoles,
      userRole: userRole
    });
    
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Check role (case-insensitive)
    const hasPermission = allowedRoles.some(role => 
      role.toUpperCase() === userRole?.toUpperCase()
    );

    if (!hasPermission) {
      console.log('❌ Access denied - Role mismatch');
      res.status(403).json({ message: 'Không có quyền truy cập' });
      return;
    }

    console.log('✅ Access granted');
    next();
  };
};
