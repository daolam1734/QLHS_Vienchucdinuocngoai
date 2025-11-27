# Admin API Documentation

## 🔐 Authentication
Tất cả endpoints yêu cầu:
- Header: `Authorization: Bearer <token>`
- Role: `VT_ADMIN`

## 📊 Dashboard

### GET /api/v1/admin/dashboard-stats
Lấy thống kê tổng quan dashboard

**Response:**
```json
{
  "totalApplications": 150,
  "totalChange": "+12%",
  "totalTrend": "up",
  "pendingApplications": 25,
  "pendingChange": "+25",
  "approvedApplications": 100,
  "approvedChange": "+8%",
  "totalUsers": 45,
  "usersChange": "+2%",
  "usersTrend": "up",
  "recentApplications": [...]
}
```

---

## 📄 Hồ Sơ Management

### GET /api/v1/admin/hoso
Lấy danh sách tất cả hồ sơ

**Response:**
```json
[
  {
    "id": 1,
    "maHoSo": "HS001",
    "hoTen": "Nguyễn Văn A",
    "donVi": "Khoa CNTT",
    "loaiHoSo": "Học tập",
    "quocGia": "Nhật Bản",
    "ngayNop": "2025-11-20T00:00:00Z",
    "trangThai": "Chờ duyệt"
  }
]
```

### GET /api/v1/admin/hoso/:id
Lấy chi tiết hồ sơ theo ID

**Response:**
```json
{
  "id": 1,
  "ma_ho_so": "HS001",
  "nguoi_dung_id": 5,
  "loai_ho_so_id": 2,
  "quoc_gia_den_id": 10,
  "muc_dich_chuyen_di": "Học tập",
  "dia_chi_luu_tru": "Tokyo, Japan",
  "thoi_gian_du_kien_di": "2025-12-01",
  "thoi_gian_du_kien_ve": "2026-12-01",
  "nguon_kinh_phi": "Học bổng",
  "nguoi_dung_ho_ten": "Nguyễn Văn A",
  "ten_don_vi": "Khoa CNTT",
  "ten_loai_ho_so": "Học tập",
  "ten_quoc_gia": "Nhật Bản",
  "ten_trang_thai": "Chờ duyệt"
}
```

### POST /api/v1/admin/hoso
Tạo hồ sơ mới

**Request Body:**
```json
{
  "loai_ho_so_id": 2,
  "quoc_gia_den_id": 10,
  "muc_dich_chuyen_di": "Học tập",
  "dia_chi_luu_tru": "Tokyo, Japan",
  "thoi_gian_du_kien_di": "2025-12-01",
  "thoi_gian_du_kien_ve": "2026-12-01",
  "nguon_kinh_phi": "Học bổng"
}
```

**Validation:**
- `loai_ho_so_id`: Required, integer
- `quoc_gia_den_id`: Required, integer
- `muc_dich_chuyen_di`: Required, string
- `dia_chi_luu_tru`: Required, string
- `thoi_gian_du_kien_di`: Required, ISO8601 date
- `thoi_gian_du_kien_ve`: Required, ISO8601 date
- `nguon_kinh_phi`: Required, string

### PUT /api/v1/admin/hoso/:id
Cập nhật hồ sơ

**Request Body:** (tất cả fields optional)
```json
{
  "loai_ho_so_id": 2,
  "quoc_gia_den_id": 10,
  "muc_dich_chuyen_di": "Nghiên cứu",
  "dia_chi_luu_tru": "Osaka, Japan",
  "thoi_gian_du_kien_di": "2025-12-15",
  "thoi_gian_du_kien_ve": "2026-12-15",
  "nguon_kinh_phi": "Tự túc"
}
```

### DELETE /api/v1/admin/hoso/:id
Xóa hồ sơ (cascade delete files và lịch sử phê duyệt)

---

## 👥 User Management

### GET /api/v1/admin/users
Lấy danh sách người dùng

**Response:**
```json
[
  {
    "id": 5,
    "username": "nguyenvana",
    "hoTen": "Nguyễn Văn A",
    "email": "nguyenvana@tvu.edu.vn",
    "donVi": "Khoa CNTT",
    "vaiTro": "Viên chức",
    "trangThai": "active",
    "ngayTao": "2025-11-01T00:00:00Z"
  }
]
```

### GET /api/v1/admin/users/:id
Lấy chi tiết người dùng

### POST /api/v1/admin/users
Tạo người dùng mới

**Request Body:**
```json
{
  "username": "nguyenvanb",
  "password": "password123",
  "ho_ten": "Nguyễn Văn B",
  "email": "nguyenvanb@tvu.edu.vn",
  "so_dien_thoai": "0123456789",
  "don_vi_id": 3,
  "ma_vai_tro": "VT_VIEN_CHUC"
}
```

**Validation:**
- `username`: Required, min 3 chars
- `password`: Required, min 6 chars
- `ho_ten`: Required
- `email`: Required, valid email
- `so_dien_thoai`: Optional, valid Vietnamese phone
- `don_vi_id`: Required, integer
- `ma_vai_tro`: Optional, defaults to VT_VIEN_CHUC

### PUT /api/v1/admin/users/:id
Cập nhật thông tin người dùng

**Request Body:** (tất cả fields optional)
```json
{
  "ho_ten": "Nguyễn Văn B",
  "email": "newmail@tvu.edu.vn",
  "so_dien_thoai": "0987654321",
  "don_vi_id": 5,
  "ma_vai_tro": "VT_TRUONG_DON_VI"
}
```

