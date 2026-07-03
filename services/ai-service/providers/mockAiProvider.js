const STOP_WORDS = new Set([
  'the',
  'and',
  'is',
  'in',
  'to',
  'of',
  'a',
  'for',
  'on',
  'with',
  'that',
  'this',
  'it',
  'as',
  'an',
  'are',
  'at',
  'by',
  'from',
  'or',
  'be',
  'was',
  'were',
  'but',
  'not',
  'they',
  'their',
  'has',
  'have',
  'had',
  'will',
  'would',
  'can',
  'could',
  'should',
  'do',
  'does',
  'did',
  'which',
  'what',
  'when',
  'where',
  'how',
  'all',
  'any',
  'if',
  'so',
  'no',
  'yes',
  'about',
  'been',
  'more',
  'other',
  'some',
  'such',
  'them',
  'than',
  'then',
  'there',
  'therefore',
  'because',
  'into',
  'over',
  'under',
  'up',
  'out',
  'also',
  'many',
  'most',
  'just',
  'only',
  'new',
  'use',
  'used',
  'using',
  'may',
  'each',
  'while',
  'after',
  'before',
  'during',
  'between',
  'both',
  'even',
  'few',
  'more',
  'much',
  'your',
  'our',
  'you',
  'we',
  'he',
  'she',
  'them',
  'his',
  'her',
  'its',
  'who',
  'whom',
  'which',
  'why',
]);

const TECHNICAL_KEYWORDS = ['python', 'java', 'javascript', 'node', 'api'];
const FINANCE_KEYWORDS = ['invoice', 'payment', 'billing'];
const LEGAL_KEYWORDS = ['contract', 'agreement'];
const POSITIVE_KEYWORDS = ['good', 'great', 'excellent'];
const NEGATIVE_KEYWORDS = ['bad', 'poor', 'error'];

const normalizeText = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const buildKeywordList = (words) => {
  const frequency = words.reduce((acc, word) => {
    if (STOP_WORDS.has(word) || word.length < 3) {
      return acc;
    }

    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

const determineCategory = (text) => {
  const normalized = text.toLowerCase();

  if (TECHNICAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'TECHNICAL';
  }

  if (FINANCE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'FINANCE';
  }

  if (LEGAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'LEGAL';
  }

  return 'GENERAL';
};

const determineSentiment = (text) => {
  const normalized = text.toLowerCase();

  if (POSITIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'POSITIVE';
  }

  if (NEGATIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'NEGATIVE';
  }

  return 'NEUTRAL';
};

export class MockAiProvider {
  async generateAnalysis(text) {
    const summary = text.slice(0, 500);
    const words = normalizeText(text);
    const keywords = buildKeywordList(words);
    const category = determineCategory(text);
    const sentiment = determineSentiment(text);

    return {
      summary,
      keywords,
      category,
      sentiment,
    };
  }
}
