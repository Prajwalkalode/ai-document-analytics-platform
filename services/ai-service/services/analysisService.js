import { getDocumentContent } from './documentContentService.js';
import { analyzeDocumentWithAi } from './aiAnalysisService.js';
import { publishAnalysisCompletedEvent } from './eventPublisher.js';

export const analyzeDocumentService = async (documentId, provider) => {
  const document = await getDocumentContent(documentId);

  if (!document || !document.extractedText) {
    const error = new Error('Document content not found');
    error.statusCode = 404;
    throw error;
  }

  const analysis = await analyzeDocumentWithAi({
    documentId,
    text: document.extractedText,
    provider,
  });

  const completedAt = new Date().toISOString();

  await publishAnalysisCompletedEvent({
    documentId,
    category: analysis.category,
    sentiment: analysis.sentiment,
    completedAt,
  });

  return {
    documentId,
    summary: analysis.summary,
    keywords: analysis.keywords,
    category: analysis.category,
    sentiment: analysis.sentiment,
    completedAt,
  };
};
