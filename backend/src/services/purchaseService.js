const AppError = require('../middleware/appError');
const itemRepository = require('../repositories/itemRepository');
const purchaseRepository = require('../repositories/purchaseRepository');
const eventRepository = require('../repositories/eventRepository');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');
const { getIO } = require('../socket');

const LUA_DECR = `
local stock = tonumber(redis.call('GET', KEYS[1]))
if stock == nil then
  stock = tonumber(ARGV[1])
  if stock == nil or stock <= 0 then
    return -1
  end
  redis.call('SET', KEYS[1], stock)
end
if stock == nil or stock <= 0 then
  return -1
end
return redis.call('DECR', KEYS[1])
`;

const getStockKey = (itemId) => `stock:${itemId}`;

const updateEventSoldOutIfNeeded = async (eventId) => {
  const items = await itemRepository.listByEventId(eventId);
  if (!items.length) return;

  const pipeline = redisClient.multi();
  items.forEach((item) => pipeline.get(getStockKey(item.id)));
  const results = await pipeline.exec();

  const allSoldOut = items.every((item, index) => {
    const stockValue = results?.[index]?.[1];
    const liveStock = stockValue === null ? item.stockQuantity : Number(stockValue);
    return liveStock <= 0;
  });

  if (!allSoldOut) return;

  const event = await eventRepository.findById(eventId);
  if (!event || event.status === 'SOLD_OUT') return;

  await eventRepository.updateEvent(eventId, { status: 'SOLD_OUT' });
  const io = getIO();
  if (io) {
    io.emit('eventStatusChange', { eventId, status: 'SOLD_OUT' });
  }
};

const reserveStockAndCreateOrder = async ({ userId, itemId }) => {
  const item = await itemRepository.findById(itemId);
  if (!item) {
    throw new AppError('Item not found', 404, 'ITEM_NOT_FOUND');
  }
  if (!item.event || item.event.status !== 'LIVE') {
    throw new AppError('Event is not live', 400, 'EVENT_NOT_LIVE');
  }

  const existingOrder = await purchaseRepository.findUserOrderForItem({
    userId,
    eventId: item.eventId,
    itemId
  });
  if (existingOrder && existingOrder.status !== 'CANCELLED') {
    throw new AppError('You already purchased this item in this event', 409, 'ALREADY_PURCHASED');
  }

  await ensureRedisConnection();
  const stockKey = getStockKey(itemId);
  const result = await redisClient.eval(LUA_DECR, {
    keys: [stockKey],
    arguments: [String(item.stockQuantity)]
  });

  if (Number(result) === -1) {
    throw new AppError('Sold Out', 409, 'SOLD_OUT');
  }

  const io = getIO();
  if (io) {
    io.emit('stockUpdate', { itemId, stock: Number(result) });
  }

  if (Number(result) === 0) {
    await updateEventSoldOutIfNeeded(item.eventId);
  }

  const { order } = await purchaseRepository.createOrderWithReservation({
    userId,
    itemId,
    eventId: item.eventId,
    pricePaid: item.unitPrice
  });

  return order;
};

const confirmOrder = async ({ userId, orderId }) => {
  const order = await purchaseRepository.findOrderById(orderId);
  if (!order || order.userId !== userId) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }
  if (order.status !== 'RESERVED') {
    throw new AppError('Order cannot be confirmed', 400, 'ORDER_INVALID_STATUS');
  }

  const updated = await purchaseRepository.confirmOrderTransactional({
    orderId,
    userId: order.userId,
    itemId: order.itemId,
    eventId: order.eventId
  });

  return updated;
};

const cancelOrder = async ({ userId, orderId }) => {
  const order = await purchaseRepository.findOrderById(orderId);
  if (!order || order.userId !== userId) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }
  if (order.status !== 'RESERVED') {
    throw new AppError('Order cannot be cancelled', 400, 'ORDER_INVALID_STATUS');
  }

  await ensureRedisConnection();
  const stockKey = getStockKey(order.itemId);
  const updatedStock = await redisClient.incr(stockKey);

  const io = getIO();
  if (io) {
    io.emit('stockUpdate', { itemId: order.itemId, stock: Number(updatedStock) });
  }

  const updated = await purchaseRepository.updateOrderStatus(orderId, 'CANCELLED');
  await purchaseRepository.updateReservationStatusByOrder({
    ...order,
    status: 'CANCELLED'
  });

  return updated;
};

module.exports = {
  reserveStockAndCreateOrder,
  confirmOrder,
  cancelOrder
};
