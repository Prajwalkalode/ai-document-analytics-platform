// Lightweight mock provider intended to mimic Gemini responses for local testing
const STOP_WORDS = new Set([
  'the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'on', 'with', 'that', 'this', 'it',
]);

const normalizeText = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const buildKeywordList = (words) => {
  const frequency = words.reduce((acc, word) => {
    if (STOP_WORDS.has(word) || word.length < 3) return acc;
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency).sort(([, a], [, b]) => b - a).slice(0, 10).map(([word]) => word);
};

const determineCategory = (text) => {
  const normalized = text.toLowerCase();
  if (normalized.includes('invoice') || normalized.includes('billing')) return 'FINANCE';
  if (normalized.includes('contract') || normalized.includes('agreement')) return 'LEGAL';
  if (normalized.includes('python') || normalized.includes('node') || normalized.includes('javascript')) return 'TECHNICAL';
  return 'GENERAL';
};

const determineSentiment = (text) => {
  const normalized = text.toLowerCase();
  if (normalized.includes('good') || normalized.includes('great') || normalized.includes('excellent')) return 'POSITIVE';
  if (normalized.includes('bad') || normalized.includes('poor') || normalized.includes('error')) return 'NEGATIVE';
  return 'NEUTRAL';
};

export class MockGeminiProvider {
  async generateAnalysis(text) {
    const summary = text.slice(0, 500);
    const words = normalizeText(text);
    const keywords = buildKeywordList(words);
    const category = determineCategory(text);
    const sentiment = determineSentiment(text);

    return { summary, keywords, category, sentiment };
  }
}
