const Message = require('../models/Message');
const Ticket = require('../models/Ticket');

// @desc    Add a message to a ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
const addMessage = async (req, res) => {
  const { message } = req.body;
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Auth check
    if (req.user.role === 'Customer' && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to message on this ticket' });
    }

    const newMessage = await Message.create({
      ticket: ticketId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await newMessage.populate('sender', 'name role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a ticket
// @route   GET /api/tickets/:id/messages
// @access  Private
const getMessages = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Auth check
    if (req.user.role === 'Customer' && ticket.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view messages on this ticket' });
    }

    const messages = await Message.find({ ticket: ticketId }).populate('sender', 'name role').sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMessage, getMessages };
