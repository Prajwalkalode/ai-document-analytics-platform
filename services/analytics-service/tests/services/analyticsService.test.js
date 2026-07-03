import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../repository/documentRepository.js', () => ({
  getDocumentById: vi.fn(),
  scanDocuments: vi.fn(),
}));

vi.mock('../../repository/analyticsRepository.js', () => ({
  getAnalysisByDocumentId: vi.fn(),
  scanAnalysis: vi.fn(),
}));

import {
  fetchOverview,
  fetchCategoryDistribution,
  fetchSentimentDistribution,
  fetchTopKeywords,
  fetchDocumentDetails,
} from '../../services/analyticsService.js';

import { documents, analysisItems, documentD2, analysisForD2 } from '../testData.js';
import { getDocumentById, scanDocuments } from '../../repository/documentRepository.js';
import { getAnalysisByDocumentId, scanAnalysis } from '../../repository/analyticsRepository.js';

describe('analyticsService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetchOverview returns counts', async () => {
    scanDocuments.mockResolvedValue(documents);
    scanAnalysis.mockResolvedValue(analysisItems);

    const overview = await fetchOverview();

    expect(overview.totalDocuments).toBe(4);
    expect(overview.uploadedDocuments).toBe(1);
    expect(overview.processedDocuments).toBe(2);
    expect(overview.failedDocuments).toBe(1);
  });

  it('fetchCategoryDistribution aggregates categories', async () => {
    scanAnalysis.mockResolvedValue(analysisItems);

    const dist = await fetchCategoryDistribution();

    expect(dist.TECH).toBe(2);
    expect(dist.BUSINESS).toBe(1);
  });

  it('fetchSentimentDistribution aggregates sentiments', async () => {
    scanAnalysis.mockResolvedValue(analysisItems);

    const dist = await fetchSentimentDistribution();

    expect(dist.POS).toBe(2);
    expect(dist.NEG).toBe(1);
  });

  it('fetchTopKeywords returns top keywords', async () => {
    scanAnalysis.mockResolvedValue(analysisItems);

    const top = await fetchTopKeywords();

    // Convert to map for easier assertions
    const map = Object.fromEntries(top.map((t) => [t.keyword, t.count]));
    expect(map.ai).toBe(2);
    expect(map.ml).toBe(2);
    expect(map.sales).toBe(1);
  });

  it('fetchDocumentDetails returns document and analysis', async () => {
    getDocumentById.mockResolvedValue(documentD2);
    getAnalysisByDocumentId.mockResolvedValue(analysisForD2);

    const out = await fetchDocumentDetails('D2');

    expect(out.document).toEqual(documentD2);
    expect(out.analysis).toEqual(analysisForD2);
  });
});
