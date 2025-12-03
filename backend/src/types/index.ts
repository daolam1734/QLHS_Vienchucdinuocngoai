import { Request } from 'express';

// User related types (Schema v4)
export interface User {
  user_id: string; // UUID in v4
  email: string;
  full_name: string;
  role: 'Admin' | 'NguoiDuyet' | 'VienChuc'; // v4 uses role enum
  ma_vien_chuc?: string; // UUID, only if VienChuc
  ma_nguoi_duyet?: string; // UUID, only if NguoiDuyet
  is_active: boolean;
  ngay_tao: Date;
  last_login?: Date;
}

export interface VienChuc {
  ma_vien_chuc: string; // UUID
  ho_ten: string;
  email: string;
  is_dang_vien: boolean; // Party member status
  ma_don_vi: string; // UUID FK to don_vi_quan_ly
  so_cccd?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  ngay_tao: Date;
}

export interface NguoiDuyet {
  ma_nguoi_duyet: string; // UUID
  ho_ten: string;
  chuc_danh?: string;
  email: string;
  vai_tro: string;
  cap_duyet: number; // 1-7 approval levels
  so_dien_thoai?: string;
  ngay_tao: Date;
}

export interface DonViQuanLy {
  ma_don_vi: string; // UUID
  ten_don_vi: string;
  loai_don_vi?: string;
  truong_don_vi_id?: string; // FK to nguoi_duyet
  email?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  ghi_chu?: string;
  ngay_tao: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  user_id: string; // UUID in v4
  email: string;
  role: string; // 'Admin' | 'NguoiDuyet' | 'VienChuc'
  ma_nguoi_duyet?: string; // For NguoiDuyet users
  ma_vien_chuc?: string; // For VienChuc users
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, 'mat_khau'>;
    token: string;
    refreshToken?: string;
  };
}

export interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

// Extended Express Request with user
export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}
