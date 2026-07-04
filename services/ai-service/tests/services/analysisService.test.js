import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetDocumentContent = vi.fn();
const mockAnalyzeDocumentWithAi = vi.fn();
const mockPublishAnalysisCompletedEvent = vi.fn();

vi.mock('../../services/documentContentService.js', () => ({
  getDocumentContent: mockGetDocumentContent,
}));

vi.mock('../../services/aiAnalysisService.js', () => ({
  analyzeDocumentWithAi: mockAnalyzeDocumentWithAi,
}));

vi.mock('../../services/eventPublisher.js', () => ({
  publishAnalysisCompletedEvent: mockPublishAnalysisCompletedEvent,
}));

const { analyzeDocumentService } = await import('../../services/analysisService.js');

describe('analysisService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('publishes AnalysisCompleted after analysis succeeds', async () => {
    mockGetDocumentContent.mockResolvedValue({ extractedText: 'text' });
    mockAnalyzeDocumentWithAi.mockResolvedValue({
      summary: 's',
      keywords: ['k'],
      category: 'TECH',
      sentiment: 'POS',
    });
    mockPublishAnalysisCompletedEvent.mockResolvedValue();

    const result = await analyzeDocumentService('DOC1');

    expect(result).toEqual(
      expect.objectContaining({
        documentId: 'DOC1',
        category: 'TECH',
        sentiment: 'POS',
      })
    );
    expect(mockPublishAnalysisCompletedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'DOC1',
        category: 'TECH',
        sentiment: 'POS',
      })
    );
  });
});
