/**
 * SSO Authentication Routes
 */

import express from 'express';
import {
  initiateSSO,
  mockSSOLogin,
  handleSSOCallback,
  getMockUsers,
  logout,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controllers/sso-auth.controller';

const router = express.Router();

/**
 * @route   GET /api/auth/sso/login
 * @desc    Initiate SSO login (redirect to SSO provider)
 * @access  Public
 */
router.get('/sso/login', initiateSSO);

/**
 * @route   POST /api/auth/sso/mock-login
 * @desc    Mock SSO login (for development)
 * @access  Public
 */
router.post('/sso/mock-login', mockSSOLogin);

/**
 * @route   POST /api/auth/sso/callback
 * @desc    Handle SSO callback
 * @access  Public
 */
router.post('/sso/callback', handleSSOCallback);

/**
 * @route   GET /api/auth/sso/users
 * @desc    Get mock SSO users (development only)
 * @access  Public (development)
 */
router.get('/sso/users', getMockUsers);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Public (requires authentication)
 */
router.post('/change-password', changePassword);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPassword);

export default router;
