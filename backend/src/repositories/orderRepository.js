const prisma = require('../models/prismaClient');

const sumRevenue = async () => {
  const result = await prisma.order.aggregate({
    where: { status: 'CONFIRMED' },
    _sum: { pricePaid: true }
  });
  return result._sum.pricePaid || 0;
};

const sumUnitsSold = async () => {
  const result = await prisma.order.aggregate({
    where: { status: 'CONFIRMED' },
    _count: { id: true }
  });
  return result._count.id || 0;
};

const listConfirmedOrders = () => {
  return prisma.order.findMany({
    where: { status: 'CONFIRMED' },
    select: { eventId: true, itemId: true, pricePaid: true }
  });
};

module.exports = {
  sumRevenue,
  sumUnitsSold,
  listConfirmedOrders
};
