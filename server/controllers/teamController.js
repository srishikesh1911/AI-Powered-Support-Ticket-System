const Team = require('../models/Team');
const Ticket = require('../models/Ticket');

// @desc    Get all teams and their workloads
// @route   GET /api/teams
// @access  Private (Admin/Agent)
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    
    // Calculate workloads for each team
    const teamStats = await Promise.all(teams.map(async (team) => {
      const openTickets = await Ticket.countDocuments({ assignedTeam: team.name, status: { $in: ['Open', 'In Progress'] } });
      const criticalTickets = await Ticket.countDocuments({ assignedTeam: team.name, status: { $in: ['Open', 'In Progress'] }, priority: 'Critical' });
      const totalTickets = await Ticket.countDocuments({ assignedTeam: team.name });
      
      return {
        _id: team._id,
        name: team.name,
        description: team.description,
        openTickets,
        criticalTickets,
        totalTickets
      };
    }));

    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTeams
};
