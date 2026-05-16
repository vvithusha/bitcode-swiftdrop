const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.put('/events/:id/status', adminController.updateEventStatus);
router.get('/events', adminController.getDashboard);

router.get('/users', adminController.listUsers);
router.put('/users/:id/deactivate', adminController.deactivateUser);

module.exports = router;
