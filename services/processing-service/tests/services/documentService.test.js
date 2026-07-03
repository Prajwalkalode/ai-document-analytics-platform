import { describe, it, expect, vi } from 'vitest';
import { docItem } from '../testData.js';

// Mock DynamoDB doc client and client
vi.mock('@aws-sdk/lib-dynamodb', () => {
  let lastGetInput = null;
  let lastPutInput = null;
  let lastUpdateInput = null;
  return {
    DynamoDBDocumentClient: {
      from: () => ({ send: (cmd) => {
        if (cmd.constructor.name === 'GetCommand') return Promise.resolve({ Item: docItem });
        if (cmd.constructor.name === 'PutCommand') return Promise.resolve({});
        if (cmd.constructor.name === 'UpdateCommand') return Promise.resolve({});
        return Promise.resolve({});
      } }),
    },
    GetCommand: class GetCommand { constructor(input) { lastGetInput = input; this.input = input; } },
    PutCommand: class PutCommand { constructor(input) { lastPutInput = input; this.input = input; } },
    UpdateCommand: class UpdateCommand { constructor(input) { lastUpdateInput = input; this.input = input; } },
    __getLastGetInput: () => lastGetInput,
    __getLastPutInput: () => lastPutInput,
    __getLastUpdateInput: () => lastUpdateInput,
  };
});

vi.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: function () { return { send: vi.fn() }; },
  DescribeTableCommand: class DescribeTableCommand { constructor(input) { this.input = input; } },
}));

const { getDocumentMetadata, saveDocumentContent, updateDocumentStatus, checkTable } = await import('../../services/documentService.js');

describe('documentService', () => {
  it('getDocumentMetadata returns item', async () => {
    const item = await getDocumentMetadata({ tableName: 'T', documentId: 'DOC1' });
    expect(item).toEqual(docItem);
  });

  it('saveDocumentContent calls put', async () => {
    await expect(saveDocumentContent({ tableName: 'T', documentId: 'DOC1', extractedText: 'x', processedAt: 'now' })).resolves.toBeUndefined();
  });

  it('updateDocumentStatus calls update', async () => {
    await expect(updateDocumentStatus({ tableName: 'T', documentId: 'DOC1', status: 'PROCESSED', updatedAt: 'now' })).resolves.toBeUndefined();
  });

  it('checkTable calls describe', async () => {
    await expect(checkTable({ tableName: 'T' })).resolves.toBeUndefined();
  });
});
