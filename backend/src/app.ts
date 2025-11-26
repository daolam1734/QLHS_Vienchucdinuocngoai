import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import config from './config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// API Routes
app.get(config.apiPrefix, (_req: Request, res: Response) => {
  res.json({
    message: 'Hệ thống quản lý hồ sơ đi nước ngoài - API',
    version: '1.0.0',
    university: 'Trường Đại học Trà Vinh',
  });
});

// Mount API routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/admin`, adminRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: config.env === 'development' ? err.message : 'Internal server error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

export default app;
