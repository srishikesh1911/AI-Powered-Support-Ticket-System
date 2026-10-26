const natural = require('natural');
const TfIdf = natural.TfIdf;

// Sample training data
const trainingData = [
  { text: 'payment failed deducted money billing', category: 'Billing', priority: 'High', team: 'Billing Support' },
  { text: 'cannot login password reset access', category: 'Account / Authentication', priority: 'High', team: 'Account Support' },
  { text: 'server down outage critical 500 error', category: 'Technical Support', priority: 'Critical', team: 'Technical Support' },
  { text: 'bug feature not working error application crash', category: 'Bug Report', priority: 'Medium', team: 'Product Support' },
  { text: 'general question pricing hello', category: 'General Inquiry', priority: 'Low', team: 'General Support' },
  { text: 'suspect someone accessed my account hacked', category: 'Security', priority: 'Critical', team: 'Security Team' },
  { text: 'network connection timeout slow', category: 'Network Issue', priority: 'Medium', team: 'Network Support' },
];

const tfidf = new TfIdf();
trainingData.forEach(doc => {
  tfidf.addDocument(doc.text);
});

const classifyText = (text) => {
  let maxScore = 0;
  let bestMatch = null;

  trainingData.forEach((doc, index) => {
    let score = 0;
    tfidf.tfidfs(text, (i, measure) => {
      if (i === index) score = measure;
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  });

  if (bestMatch && maxScore > 0.5) {
    // Determine severity based on priority mapping (simplified)
    const severity = bestMatch.priority;
    return {
      category: bestMatch.category,
      priority: bestMatch.priority,
      severity: severity,
      team: bestMatch.team,
      confidence: Math.min(0.99, maxScore / 5).toFixed(2), // Mock confidence score
      sentiment: determineSentiment(text)
    };
  }

  return {
    category: 'Other',
    priority: 'Medium',
    severity: 'Medium',
    team: 'General Support',
    confidence: 0.5,
    sentiment: determineSentiment(text)
  };
};

const determineSentiment = (text) => {
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");
  
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text);
  
  const score = analyzer.getSentiment(words);
  if (score < -0.1) return 'Negative';
  if (score > 0.1) return 'Positive';
  return 'Neutral';
};

module.exports = { classifyText };
