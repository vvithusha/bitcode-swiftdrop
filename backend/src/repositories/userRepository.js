const prisma = require('../models/prismaClient');

const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const createUser = (data) => {
  return prisma.user.create({ data });
};

const updatePassword = (id, passwordHash) => {
  return prisma.user.update({
    where: { id },
    data: { passwordHash }
  });
};

const listUsers = ({ skip, take }) => {
  return prisma.user.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' }
  });
};

const countUsers = () => {
  return prisma.user.count();
};

const deactivateUser = (id) => {
  return prisma.user.update({
    where: { id },
    data: { isActive: false }
  });
};

const updateDisplayName = (id, displayName) => {
  return prisma.user.update({
    where: { id },
    data: { displayName }
  });
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  listUsers,
  countUsers,
  deactivateUser,
  updateDisplayName
};
