import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import config from './config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import ssoAuthRoutes from './routes/sso-auth.routes';
import hoSoRoutes from './routes/ho-so.routes';
import workflowRoutes from './routes/workflow.routes';
import masterDataRoutes from './routes/master-data.routes';
import vienChucRoutes from './routes/vien-chuc.routes';

const app: Application = express();

// Security middleware - Cấu hình chi tiết hơn
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({ 
  origin: config.cors.origin, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
}));

// Logging middleware - Chi tiết hơn trong development
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Trust proxy (nếu deploy sau reverse proxy/load balancer)
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    memory: process.memoryUsage(),
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
app.use(`${config.apiPrefix}/auth`, ssoAuthRoutes);
app.use(`${config.apiPrefix}/admin`, adminRoutes);
app.use(`${config.apiPrefix}/ho-so`, hoSoRoutes);
app.use(`${config.apiPrefix}/workflow`, workflowRoutes);
app.use(`${config.apiPrefix}/master-data`, masterDataRoutes);
app.use(`${config.apiPrefix}/vien-chuc`, vienChucRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: config.env === 'development' ? err.message : 'Internal server error',
    ...(config.env === 'development' && { stack: err.stack }),
  });
});

export default app;
