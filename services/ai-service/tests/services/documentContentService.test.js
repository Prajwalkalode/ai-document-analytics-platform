import { vi, describe, it, expect, beforeEach } from 'vitest';
import { docItem } from '../testData.js';

vi.mock('@aws-sdk/lib-dynamodb', () => {
  let lastGetInput = null;
  return {
    DynamoDBDocumentClient: {
      from: () => ({ send: (cmd) => { lastGetInput = cmd.input; return Promise.resolve({ Item: { documentId: 'DOC1', extractedText: 't' } }); } }),
    },
    GetCommand: class GetCommand { constructor(input) { this.input = input; } },
    __getLastGetInput: () => lastGetInput,
  };
});

import { getDocumentContent } from '../../services/documentContentService.js';

describe('documentContentService', () => {
  it('returns item when present', async () => {
    process.env.DOCUMENT_CONTENT_TABLE_NAME = 'DOC_TABLE';

    const item = await getDocumentContent('DOC1');

    expect(item).toEqual(docItem);
    const lib = await import('@aws-sdk/lib-dynamodb');
    const last = lib.__getLastGetInput();
    expect(last.TableName).toBe('DOC_TABLE');
  });
});
