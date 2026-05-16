const jwt = require('jsonwebtoken');
const AppError = require('./appError');
const userRepository = require('../repositories/userRepository');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');

const requireAuth = async (req, res, next) => {
  const token = req.cookies && req.cookies.accessToken;
  if (!token) {
    return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await ensureRedisConnection();
    const blacklisted = await redisClient.get(`blacklist:${token}`);
    if (blacklisted) {
      return next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
    }

    const user = await userRepository.findById(payload.id);
    if (!user || !user.isActive) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
    }

    req.token = token;
    req.user = payload;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403, 'ADMIN_REQUIRED'));
  }
  return next();
};

module.exports = { requireAuth, requireAdmin };
