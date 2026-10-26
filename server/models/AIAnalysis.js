const mongoose = require('mongoose');

const aiAnalysisSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    category: String,
    priority: String,
    severity: String,
    team: String,
    confidence: Number,
    suggestedResponse: String,
  },
  {
    timestamps: true,
  }
);

const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);
module.exports = AIAnalysis;
