const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../middleware/appError');
const userRepository = require('../repositories/userRepository');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');

const getSaltRounds = () => {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  return Number.isNaN(rounds) ? 12 : rounds;
};

const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT secret missing', 500, 'CONFIG_ERROR');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  return jwt.sign(payload, secret, { expiresIn });
};

const register = async ({ email, displayName, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, getSaltRounds());
  const user = await userRepository.createUser({
    email,
    displayName,
    passwordHash,
    role: 'CUSTOMER',
    isActive: true
  });

  return user;
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    jti: crypto.randomUUID()
  });

  return { user, token };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_CREDENTIALS');
  }

  const passwordHash = await bcrypt.hash(newPassword, getSaltRounds());
  await userRepository.updatePassword(userId, passwordHash);
};

const logout = async ({ token, exp }) => {
  if (!token || !exp) {
    throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }

  await ensureRedisConnection();
  const ttl = Math.max(1, Number(exp) - Math.floor(Date.now() / 1000));
  await redisClient.set(`blacklist:${token}`, '1', { EX: ttl });
};

module.exports = {
  register,
  login,
  changePassword,
  logout
};
