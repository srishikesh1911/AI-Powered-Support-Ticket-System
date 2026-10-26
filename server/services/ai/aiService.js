const { classifyText } = require('./localClassifier');
const { generateResponse } = require('./responseGenerator');

const analyzeTicket = async (title, description) => {
  try {
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // In a real scenario with an LLM, we'd make an API call here.
    // For now, we use the local classifier as requested to ensure it works out of the box.
    const classification = classifyText(combinedText);
    const suggestedResponse = generateResponse(classification.category, classification.priority);

    return {
      category: classification.category,
      priority: classification.priority,
      severity: classification.severity,
      team: classification.team,
      confidence: parseFloat(classification.confidence),
      sentiment: classification.sentiment,
      suggestedResponse,
    };
  } catch (error) {
    console.error('AI Analysis failed:', error);
    // Fallback values
    return {
      category: 'Other',
      priority: 'Medium',
      severity: 'Medium',
      team: 'General Support',
      confidence: 0,
      sentiment: 'Neutral',
      suggestedResponse: 'We have received your ticket and will look into it.',
    };
  }
};

module.exports = { analyzeTicket };
