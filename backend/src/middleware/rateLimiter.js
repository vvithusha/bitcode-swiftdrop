const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');

let purchaseLimiterPromise;

const getPurchaseRateLimiter = async () => {
  if (!purchaseLimiterPromise) {
    purchaseLimiterPromise = (async () => {
      await ensureRedisConnection();
      return rateLimit({
        windowMs: 1000,
        max: 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          success: false,
          message: 'Too many requests',
          code: 'RATE_LIMITED'
        },
        store: new RedisStore({
          sendCommand: (...args) => redisClient.sendCommand(args)
        })
      });
    })();
  }

  return purchaseLimiterPromise;
};

module.exports = { getPurchaseRateLimiter };
