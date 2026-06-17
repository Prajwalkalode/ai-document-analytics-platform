import { MockAiProvider } from './mockAiProvider.js';
import { OpenAiProvider } from './openAiProvider.js';

export const createAiProvider = () => {
  if (process.env.USE_REAL_AI === 'true') {
    return new OpenAiProvider();
  }

  return new MockAiProvider();
};
