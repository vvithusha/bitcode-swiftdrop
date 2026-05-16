const AppError = require('../middleware/appError');
const eventRepository = require('../repositories/eventRepository');
const orderRepository = require('../repositories/orderRepository');
const userRepository = require('../repositories/userRepository');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');
const { getIO } = require('../socket');

const parseScheduledAt = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError('Invalid scheduledAt date', 400, 'VALIDATION_ERROR');
  }
  return date;
};

const createEvent = async ({ name, coverPhotoUrl, scheduledAt, items }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Items are required', 400, 'VALIDATION_ERROR');
  }

  const createItems = items.map((item) => ({
    name: item.name,
    coverPhotoUrl: item.coverPhotoUrl,
    unitPrice: Number(item.unitPrice),
    stockQuantity: Number(item.stockQuantity)
  }));

  createItems.forEach((item) => {
    if (!item.name || !item.coverPhotoUrl) {
      throw new AppError('Item name and cover photo are required', 400, 'VALIDATION_ERROR');
    }
    if (item.stockQuantity < 100 || item.stockQuantity > 500) {
      throw new AppError('Stock must be between 100 and 500', 400, 'VALIDATION_ERROR');
    }
  });

  return eventRepository.createEventWithItems({
    name,
    coverPhotoUrl,
    scheduledAt: parseScheduledAt(scheduledAt),
    status: 'LOCKED',
    items: {
      create: createItems
    }
  });
};

const updateEvent = async (eventId, payload) => {
  const existing = await eventRepository.findById(eventId);
  if (!existing) {
    throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
  }
  if (existing.status !== 'LOCKED') {
    throw new AppError('Only locked events can be edited', 400, 'EVENT_NOT_EDITABLE');
  }

  const data = {};
  if (payload.name) data.name = payload.name;
  if (payload.coverPhotoUrl) data.coverPhotoUrl = payload.coverPhotoUrl;
  if (payload.scheduledAt) data.scheduledAt = parseScheduledAt(payload.scheduledAt);
  if (Array.isArray(payload.items) && payload.items.length > 0) {
    payload.items.forEach((item) => {
      if (!item.name || !item.coverPhotoUrl) {
        throw new AppError('Item name and cover photo are required', 400, 'VALIDATION_ERROR');
      }
      if (Number(item.stockQuantity) < 100 || Number(item.stockQuantity) > 500) {
        throw new AppError('Stock must be between 100 and 500', 400, 'VALIDATION_ERROR');
      }
    });

    return eventRepository.updateEventWithItems(eventId, {
      ...data,
      items: payload.items
    });
  }

  return eventRepository.updateEvent(eventId, data);
};

const updateEventStatus = async (eventId, status) => {
  const existing = await eventRepository.findById(eventId);
  if (!existing) {
    throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
  }

  const updated = await eventRepository.updateEvent(eventId, { status });

  if (status === 'LIVE' && updated.items && updated.items.length > 0) {
    await ensureRedisConnection();
    const pipeline = redisClient.multi();
    updated.items.forEach((item) => {
      pipeline.set(`stock:${item.id}`, item.stockQuantity);
    });
    await pipeline.exec();
  }

  const io = getIO();
  if (io) {
    io.emit('eventStatusChange', { eventId: updated.id, status: updated.status });
  }

  return updated;
};

const getDashboard = async () => {
  const [events, revenue, unitsSold, userCount, confirmedOrders] = await Promise.all([
    eventRepository.listEvents(),
    orderRepository.sumRevenue(),
    orderRepository.sumUnitsSold(),
    userRepository.countUsers(),
    orderRepository.listConfirmedOrders()
  ]);

  const revenueByEvent = confirmedOrders.reduce((acc, order) => {
    acc[order.eventId] = (acc[order.eventId] || 0) + order.pricePaid;
    return acc;
  }, {});

  const ordersByItem = confirmedOrders.reduce((acc, order) => {
    acc[order.itemId] = (acc[order.itemId] || 0) + 1;
    return acc;
  }, {});

  const enrichedEvents = events.map((event) => ({
    ...event,
    revenue: revenueByEvent[event.id] || 0,
    items: (event.items || []).map((item) => ({
      ...item,
      unitsSold: ordersByItem[item.id] || 0
    }))
  }));

  return {
    events: enrichedEvents,
    revenue,
    unitsSold,
    userCount
  };
};

const listUsers = async ({ page, pageSize }) => {
  const take = pageSize;
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    userRepository.listUsers({ skip, take }),
    userRepository.countUsers()
  ]);

  return {
    users,
    total,
    page,
    pageSize
  };
};

const deactivateUser = async (userId) => {
  return userRepository.deactivateUser(userId);
};

module.exports = {
  createEvent,
  updateEvent,
  updateEventStatus,
  getDashboard,
  listUsers,
  deactivateUser
};
