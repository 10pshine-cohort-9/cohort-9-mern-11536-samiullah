const UserRepository = require('../repositories/UserRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const logger = require('../config/logger');

class AuthService {
  static async register({ full_name, email, password }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('Email is already registered.');
      err.statusCode = 409;
      err.isOperational = true;
      throw err;
    }

    const hashedPassword = await hashPassword(password);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`;

    const user = await UserRepository.create({
      full_name,
      email,
      password: hashedPassword,
      avatar
    });

    const token = generateToken({ id: user.id, email: user.email, full_name: user.full_name });

    logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

    return { user, token };
  }

  static async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password credentials.');
      err.statusCode = 401;
      err.isOperational = true;
      throw err;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password credentials.');
      err.statusCode = 401;
      err.isOperational = true;
      throw err;
    }

    const token = generateToken({ id: user.id, email: user.email, full_name: user.full_name });

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at
    };

    logger.info({ userId: user.id }, 'User logged in successfully');

    return { user: safeUser, token };
  }

  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }
    return user;
  }

  static async updateProfile(userId, data) {
    const user = await UserRepository.updateProfile(userId, data);
    logger.info({ userId }, 'User profile updated');
    return user;
  }

  static async changePassword(userId, { current_password, new_password }) {
    const user = await UserRepository.findByIdWithPassword(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      err.isOperational = true;
      throw err;
    }

    const isMatch = await comparePassword(current_password, user.password);
    if (!isMatch) {
      const err = new Error('Current password is incorrect.');
      err.statusCode = 400;
      err.isOperational = true;
      throw err;
    }

    const hashedNew = await hashPassword(new_password);
    await UserRepository.updatePassword(userId, hashedNew);
    logger.info({ userId }, 'Password changed successfully');
    return true;
  }
}

module.exports = AuthService;
