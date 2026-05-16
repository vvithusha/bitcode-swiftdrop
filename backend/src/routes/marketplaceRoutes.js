const express = require('express');
const marketplaceController = require('../controllers/marketplaceController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/events', requireAuth, marketplaceController.listEvents);
router.get('/events/:id', requireAuth, marketplaceController.getEvent);

module.exports = router;
