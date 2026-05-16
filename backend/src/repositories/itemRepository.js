const prisma = require('../models/prismaClient');

const findById = (id) => {
  return prisma.item.findUnique({
    where: { id },
    include: { event: true }
  });
};

const listByEventId = (eventId) => {
  return prisma.item.findMany({ where: { eventId } });
};

const incrementSoldCount = (id, amount = 1) => {
  return prisma.item.update({
    where: { id },
    data: {
      soldCount: { increment: amount }
    }
  });
};

module.exports = {
  findById,
  incrementSoldCount,
  listByEventId
};
