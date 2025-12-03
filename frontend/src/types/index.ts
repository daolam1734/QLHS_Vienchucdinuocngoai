export interface User {
  userId: string; // UUID from v4 schema
  email: string;
  role: 'Admin' | 'NguoiDuyet' | 'VienChuc'; // v4 role enum
  fullName: string;
  maVienChuc?: string; // UUID, only if VienChuc
  maNguoiDuyet?: string; // UUID, only if NguoiDuyet
  isFirstLogin?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
