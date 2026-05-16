const AppError = require('../middleware/appError');
const purchaseService = require('../services/purchaseService');

const purchase = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      throw new AppError('itemId is required', 400, 'VALIDATION_ERROR');
    }

    const order = await purchaseService.reserveStockAndCreateOrder({
      userId: req.user.id,
      itemId
    });

    res.status(201).json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const confirm = async (req, res, next) => {
  try {
    const order = await purchaseService.confirmOrder({
      userId: req.user.id,
      orderId: req.params.orderId
    });

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    const order = await purchaseService.cancelOrder({
      userId: req.user.id,
      orderId: req.params.orderId
    });

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchase,
  confirm,
  cancel
};
