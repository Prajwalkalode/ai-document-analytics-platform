import OpenAI from 'openai';

export class OpenAiProvider {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for the OpenAI provider');
    }

    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateAnalysis(text) {
    const prompt = `Generate a JSON object containing summary, keywords, category, and sentiment for the following text. Do not include any additional commentary. Text: ${text}`;

    const response = await this.client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_output_tokens: 500,
    });

    const output = response.output?.[0]?.content?.[0]?.text || '';

    try {
      const parsed = JSON.parse(output);
      const { summary, keywords, category, sentiment } = parsed;

      if (!summary || !Array.isArray(keywords) || !category || !sentiment) {
        throw new Error('Invalid OpenAI response format');
      }

      return { summary, keywords, category, sentiment };
    } catch (error) {
      throw new Error(`OpenAI provider failed to parse response: ${error.message}`);
    }
  }
}
