import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export const rateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      next();
      return;
    }

    store[key].count++;

    if (store[key].count > options.max) {
      res.status(429).json({
        success: false,
        message: options.message || 'Quá nhiều yêu cầu, vui lòng thử lại sau',
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
};

// Login specific rate limiter
export const loginRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút',
});
