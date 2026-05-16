const prisma = require('../models/prismaClient');

const createEventWithItems = (data) => {
  return prisma.event.create({
    data,
    include: { items: true }
  });
};

const findById = (id) => {
  return prisma.event.findUnique({
    where: { id },
    include: { items: true }
  });
};

const updateEvent = (id, data) => {
  return prisma.event.update({
    where: { id },
    data,
    include: { items: true }
  });
};

const updateEventWithItems = (id, data) => {
  const { items, ...eventData } = data;
  return prisma.$transaction(async (tx) => {
    const updatedEvent = await tx.event.update({
      where: { id },
      data: eventData
    });

    await tx.item.deleteMany({ where: { eventId: id } });
    const createdItems = await Promise.all(
      items.map((item) => tx.item.create({
        data: {
          eventId: id,
          name: item.name,
          coverPhotoUrl: item.coverPhotoUrl,
          unitPrice: Number(item.unitPrice),
          stockQuantity: Number(item.stockQuantity)
        }
      }))
    );

    return { ...updatedEvent, items: createdItems };
  });
};

const listEvents = () => {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
};

const listPublicEvents = () => {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });
};

const findPublicById = (id) => {
  return prisma.event.findUnique({
    where: { id },
    include: { items: true }
  });
};

module.exports = {
  createEventWithItems,
  findById,
  updateEvent,
  updateEventWithItems,
  listEvents,
  listPublicEvents,
  findPublicById
};