### PATCH /api/v1/admin/users/:id/status
Cập nhật trạng thái người dùng

**Request Body:**
```json
{
  "trangThai": "active" // hoặc "locked"
}
```

### DELETE /api/v1/admin/users/:id
Xóa người dùng (chỉ được xóa nếu chưa có hồ sơ)

### POST /api/v1/admin/users/:id/reset-password
Gửi email đặt lại mật khẩu

---

## 🏢 Đơn Vị Management

### GET /api/v1/admin/donvi
Lấy danh sách đơn vị

**Response:**
```json
[
  {
    "id": 3,
    "maDonVi": "CNTT",
    "tenDonVi": "Khoa Công nghệ thông tin",
    "loaiDonVi": "Khoa",
    "truongDonVi": "PGS.TS Nguyễn Văn X",
    "soNguoi": 25,
    "email": "cntt@tvu.edu.vn",
    "dienThoai": "0123456789"
  }
]
```

### GET /api/v1/admin/donvi/:id
Lấy chi tiết đơn vị

### POST /api/v1/admin/donvi
Tạo đơn vị mới

**Request Body:**
```json
{
  "ten_don_vi": "Khoa Kinh tế",
  "loai_don_vi": "Khoa",
  "truong_don_vi_id": 10,
  "email": "kinhte@tvu.edu.vn",
  "so_dien_thoai": "0123456789",
  "dia_chi": "Trường ĐH Trà Vinh",
  "ghi_chu": "Khoa mới thành lập"
}
```

**Validation:**
- `ten_don_vi`: Required
- `loai_don_vi`: Required
- `email`: Optional, valid email
- `so_dien_thoai`: Optional, valid Vietnamese phone

### PUT /api/v1/admin/donvi/:id
Cập nhật đơn vị

**Request Body:** (tất cả fields optional)
```json
{
  "ten_don_vi": "Khoa Kinh tế & Quản trị",
  "loai_don_vi": "Khoa",
  "truong_don_vi_id": 12,
  "email": "kinhte@tvu.edu.vn",
  "so_dien_thoai": "0987654321",
  "dia_chi": "ĐH Trà Vinh, Phường 5",
  "ghi_chu": "Đã sáp nhập"
}
```

### DELETE /api/v1/admin/donvi/:id
Xóa đơn vị

---

## ✅ Approval Queue

### GET /api/v1/admin/approval-queue
Lấy danh sách hồ sơ chờ phê duyệt

**Response:**
```json
[
  {
    "id": 1,
    "maHoSo": "HS001",
    "hoTen": "Nguyễn Văn A",
    "donVi": "Khoa CNTT",
    "loaiHoSo": "Học tập",
    "capDuyet": "Trưởng đơn vị",
    "ngayNop": "2025-11-20",
    "hanXuLy": "2025-11-25",
    "doUuTien": "high"
  }
]
```

### POST /api/v1/admin/approval/:id/approve
Phê duyệt hồ sơ

**Auto-captured:**
- User ID từ JWT token

### POST /api/v1/admin/approval/:id/reject
Từ chối hồ sơ

**Request Body:**
```json
{
  "reason": "Thiếu giấy tờ cần thiết"
}
```

---

## 📈 Reports

### GET /api/v1/admin/reports
Lấy báo cáo thống kê

**Query Parameters:**
- `timeRange`: week | month | quarter | year

**Response:**
```json
{
  "totalApplications": 150,
  "approved": 100,
  "pending": 25,
  "rejected": 25,
  "byCountry": [
    { "country": "Nhật Bản", "count": 50 },
    { "country": "Hàn Quốc", "count": 30 }
  ],
  "byDepartment": [
    { "dept": "Khoa CNTT", "count": 40 },
    { "dept": "Khoa Kinh tế", "count": 35 }
  ],
  "byType": [
    { "type": "Học tập", "count": 80, "percent": 53.3 },
    { "type": "Nghiên cứu", "count": 40, "percent": 26.7 }
  ]
}
```

### GET /api/v1/admin/reports/export
Xuất báo cáo Excel

**Query Parameters:**
- `timeRange`: week | month | quarter | year

**Response:** File Excel (blob)

---

## 📜 Audit Logs

### GET /api/v1/admin/audit-logs
Lấy nhật ký hoạt động

**Query Parameters:**
- `page`: Trang hiện tại (default: 1)
- `limit`: Số records/trang (default: 20)
- `type`: Filter theo loại (all | info | success | warning | error)

**Response:**
```json
{
  "logs": [
    {
      "id": "1",
      "nguoiThucHien": "admin",
      "hanhDong": "Đăng nhập hệ thống",
      "doiTuong": "Hệ thống",
      "moTa": "Đăng nhập thành công với vai trò Admin",
      "thoiGian": "2025-11-26 14:30:25",
      "ipAddress": "192.168.1.100",
      "loai": "success"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 100
}
```

---

## 🔒 Security Features

1. **Authentication**: JWT Bearer token
2. **Authorization**: Role-based (VT_ADMIN only)
3. **Validation**: Express-validator middleware
4. **SQL Injection**: Parameterized queries
5. **Rate Limiting**: Ready to implement
6. **CORS**: Configured origin
7. **Helmet**: Security headers

---

## 🚀 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (không đủ quyền)
- `404`: Not Found
- `500`: Internal Server Error

---

## 📝 Error Response Format

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    }
  ]
}
```
