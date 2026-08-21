const AuthService = require('../services/AuthService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return successResponse(res, 'User registered successfully', result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return successResponse(res, 'Login successful', result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      // In JWT stateless auth, logout is handled client-side by purging token
      return successResponse(res, 'Logout successful', {}, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return successResponse(res, 'User profile retrieved', { user }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      return successResponse(res, 'Profile updated successfully', { user }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      await AuthService.changePassword(req.user.id, req.body);
      return successResponse(res, 'Password updated successfully', {}, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
