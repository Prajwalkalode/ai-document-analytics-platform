import { MockAiProvider } from './mockAiProvider.js';
import { OpenAiProvider } from './openAiProvider.js';
import { GeminiProvider } from './geminiProvider.js';
import { MockGeminiProvider } from './mockGeminiProvider.js';

export const createAiProvider = (overrideProvider) => {
  const provider = (overrideProvider || process.env.AI_PROVIDER || '').toLowerCase();

  if (provider === 'openai') return new OpenAiProvider();
  if (provider === 'gemini') return new GeminiProvider();
  if (provider === 'mock_gemini' || provider === 'mockgemini') return new MockGeminiProvider();
  if (provider === 'mock') return new MockAiProvider();

  // Backwards compatible behavior
  if (process.env.USE_REAL_AI === 'true') return new OpenAiProvider();

  return new MockAiProvider();
};
