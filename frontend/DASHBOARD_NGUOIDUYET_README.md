# Dashboard Người Duyệt - Hệ thống QLHS Di Nước Ngoài

## 📋 Tổng quan

Dashboard mới cho **Người Duyệt** (NguoiDuyet) được xây dựng với thiết kế hiện đại, tập trung vào quy trình phê duyệt hồ sơ hiệu quả.

## ✨ Tính năng chính

### 1. **Sidebar Navigation**
- 6 menu items với icons rõ ràng
- Toggle mở/đóng sidebar
- Active state highlighting
- Responsive trên mobile

### 2. **Welcome Banner**
- Chào mừng cá nhân hóa
- Hiển thị số hồ sơ chờ duyệt
- Hiệu suất duyệt (%)

### 3. **Statistics Cards**
- ⏳ **Chờ duyệt**: Số hồ sơ đang chờ xem xét
- ✅ **Đã duyệt**: Số hồ sơ đã phê duyệt thành công
- ❌ **Từ chối**: Số hồ sơ bị từ chối
- 📝 **Yêu cầu bổ sung**: Số hồ sơ cần bổ sung thông tin

### 4. **Quick Actions**
- **Xem hồ sơ chờ**: Truy cập nhanh danh sách chờ duyệt
- **Xem báo cáo**: Thống kê hiệu suất
- **Hướng dẫn**: Quy trình và chính sách
- **Bộ lọc nâng cao**: (Coming soon)

### 5. **Hồ sơ cần xem xét**
- Hiển thị 5 hồ sơ gần nhất
- Status dot animation (pending)
- Priority badges (Khẩn cấp, Cao, Bình thường)
- Click để xem chi tiết

### 6. **Notifications Panel**
- Real-time notifications từ stats
- 4 loại: success, warning, error, info
- Action buttons (Xem ngay)

### 7. **Modal Chi tiết & Phê duyệt**
- Thông tin đầy đủ về hồ sơ
- WorkflowTimeline component
- Textarea nhập ý kiến
- 3 actions:
  - ✓ **Phê duyệt**: Chấp thuận hồ sơ
  - ↻ **Yêu cầu bổ sung**: Yêu cầu viên chức cung cấp thêm
  - ✗ **Từ chối**: Từ chối hồ sơ (bắt buộc nhập lý do)

### 8. **Danh sách đầy đủ**
- Hiển thị tất cả hồ sơ chờ duyệt
- Filter theo mức độ ưu tiên
- Thông tin chi tiết: đơn vị, quốc gia, mục đích, thời gian
- Badge đảng viên
- Button "Xem chi tiết"

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563eb`
- **Success Green**: `#059669`
- **Warning Yellow**: `#d97706`
- **Error Red**: `#dc2626`
- **Info Blue**: `#0ea5e9`

### Priority Badges
- **Khẩn cấp**: Red background (#fee2e2)
- **Cao**: Yellow background (#fef3c7)
- **Bình thường**: Blue background (#dbeafe)

### Responsive Breakpoints
- Desktop: > 1024px (full sidebar)
- Tablet: 768px - 1024px (collapsed sidebar)
- Mobile: < 768px (hidden sidebar with toggle)

## 🔧 API Endpoints

### GET `/api/workflow/thong-ke`
Lấy thống kê tổng quan:
```json
{
  "success": true,
  "data": {
    "cho_duyet": 10,
    "da_duyet": 45,
    "tu_choi": 5,
    "yeu_cau_bo_sung": 8,
    "tong_ho_so": 68
  }
}
```

### GET `/api/workflow/cho-duyet`
Lấy danh sách hồ sơ chờ duyệt:
```json
{
  "success": true,
  "data": [
    {
      "ma_ho_so": "HS001",
      "ma_duyet": "MD001",
      "cap_duyet": 1,
      "vai_tro_duyet": "TruongPhong",
      "ten_vien_chuc": "Nguyễn Văn A",
      "email_vien_chuc": "a@example.com",
      "is_dang_vien": true,
      "ten_don_vi": "Phòng KHCN",
      "loai_chuyen_di": "HoiNghi",
      "quoc_gia_den": "Hàn Quốc",
      "muc_dich": "Tham dự hội nghị quốc tế",
      "muc_do_uu_tien": "Cao",
      "trang_thai": "ChoDuyet",
      "thoi_gian_bat_dau": "2025-12-01",
      "thoi_gian_ket_thuc": "2025-12-10",
      "ngay_tao": "2025-11-20"
    }
  ]
}
```

### POST `/api/workflow/approve`
Xử lý phê duyệt hồ sơ:
```json
{
  "ma_duyet": "MD001",
  "trang_thai": "DaDuyet" | "TuChoi" | "YeuCauBoSung",
  "y_kien": "Ý kiến của người duyệt"
}
```

Response:
```json
{
  "success": true,
  "message": "Phê duyệt hồ sơ thành công"
}
```

## 📁 File Structure

```
frontend/src/pages/
├── DashboardNguoiDuyet.tsx      # Main component
├── DashboardNguoiDuyet.css      # Styles
├── ApprovalWorkflowPage_backup.tsx  # Old version backup
```

## 🚀 Usage

### Route Configuration
```tsx
// App.tsx
<Route 
  path="/duyet-ho-so" 
  element={
    <ProtectedRoute>
      <DashboardNguoiDuyet />
    </ProtectedRoute>
  } 
/>
```

### Access
- URL: `/duyet-ho-so`
- Role: `NguoiDuyet`
- Auto-redirect từ HomePage khi user có role NguoiDuyet

## 🔐 Validation Rules

### Phê duyệt
- Ý kiến: Optional

### Từ chối
- Ý kiến: **Required** (bắt buộc nhập lý do)

### Yêu cầu bổ sung
- Ý kiến: **Required** (bắt buộc nhập nội dung cần bổ sung)

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Sidebar full width (260px)
- Dashboard grid: 2 columns (profiles + notifications)
- Modal: max-width 1100px

### Tablet (768px - 1024px)
- Sidebar collapsed (70px)
- Dashboard grid: 1 column
- Modal: full width

### Mobile (< 768px)
- Sidebar hidden, toggle to show
- Stats: 2 columns → 1 column
- Action buttons: full width
- Modal: full screen

## 🎯 Future Enhancements

1. **Advanced Filters**
   - Filter by date range
   - Filter by department
   - Filter by country

2. **Batch Actions**
   - Select multiple profiles
   - Bulk approve/reject

3. **Real-time Updates**
   - WebSocket notifications
   - Auto-refresh stats

4. **Export & Print**
   - Export to PDF/Excel
   - Print approval reports

5. **Analytics Dashboard**
   - Approval rate charts
   - Response time metrics
   - Department statistics

## 🐛 Known Issues

None at the moment.

## 📞 Support

Contact: Development Team
Email: support@example.com

---

**Version**: 1.0.0  
**Last Updated**: November 30, 2025  
**Author**: Development Team
