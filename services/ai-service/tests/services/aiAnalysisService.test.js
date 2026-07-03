import { vi, describe, it, expect, beforeEach } from 'vitest';
import { sampleRequest, analysisResult } from '../testData.js';

// Mock AI provider and DynamoDB document client before importing service
vi.mock('@aws-sdk/lib-dynamodb', () => {
  let lastPutInput = null;
  return {
    DynamoDBDocumentClient: {
      from: () => ({ send: (cmd) => { lastPutInput = cmd.input; return Promise.resolve(); } }),
    },
    PutCommand: class PutCommand {
      constructor(input) { this.input = input; }
    },
    __getLastPutInput: () => lastPutInput,
  };
});

vi.mock('../../providers/aiProvider.js', () => ({
  createAiProvider: vi.fn(() => ({ generateAnalysis: vi.fn(() => Promise.resolve({ summary: 's', keywords: ['a'], category: 'TECH', sentiment: 'POS' })) })),
}));

import { analyzeDocumentWithAi } from '../../services/aiAnalysisService.js';

describe('aiAnalysisService', () => {
  it('stores analysis to DynamoDB and returns analysis', async () => {
    process.env.AI_RESULTS_TABLE_NAME = 'AI_RESULTS';

    const result = await analyzeDocumentWithAi({ documentId: sampleRequest.documentId, text: 'text', provider: 'mock' });

    expect(result).toEqual(expect.objectContaining(analysisResult));

    const lib = await import('@aws-sdk/lib-dynamodb');
    const last = lib.__getLastPutInput();
    expect(last.TableName).toBe('AI_RESULTS');
    expect(last.Item.documentId).toBe(sampleRequest.documentId);
  });
});
