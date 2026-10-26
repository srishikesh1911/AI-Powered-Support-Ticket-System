const generateResponse = (category, priority) => {
  if (category === 'Billing') {
    return "Hello,\n\nWe understand that you are experiencing issues with a payment. Please allow a few minutes for the transaction to be processed. If the issue persists, please provide the transaction reference number so our Billing Support team can investigate.\n\nThank you.";
  }
  if (category === 'Account / Authentication') {
    return "Hello,\n\nWe see you're having trouble accessing your account. Please verify that your registered email address is correct and try the password reset link again. If the issue continues, our Account Support team will assist you further.";
  }
  if (category === 'Technical Support' || category === 'Bug Report') {
    return "Hello,\n\nThank you for reporting this issue. Our Technical Support team has been notified and is looking into this. We will get back to you with an update as soon as possible.";
  }
  if (priority === 'Critical') {
    return "Hello,\n\nWe have received your critical request. Our specialized team is actively investigating the issue and we will provide an update shortly.";
  }
  
  return "Hello,\n\nThank you for reaching out. We have received your request and our support team will review it and get back to you shortly.";
};

module.exports = { generateResponse };
