const Ticket = require('../models/Ticket');

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Agent/Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const pendingTickets = await Ticket.countDocuments({ status: 'Pending' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    const criticalTickets = await Ticket.countDocuments({ priority: 'Critical' });

    // AI Classification Accuracy (Mocked based on confidence > 0.7)
    const highConfidenceTickets = await Ticket.countDocuments({ aiConfidence: { $gt: 0.7 } });
    const aiAccuracy = totalTickets === 0 ? 0 : Math.round((highConfidenceTickets / totalTickets) * 100);

    // Auto routed tickets (not assigned to General Support)
    const autoRoutedTickets = await Ticket.countDocuments({ assignedTeam: { $ne: 'General Support' } });

    res.json({
      totalTickets,
      openTickets,
      pendingTickets,
      resolvedTickets,
      closedTickets,
      criticalTickets,
      aiAccuracy,
      autoRoutedTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tickets by category for charts
// @route   GET /api/analytics/categories
// @access  Private (Agent/Admin)
const getTicketsByCategory = async (req, res) => {
  try {
    const categories = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories.map(c => ({ name: c._id, value: c.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tickets by priority
// @route   GET /api/analytics/priorities
// @access  Private (Agent/Admin)
const getTicketsByPriority = async (req, res) => {
  try {
    const priorities = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    res.json(priorities.map(p => ({ name: p._id, value: p.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team workload
// @route   GET /api/analytics/teams
// @access  Private (Agent/Admin)
const getTeamWorkload = async (req, res) => {
  try {
    const teams = await Ticket.aggregate([
      { $match: { status: { $in: ['Open', 'In Progress', 'Pending'] } } },
      { $group: { _id: '$assignedTeam', count: { $sum: 1 } } }
    ]);
    res.json(teams.map(t => ({ name: t._id, value: t.count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getTicketsByCategory,
  getTicketsByPriority,
  getTeamWorkload,
};
