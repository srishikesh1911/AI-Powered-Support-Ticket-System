const Ticket = require('../models/Ticket');
const AIAnalysis = require('../models/AIAnalysis');
const { analyzeTicket } = require('../services/ai/aiService');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private (Customer)
const createTicket = async (req, res) => {
  const { title, description } = req.body;

  try {
    // 1. AI Analysis
    const aiResult = await analyzeTicket(title, description);

    // 2. Create Ticket with AI suggestions
    const ticket = await Ticket.create({
      title,
      description,
      customer: req.user._id,
      category: aiResult.category,
      priority: aiResult.priority,
      severity: aiResult.severity,
      assignedTeam: aiResult.team,
      aiConfidence: aiResult.confidence,
      suggestedResponse: aiResult.suggestedResponse,
      sentiment: aiResult.sentiment,
    });

    // 3. Log AI Analysis
    await AIAnalysis.create({
      ticket: ticket._id,
      category: aiResult.category,
      priority: aiResult.priority,
      severity: aiResult.severity,
      team: aiResult.team,
      confidence: aiResult.confidence,
      suggestedResponse: aiResult.suggestedResponse,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create ticket.', error: error.message });
  }
};

// @desc    Get all tickets (with pagination & filtering)
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  const { status, priority, category, team, search, page = 1, limit = 20 } = req.query;

  let query = {};

  // If customer, only show their tickets
  if (req.user.role === 'Customer') {
    query.customer = req.user._id;
  }

  // Filters
  if (status && status !== 'All') query.status = status;
  if (priority && priority !== 'All') query.priority = priority;
  if (category && category !== 'All') query.category = category;
  if (team && team !== 'All') query.assignedTeam = team;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalTickets = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tickets,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Access control for customer
    if (req.user.role === 'Customer' && ticket.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket (status, assignedAgent, etc.)
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Allow agents/admins to update specific fields
    if (req.user.role !== 'Customer') {
      ticket.status = req.body.status || ticket.status;
      ticket.priority = req.body.priority || ticket.priority;
      ticket.category = req.body.category || ticket.category;
      ticket.assignedTeam = req.body.assignedTeam || ticket.assignedTeam;
      if (req.body.assignedAgent) {
        ticket.assignedAgent = req.body.assignedAgent;
      }
    } else {
      // Customer can perhaps close a ticket
      if (req.body.status === 'Closed') {
        ticket.status = 'Closed';
      }
    }

    if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
      if (!ticket.resolvedAt) {
        ticket.resolvedAt = Date.now();
      }
    } else {
      ticket.resolvedAt = null; // Reopened
    }

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    await Ticket.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ticket removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};
