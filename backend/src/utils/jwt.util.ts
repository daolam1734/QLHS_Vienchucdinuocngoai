import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthTokenPayload } from '../types';

export const generateAccessToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

export const generateRefreshToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);
};

export const verifyAccessToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): AuthTokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
};
