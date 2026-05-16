const AppError = require('../middleware/appError');
const eventRepository = require('../repositories/eventRepository');
const { redisClient, ensureRedisConnection } = require('../models/redisClient');

const listEvents = async () => {
  return eventRepository.listPublicEvents();
};

const getEventDetail = async (eventId) => {
  const event = await eventRepository.findPublicById(eventId);
  if (!event) {
    throw new AppError('Event not found', 404, 'EVENT_NOT_FOUND');
  }

  if (event.items && event.items.length > 0) {
    await ensureRedisConnection();
    const pipeline = redisClient.multi();
    event.items.forEach((item) => pipeline.get(`stock:${item.id}`));
    const results = await pipeline.exec();

    event.items = event.items.map((item, index) => {
      const stockValue = results?.[index]?.[1];
      return {
        ...item,
        liveStock: stockValue !== null ? Number(stockValue) : item.stockQuantity
      };
    });
  }

  return event;
};

module.exports = {
  listEvents,
  getEventDetail
};
