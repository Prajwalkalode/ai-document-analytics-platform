import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockPublishDocumentProcessedEvent = vi.fn();

vi.mock('../../services/eventPublisher.js', () => ({
  publishDocumentProcessedEvent: mockPublishDocumentProcessedEvent,
}));

vi.mock('../../services/documentService.js', async () => {
  const actual = await vi.importActual('../../services/documentService.js');
  return {
    ...actual,
    getDocumentMetadata: vi.fn(() => ({ s3Key: 'key.pdf', contentType: 'application/pdf' })),
    updateDocumentStatus: vi.fn(() => Promise.resolve()),
    saveDocumentContent: vi.fn(() => Promise.resolve()),
  };
});

vi.mock('../../services/s3Service.js', () => ({
  downloadFileFromS3: vi.fn(() => Promise.resolve(Buffer.from('pdf'))),
}));

vi.mock('../../services/textExtractionService.js', () => ({
  extractTextFromBuffer: vi.fn(() => 'extracted text'),
}));

const { processDocument } = await import('../../controller/processingController.js');

describe('processing controller event publishing', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: { documentId: 'DOC123' } };
    res = { status: vi.fn(() => res), json: vi.fn(() => res) };
  });

  it('publishes DocumentProcessed after processing completes', async () => {
    mockPublishDocumentProcessedEvent.mockResolvedValue();

    await processDocument(req, res);

    expect(mockPublishDocumentProcessedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'DOC123',
        textLength: 14,
      })
    );
  });
});
