# Database Setup Guide - QLHS Đi Nước Ngoài TVU

## 📋 Prerequisites
- PostgreSQL 14+ installed
- pgAdmin hoặc psql command line tool
- User postgres với quyền CREATE DATABASE

## 🚀 Setup Steps

### 1. Create Database
Mở psql hoặc pgAdmin và chạy:
```sql
CREATE DATABASE qlhs_dinuocngoai
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';
```

### 2. Connect to Database
```bash
psql -U postgres -d qlhs_dinuocngoai
```

### 3. Run Schema Script
**Windows:**
```bash
psql -U postgres -d qlhs_dinuocngoai -f init_schema.sql
```

**Trong psql:**
```sql
\i init_schema.sql
```

hoặc

```sql
\i 'D:/DoanChuyenNganh/QLHS-DiNuocNgoai/database/init_schema.sql'
```

## 📊 Database Structure

### Core Tables (Bảng cốt lõi)

#### 1. **DonVi** - Đơn vị/Phòng ban
- Lưu thông tin các khoa, phòng ban
- Fields: MaDonVi (PK), TenDonVi, LoaiDonVi, DiaChi, DienThoai, Email

#### 2. **VienChuc** - Viên chức/Giảng viên
- Thông tin cán bộ, giảng viên
- Fields: MaVienChuc (PK), HoTen, NgaySinh, GioiTinh, MaDonVi (FK), ChucDanh, Email, LaDangVien

#### 3. **ChiBo** - Chi bộ Đảng
- Quản lý chi bộ Đảng
- Fields: MaChiBo (PK), TenChiBo, EmailLienHe, MaDonVi (FK)

#### 4. **DangVien** - Đảng viên
- Thông tin đảng viên
- Fields: MaDangVien (PK), MaVienChuc (FK), MaChiBo (FK), NgayVaoDang

### User Management Tables

#### 5. **NguoiDung** - User accounts
- Tài khoản đăng nhập hệ thống
- Fields: MaUser (PK), TenDangNhap, MatKhauHash, HoTen, Email, TrangThai

#### 6. **VaiTro** - Roles
- Vai trò: Admin, Trưởng phòng, Viên chức, v.v.
- Fields: MaVaiTro (PK), TenVaiTro, MoTa

#### 7. **UserRole** - User-Role mapping
- Gán vai trò cho người dùng
- Fields: ID (PK), MaUser (FK), MaVaiTro (FK)

#### 8. **PhanQuyenChucNang** - Permissions
- Phân quyền chức năng theo vai trò
- Fields: ID (PK), MaVaiTro (FK), ChucNang, ChoPhep

### Application Tables

#### 9. **HoSo** - Hồ sơ đi nước ngoài
- Hồ sơ xin đi công tác/học tập nước ngoài
- Fields: MaHoSo (PK), MaVienChuc (FK), LoaiHoSo, NgayDuKienDi, NuocDen, TrangThaiHoSo

#### 10. **TaiLieu** - Documents
- Tài liệu đính kèm hồ sơ
- Fields: MaTaiLieu (PK), MaHoSo (FK), LoaiTaiLieu, TenFile, DuongDanFile

#### 11. **PheDuyet** - Approval workflow
- Quy trình phê duyệt hồ sơ
- Fields: MaPheDuyet (PK), MaHoSo (FK), CapPheDuyet, MaNguoiDuyet (FK), KetQua

#### 12. **BaoCao** - Reports
- Báo cáo sau khi đi nước ngoài
- Fields: MaBaoCao (PK), MaHoSo (FK), NgayNop, NoiDung, FileBaoCao

#### 13. **AuditLog** - Audit trail
- Nhật ký hoạt động hệ thống
- Fields: AuditID (PK), MaUser (FK), ThaoTac, MaHoSo (FK), ThoiGian, IPNguoiDung

## 🔐 Default Credentials

**Tài khoản Admin mặc định:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@tvu.edu.vn`
- Vai trò: Admin

**⚠️ QUAN TRỌNG: Đổi mật khẩu ngay sau khi đăng nhập lần đầu!**

## 🔗 Connection String

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qlhs_dinuocngoai
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Connection String Format
```
postgresql://postgres:password@localhost:5432/qlhs_dinuocngoai
```

## 📝 Sample Data

Schema đã tạo sẵn dữ liệu mẫu:
- ✅ 4 Đơn vị (Phòng TCHC, Khoa CNTT, Khoa Kinh tế, Phòng KHCN)
- ✅ 5 Vai trò (Admin, Trưởng phòng, BGH, Viên chức, Trưởng khoa)
- ✅ 1 User admin
- ✅ Phân quyền cơ bản

## 🔍 Verify Installation

Kiểm tra database đã tạo thành công:

```sql
-- Xem danh sách bảng
\dt

-- Đếm số bảng
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';

-- Xem dữ liệu mẫu
SELECT * FROM DonVi;
SELECT * FROM VaiTro;
SELECT * FROM NguoiDung;
```

Kết quả mong đợi: 13 tables

## 🛠️ Troubleshooting

### Lỗi encoding
```sql
-- Set encoding UTF-8
SET client_encoding = 'UTF8';
```

### Xóa và tạo lại database
```sql
DROP DATABASE IF EXISTS qlhs_dinuocngoai;
CREATE DATABASE qlhs_dinuocngoai;
```

### Reset toàn bộ tables
```sql
\c qlhs_dinuocngoai
\i init_schema.sql
```

## 📚 ERD Diagram

Xem file `tvu-usecase-diagram.mermaid` hoặc PlantUML ERD để hiểu rõ quan hệ giữa các bảng.

## 🔄 Migration & Backup

### Backup
```bash
pg_dump -U postgres qlhs_dinuocngoai > backup.sql
```

### Restore
```bash
psql -U postgres qlhs_dinuocngoai < backup.sql
```
