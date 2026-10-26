const express = require('express');
const router = express.Router();
const { getTeams } = require('../controllers/teamController');
const { protect, agentOrAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, agentOrAdmin, getTeams);

module.exports = router;
