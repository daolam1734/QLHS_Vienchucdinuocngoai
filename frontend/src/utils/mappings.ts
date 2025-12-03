// Mapping các loại hồ sơ (mục đích chuyến đi) sang tiếng Việt
export const LOAI_HO_SO_MAP: Record<string, string> = {
  'HOI_NGHI': 'Hội nghị',
  'CONG_TAC': 'Công tác',
  'DAO_TAO': 'Đào tạo',
  'NGHIEN_CUU': 'Nghiên cứu',
  'THAM_QUAN': 'Tham quan',
  'HOP_TAC': 'Hợp tác quốc tế',
  'HOC_TAP': 'Học tập',
  'GIANG_DAY': 'Giảng dạy',
  'KHAC': 'Khác'
};

// Mapping các loại file (loại tài liệu) sang tiếng Việt
export const LOAI_FILE_MAP: Record<string, string> = {
  'DON_XIN': 'Đơn xin đi công tác',
  'HO_CHIEU': 'Hộ chiếu',
  'THU_MOI': 'Thư mời',
  'CHUONG_TRINH': 'Chương trình hội nghị',
  'QUYET_DINH': 'Quyết định cử đi',
  'BAO_CAO': 'Báo cáo kết quả',
  'GIAY_DE_NGHI': 'Giấy đề nghị',
  'BANG_DU_TOAN': 'Bảng dự toán kinh phí',
  'KHAC': 'Tài liệu khác'
};

// Mapping loại công việc (event type) sang tiếng Việt
export const LOAI_CONG_VIEC_MAP: Record<string, string> = {
  'LOGIN': 'Đăng nhập',
  'TAO_HO_SO': 'Tạo hồ sơ',
  'DUYET_HO_SO': 'Phê duyệt hồ sơ',
  'CAP_NHAT': 'Cập nhật',
  'XOA': 'Xóa',
  'BAO_CAO': 'Báo cáo',
  'UPLOAD_FILE': 'Upload file',
  'LOGOUT': 'Đăng xuất'
};

// Hàm helper để lấy tên tiếng Việt từ mã
export const getLoaiHoSoText = (ma: string): string => {
  return LOAI_HO_SO_MAP[ma] || ma;
};

export const getLoaiFileText = (ma: string): string => {
  return LOAI_FILE_MAP[ma] || ma;
};

export const getLoaiCongViecText = (ma: string): string => {
  return LOAI_CONG_VIEC_MAP[ma] || ma;
};
