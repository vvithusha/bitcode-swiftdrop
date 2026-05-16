const AppError = require('../middleware/appError');
const adminService = require('../services/adminService');

const createEvent = async (req, res, next) => {
  try {
    const { name, coverPhotoUrl, scheduledAt, items } = req.body;
    if (!name || !coverPhotoUrl || !scheduledAt) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    const event = await adminService.createEvent({
      name,
      coverPhotoUrl,
      scheduledAt,
      items
    });

    res.status(201).json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await adminService.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

const updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      throw new AppError('Status is required', 400, 'VALIDATION_ERROR');
    }
    const event = await adminService.updateEventStatus(req.params.id, status);
    res.json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await adminService.getDashboard();
    res.json({ success: true, data: dashboard });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 20);
    const data = await adminService.listUsers({ page, pageSize });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const user = await adminService.deactivateUser(req.params.id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  updateEventStatus,
  getDashboard,
  listUsers,
  deactivateUser
};
