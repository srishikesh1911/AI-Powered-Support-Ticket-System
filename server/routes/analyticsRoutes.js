const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTicketsByCategory,
  getTicketsByPriority,
  getTeamWorkload,
} = require('../controllers/analyticsController');
const { protect, agentOrAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, agentOrAdmin, getDashboardStats);
router.get('/categories', protect, agentOrAdmin, getTicketsByCategory);
router.get('/priorities', protect, agentOrAdmin, getTicketsByPriority);
router.get('/teams', protect, agentOrAdmin, getTeamWorkload);

module.exports = router;
