# Backend API Documentation
## Hệ thống Quản lý Hồ sơ Đi Nước Ngoài - Trường Đại học Trà Vinh

### 🚀 Khởi chạy Backend

```bash
# 1. Cài đặt dependencies
cd backend
npm install

# 2. Tạo file .env (đã có sẵn)
# Kiểm tra và cập nhật thông tin database nếu cần

# 3. Tạo test users trong database
npm run create-test-users

# 4. Chạy development server
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 📋 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### 1. Đăng nhập
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "demo@tvu.edu.vn",
  "password": "tvu123456"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "ma_nguoi_dung": 1,
      "email": "demo@tvu.edu.vn",
      "ho_ten": "Nguyễn Văn Demo",
      "ma_vai_tro": "VT_VIEN_CHUC",
      "ten_vai_tro": "Viên chức",
      "ma_don_vi": 1,
      "ten_don_vi": "Khoa Công nghệ Thông tin",
      "trang_thai": "ACTIVE"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

**Validation Errors:**
- Email không hợp lệ
- Email phải có định dạng @tvu.edu.vn
- Mật khẩu phải có ít nhất 6 ký tự
- Tài khoản đã bị khóa

**Rate Limiting:** 5 attempts / 15 minutes

---

#### 2. Lấy thông tin profile
```http
GET /api/v1/auth/profile
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin thành công",
  "data": {
    "ma_nguoi_dung": 1,
    "email": "demo@tvu.edu.vn",
    "ho_ten": "Nguyễn Văn Demo",
    "ma_vai_tro": "VT_VIEN_CHUC",
    "ten_vai_tro": "Viên chức",
    "ma_don_vi": 1,
    "ten_don_vi": "Khoa Công nghệ Thông tin",
    "trang_thai": "ACTIVE"
  }
}
```

---

#### 3. Đổi mật khẩu
```http
POST /api/v1/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "tvu123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Mật khẩu cũ không đúng"
}
```

---

#### 4. Quên mật khẩu
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "demo@tvu.edu.vn"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn"
}
```

---

#### 5. Đăng xuất
```http
POST /api/v1/auth/logout
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-26T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

---

## 🔒 Security Features

### 1. Email Validation
- Chỉ chấp nhận email có đuôi `@tvu.edu.vn`
- Validation ở cả backend và frontend

### 2. Password Security
- Mật khẩu được hash bằng bcrypt (10 salt rounds)
- Minimum length: 6 characters
- So sánh mật khẩu an toàn với bcrypt.compare()

### 3. JWT Authentication
- Access token: expires in 7 days
- Refresh token: expires in 30 days
- Token payload includes: ma_nguoi_dung, email, ma_vai_tro

### 4. Rate Limiting
- Login endpoint: 5 attempts per 15 minutes
- Prevents brute force attacks

### 5. CORS
- Configured for frontend origin: `http://localhost:5173`
- Credentials enabled

### 6. Helmet
- Security headers configured
- XSS protection, content type sniffing prevention, etc.

---

## 🧪 Test Users

Sau khi chạy `npm run create-test-users`, các tài khoản sau sẽ được tạo:

| Email | Password | Vai trò | Mô tả |
|-------|----------|---------|-------|
| demo@tvu.edu.vn | tvu123456 | VT_VIEN_CHUC | Viên chức thường |
| truongdonvi@tvu.edu.vn | tvu123456 | VT_TRUONG_DON_VI | Trưởng đơn vị |
| tchc@tvu.edu.vn | tvu123456 | VT_TCHC | Phòng TCHC |
| admin@tvu.edu.vn | tvu123456 | VT_ADMIN | Quản trị viên |

---

## 📝 Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid credentials or token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

---

## 🔧 Environment Variables

```env
# Server
PORT=5000
API_PREFIX=/api/v1
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qlhs_dinuocngoai
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=tvu_qlhs_secret_key_2024_secure_random_string
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=tvu_qlhs_refresh_secret_key_2024_secure_random_string
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## 📦 Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation
- **express-validator**: Request validation
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **morgan**: HTTP logging
- **compression**: Response compression

---

## 🚨 Notes

1. **Production Security:**
   - Change JWT secrets to strong random strings
   - Enable HTTPS
   - Configure proper CORS origins
   - Set secure cookie options
   - Add token blacklist for logout

2. **Database:**
   - Ensure PostgreSQL is running
   - Database schema must be deployed (schema_v3_updated.sql)
   - Test users must be created before testing

3. **Email Integration:**
   - Forgot password currently returns success but doesn't send email
   - TODO: Integrate email service (SendGrid, AWS SES, etc.)

---

## 📞 Support

Cần hỗ trợ? Liên hệ:
- Email: tchc@tvu.edu.vn
- Phone: 02943 855 246
