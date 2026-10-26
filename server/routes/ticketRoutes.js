const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

const { addMessage, getMessages } = require('../controllers/messageController');

router.route('/')
  .post(protect, createTicket)
  .get(protect, getTickets);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket)
  .delete(protect, admin, deleteTicket);

router.route('/:id/messages')
  .post(protect, addMessage)
  .get(protect, getMessages);

module.exports = router;
