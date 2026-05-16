const prisma = require('../models/prismaClient');

const createOrderWithReservation = ({ userId, itemId, eventId, pricePaid }) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        itemId,
        eventId,
        pricePaid,
        status: 'RESERVED'
      }
    });

    const reservation = await tx.stockReservation.create({
      data: {
        userId,
        itemId,
        eventId,
        status: 'RESERVED'
      }
    });

    return { order, reservation };
  });
};

const findOrderById = (id) => {
  return prisma.order.findUnique({
    where: { id },
    include: { item: true, event: true }
  });
};

const updateOrderStatus = (id, status) => {
  return prisma.order.update({
    where: { id },
    data: { status }
  });
};

const updateReservationStatusByOrder = (order) => {
  return prisma.stockReservation.updateMany({
    where: {
      userId: order.userId,
      itemId: order.itemId,
      eventId: order.eventId,
      status: 'RESERVED'
    },
    data: { status: order.status }
  });
};

const confirmOrderTransactional = ({ orderId, userId, itemId, eventId }) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' }
    });

    await tx.stockReservation.updateMany({
      where: {
        userId,
        itemId,
        eventId,
        status: 'RESERVED'
      },
      data: { status: 'CONFIRMED' }
    });

    await tx.item.update({
      where: { id: itemId },
      data: {
        soldCount: { increment: 1 }
      }
    });

    return order;
  });
};

const listOrdersByUser = (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { item: true, event: true },
    orderBy: { createdAt: 'desc' }
  });
};

const findUserOrderForItem = ({ userId, eventId, itemId }) => {
  return prisma.order.findFirst({
    where: {
      userId,
      eventId,
      itemId
    }
  });
};

module.exports = {
  createOrderWithReservation,
  findOrderById,
  updateOrderStatus,
  updateReservationStatusByOrder,
  confirmOrderTransactional,
  listOrdersByUser,
  findUserOrderForItem
};
