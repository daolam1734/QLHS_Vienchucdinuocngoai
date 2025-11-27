# Backend Configuration Guide

## 📋 Tổng quan cấu hình

Backend đã được tối ưu hóa với các cải tiến:

### 🔧 Database Configuration (`config/database.ts`)

**Connection Pool Settings:**
- `max: 30` - Tối đa 30 kết nối đồng thời
- `min: 5` - Giữ sẵn 5 kết nối tối thiểu
- `idleTimeoutMillis: 30000` - Timeout kết nối idle (30s)
- `connectionTimeoutMillis: 5000` - Timeout khi tạo kết nối (5s)
- `statement_timeout: 30000` - Timeout cho mỗi query (30s)
- `query_timeout: 30000` - Timeout tổng thể cho query (30s)

**Features:**
- ✅ Tự động set UTF-8 encoding
- ✅ Set timezone Asia/Ho_Chi_Minh
- ✅ Pool statistics logging (development mode)
- ✅ Graceful error handling (không crash server)

### 🔐 Security Configuration

**Helmet.js - Security Headers:**
```typescript
- Content Security Policy (CSP)
- Cross-Origin policies
- XSS Protection
- MIME type sniffing prevention
```

**CORS Configuration:**
- Origin: `http://localhost:5173` (frontend)
- Credentials: enabled
- Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization

**Rate Limiting (Ready to implement):**
- Window: 15 phút (900000ms)
- Max requests: 100 requests/window

### 📝 Logging Configuration

**Development Mode:**
- Morgan 'dev' format
- Detailed request logging với timestamp
- Pool statistics mỗi 60s

**Production Mode:**
- Morgan 'combined' format
- Error logging only
- Optimized for performance

### 🎯 Environment Variables

Tạo file `.env` từ `.env.example` và cấu hình:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qlhs_dinuocngoai
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=change_this_in_production_super_secret_key_2024
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=change_this_refresh_secret_key_2024
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Session
SESSION_SECRET=change_this_session_secret_2024
SESSION_MAX_AGE=86400000
```

### 🚀 Performance Optimizations

1. **Connection Pooling:**
   - Min 5 connections luôn sẵn sàng
   - Max 30 connections cho traffic cao
   - Auto-reconnect khi mất kết nối

2. **Compression:**
   - Gzip compression cho responses
   - Giảm bandwidth ~70-80%

3. **Request Parsing:**
   - Limit 10MB cho JSON/form data
   - Prevent large payload attacks

4. **Trust Proxy:**
   - Support reverse proxy (Nginx, Apache)
   - Correct client IP detection

### 📊 Monitoring

**Health Check Endpoint:**
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-27T...",
  "uptime": 12345,
  "environment": "development",
  "memory": {
    "rss": 123456,
    "heapTotal": 67890,
    "heapUsed": 45678,
    "external": 1234
  }
}
```

**Pool Statistics (Development):**
```
📊 Pool Stats: { total: 5, idle: 3, waiting: 0 }
```

### 🛡️ Security Best Practices

1. **JWT Secrets:**
   - Sử dụng secret dài tối thiểu 32 ký tự
   - Khác nhau cho JWT và Refresh Token
   - Không commit vào Git

2. **Database Password:**
   - Mạnh và phức tạp
   - Rotate định kỳ
   - Không hardcode

3. **CORS:**
   - Chỉ cho phép origin tin cậy
   - Production: domain thực tế
   - Development: localhost

4. **Rate Limiting:**
   - Implement cho login endpoints
   - Prevent brute force attacks
   - Adjust theo traffic pattern

### 🔄 Graceful Shutdown

Server handle SIGTERM signal:
```typescript
- Close database connections
- Finish pending requests
- Exit cleanly
```

### 📈 Scaling Considerations

**Horizontal Scaling:**
- Stateless API design
- JWT-based authentication
- Connection pool per instance

**Database:**
- Read replicas cho SELECT queries
- Connection pooling hiệu quả
- Query optimization

**Caching:**
- Redis cho session/cache (future)
- CDN cho static assets
- Query result caching

### 🐛 Debugging

**Development Mode:**
```bash
npm run dev
```
- Auto-reload với nodemon
- Detailed error messages
- Stack traces
- Request/response logging

**Production Mode:**
```bash
npm run build
npm start
```
- Optimized for performance
- Minimal logging
- Error messages only

### 📦 Dependencies

**Core:**
- express: Web framework
- pg: PostgreSQL driver
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing

**Security:**
- helmet: Security headers
- cors: Cross-origin requests
- compression: Response compression

**Dev Tools:**
- typescript: Type safety
- nodemon: Auto-reload
- morgan: Request logging

### 🎓 TVU Specific Configuration

**University Info:**
- Name: Trường Đại học Trà Vinh
- System: Quản lý hồ sơ đi nước ngoài
- Version: 1.0.0

**Timezone:**
- Asia/Ho_Chi_Minh (UTC+7)
- Affects date/time operations
- Database timezone sync

---

## 🔗 Related Files

- `src/config/index.ts` - Main config
- `src/config/database.ts` - Database config
- `src/app.ts` - Express app setup
- `src/server.ts` - Server startup
- `.env.example` - Environment template
