import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockAnalyzeDocumentService = vi.fn();

vi.mock('../../services/analysisService.js', () => ({
  analyzeDocumentService: mockAnalyzeDocumentService,
}));

const { handleSqsEvent } = await import('../../handlers/sqsHandler.js');

describe('ai sqs handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes each valid SQS message', async () => {
    mockAnalyzeDocumentService.mockResolvedValue({ documentId: 'DOC1' });

    const result = await handleSqsEvent({
      Records: [{ body: JSON.stringify({ eventType: 'DocumentProcessed', documentId: 'DOC1' }) }],
    });

    expect(mockAnalyzeDocumentService).toHaveBeenCalledWith('DOC1');
    expect(result).toEqual({ status: 'OK' });
  });

  it('throws for malformed messages', async () => {
    await expect(
      handleSqsEvent({ Records: [{ body: JSON.stringify({ eventType: 'DocumentProcessed' }) }] })
    ).rejects.toThrow('Invalid SQS message payload');
  });
});
