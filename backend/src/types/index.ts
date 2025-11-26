import { Request } from 'express';

// User related types
export interface User {
  ma_nguoi_dung: number;
  email: string;
  ho_ten: string;
  ma_vai_tro: string;
  ten_vai_tro?: string;
  ma_don_vi?: number;
  ten_don_vi?: string;
  trang_thai: string;
  ngay_tao: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  ma_nguoi_dung: number;
  email: string;
  ma_vai_tro: string;
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
