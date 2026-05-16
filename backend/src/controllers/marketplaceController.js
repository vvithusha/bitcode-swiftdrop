const marketplaceService = require('../services/marketplaceService');

const listEvents = async (req, res, next) => {
  try {
    const events = await marketplaceService.listEvents();
    res.json({ success: true, data: { events } });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await marketplaceService.getEventDetail(req.params.id);
    res.json({ success: true, data: { event } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listEvents,
  getEvent
};
