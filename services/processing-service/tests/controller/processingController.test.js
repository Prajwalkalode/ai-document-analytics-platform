import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockProcessDocumentService = vi.fn();

vi.mock('../../services/processDocumentService.js', () => ({
  processDocumentService: mockProcessDocumentService,
}));

vi.mock('../../services/eventPublisher.js', () => ({
  publishDocumentProcessedEvent: vi.fn(() => Promise.resolve()),
}));

const { processDocument } = await import('../../controller/processingController.js');

describe('processingController', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: { documentId: 'DOC123' } };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(() => res),
    };
  });

  it('returns 200 when processing succeeds', async () => {
    mockProcessDocumentService.mockResolvedValue({
      documentId: 'DOC123',
      status: 'PROCESSED',
      textLength: 10,
    });

    await processDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Document processed successfully',
        documentId: 'DOC123',
      })
    );
  });

  it('returns 500 when processing fails', async () => {
    mockProcessDocumentService.mockRejectedValue(new Error('boom'));

    await processDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Document processing failed' });
  });
});
