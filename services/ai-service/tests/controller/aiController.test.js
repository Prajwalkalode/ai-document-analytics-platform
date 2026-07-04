import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { sampleRequest, missingRequest, documentContent, analysisResult } from '../testData.js';

// Mock dependencies before importing controller
vi.mock('../../services/documentContentService.js', () => ({
  getDocumentContent: vi.fn(),
}));

vi.mock('../../services/aiAnalysisService.js', () => ({
  analyzeDocumentWithAi: vi.fn(),
}));

vi.mock('../../services/eventPublisher.js', () => ({
  publishAnalysisCompletedEvent: vi.fn(() => Promise.resolve()),
}));

import { analyzeDocument } from '../../controller/aiController.js';
import { getDocumentContent } from '../../services/documentContentService.js';
import { analyzeDocumentWithAi } from '../../services/aiAnalysisService.js';

describe('aiController - analyzeDocument', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(() => res),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns 200 and analysis on success', async () => {
    req.body = sampleRequest;
    getDocumentContent.mockResolvedValue(documentContent);
    analyzeDocumentWithAi.mockResolvedValue(analysisResult);

    await analyzeDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Document analyzed successfully',
        documentId: sampleRequest.documentId,
      })
    );
  });

  it('returns 400 on validation error', async () => {
    req.body = missingRequest; // missing documentId

    await analyzeDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid request' }));
  });

  it('returns 404 when document not found', async () => {
    req.body = { documentId: 'DOC2' };
    getDocumentContent.mockResolvedValue(null);

    await analyzeDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Document content not found' });
  });

  it('returns 500 on internal error', async () => {
    req.body = { documentId: 'DOC3' };
    getDocumentContent.mockResolvedValue({ extractedText: 't' });
    analyzeDocumentWithAi.mockRejectedValue(new Error('AI failure'));

    await analyzeDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'AI analysis failed' });
  });
});
