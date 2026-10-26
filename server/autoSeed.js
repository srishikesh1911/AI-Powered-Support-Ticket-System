const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Message = require('./models/Message');
const Team = require('./models/Team');

const runSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Database is empty. Seeding demo data...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Admin@123', salt);
    const agentPassword = await bcrypt.hash('Agent@123', salt);
    const customerPassword = await bcrypt.hash('Customer@123', salt);

    // Create Users
    const users = await User.insertMany([
      { name: 'System Admin', email: 'admin@example.com', password, role: 'Admin' },
      { name: 'Support Agent 1', email: 'agent@example.com', password: agentPassword, role: 'Support Agent' },
      { name: 'John Customer', email: 'customer@example.com', password: customerPassword, role: 'Customer' },
      { name: 'Jane Doe', email: 'jane@example.com', password: customerPassword, role: 'Customer' },
    ]);

    // Create Teams
    const teams = await Team.insertMany([
      { name: 'Technical Support', description: 'Handles server and critical bugs' },
      { name: 'Billing Support', description: 'Handles payments and subscriptions' },
      { name: 'Account Support', description: 'Handles logins and authentication' },
      { name: 'Security Team', description: 'Handles security and breaches' },
      { name: 'General Support', description: 'General inquiries' },
    ]);

    // Create Tickets
    const sampleTickets = [
      {
        title: 'Payment failed while subscribing',
        description: 'My payment was deducted from my bank account but my subscription is still inactive.',
        customer: users[2]._id,
        category: 'Billing',
        priority: 'High',
        severity: 'High',
        status: 'Open',
        assignedTeam: 'Billing Support',
        aiConfidence: 0.94,
        suggestedResponse: 'Hello,\n\nWe understand that you are experiencing issues with a payment. Please allow a few minutes for the transaction to be processed. If the issue persists, please provide the transaction reference number so our Billing Support team can investigate.\n\nThank you.',
      },
      {
        title: 'Cannot log into my account',
        description: 'I forgot my password and the reset link is not arriving to my email.',
        customer: users[3]._id,
        category: 'Account / Authentication',
        priority: 'Medium',
        severity: 'Medium',
        status: 'Pending',
        assignedTeam: 'Account Support',
        aiConfidence: 0.88,
        suggestedResponse: 'Hello,\n\nWe see you are having trouble accessing your account. Please verify that your registered email address is correct and try the password reset link again. If the issue continues, our Account Support team will assist you further.',
      },
      {
        title: 'Production server is down',
        description: 'We are getting a 500 internal server error across the entire application.',
        customer: users[2]._id,
        category: 'Technical Support',
        priority: 'Critical',
        severity: 'Critical',
        status: 'In Progress',
        assignedAgent: users[1]._id,
        assignedTeam: 'Technical Support',
        aiConfidence: 0.98,
        suggestedResponse: 'Hello,\n\nWe have received your critical request. Our specialized team is actively investigating the issue and we will provide an update shortly.',
      },
    ];

    const tickets = await Ticket.insertMany(sampleTickets);

    // Create Messages
    await Message.insertMany([
      { ticket: tickets[0]._id, sender: users[2]._id, message: 'Please help, the money was deducted twice.' },
      { ticket: tickets[2]._id, sender: users[2]._id, message: 'The server is returning 500 error on the dashboard.' },
      { ticket: tickets[2]._id, sender: users[1]._id, message: 'We are looking into this immediately.' },
    ]);

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error(`Seeding error: ${error}`);
  }
};

module.exports = runSeed;
