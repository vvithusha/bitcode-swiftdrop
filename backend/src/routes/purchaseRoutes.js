const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const { requireAuth } = require('../middleware/authMiddleware');
const { getPurchaseRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const limiter = await getPurchaseRateLimiter();
    return limiter(req, res, next);
  } catch (error) {
    return next(error);
  }
}, purchaseController.purchase);

router.post('/:orderId/confirm', requireAuth, purchaseController.confirm);
router.post('/:orderId/cancel', requireAuth, purchaseController.cancel);

module.exports = router;
