import { GoogleGenAI } from '@google/genai';

export class GeminiProvider {
  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is required for the Gemini provider');
    }

    this.client = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
  }

  async generateAnalysis(text) {
    const prompt = `Generate a JSON object containing summary, keywords, category, and sentiment for the following text. Do not include any additional commentary. Text: ${text}`;

    const response = await this.client.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            sentiment: { type: 'string' },
          },
          required: ['summary', 'keywords', 'category', 'sentiment'],
        },
      },
    });

    const textOutput = response?.text || '';

    try {
      const parsed = JSON.parse(textOutput);
      const { summary, keywords, category, sentiment } = parsed;

      if (!summary || !Array.isArray(keywords) || !category || !sentiment) {
        throw new Error('Invalid Gemini response format');
      }

      return { summary, keywords, category, sentiment };
    } catch (error) {
      throw new Error(`Gemini provider failed to parse response: ${error.message}`);
    }
  }
}
