import nlp from 'compromise';
import Sentiment from 'sentiment';

const sentimentAnalyzer = new Sentiment();

/**
 * Local NLP Service for DisasterSense AI
 * Uses Compromise and Sentiment libraries for fast, local text analysis
 * before or alongside the LLM (Groq) API.
 */
export const localNLP = {
  /**
   * Analyze sentiment of a post
   * Returns a score (positive is good, negative is bad)
   */
  analyzeSentiment: (text) => {
    if (!text) return { score: 0, comparative: 0, tokens: [], words: [], positive: [], negative: [] };
    return sentimentAnalyzer.analyze(text);
  },

  /**
   * Extract entities like Places, Organizations, People, and Dates from text
   */
  extractEntities: (text) => {
    if (!text) return { places: [], organizations: [], people: [], dates: [] };
    
    const doc = nlp(text);
    return {
      places: doc.places().out('array'),
      organizations: doc.organizations().out('array'),
      people: doc.people().out('array'),
      dates: doc.match('#Date').out('array'),
      topics: doc.nouns().out('array')
    };
  },

  /**
   * Tokenize text to lowercase words
   */
  tokenizeAndStem: (text) => {
    if (!text) return [];
    // Fallback simple tokenization without the natural library
    return text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(Boolean);
  },

  /**
   * Full local analysis of a social media post
   */
  analyzePostLocal: (text) => {
    const sentimentResult = localNLP.analyzeSentiment(text);
    const entities = localNLP.extractEntities(text);
    const tokens = localNLP.tokenizeAndStem(text);

    // Simple heuristic for disaster detection based on local NLP
    const disasterKeywords = ['earthquake', 'quake', 'flood', 'fire', 'wildfire', 'hurricane', 'cyclone', 'tornado', 'tsunami', 'disaster', 'emergency', 'casualty', 'evacuate'];
    
    const detectedKeywords = tokens.filter(token => disasterKeywords.includes(token.toLowerCase()));
    const isPotentiallyDisaster = detectedKeywords.length > 0;
    
    // Negative sentiment often correlates with disasters
    const isNegative = sentimentResult.score < -2;

    return {
      text,
      sentiment: {
        score: sentimentResult.score,
        isNegative
      },
      entities,
      keywords: detectedKeywords,
      isPotentiallyDisaster: isPotentiallyDisaster || (entities.topics.some(t => disasterKeywords.includes(t.toLowerCase()))),
      urgencySignal: isNegative && isPotentiallyDisaster ? 'High' : 'Low'
    };
  }
};

export default localNLP;
