import { z } from 'zod';
import { getDocumentContent } from '../services/documentContentService.js';
import { analyzeDocumentWithAi } from '../services/aiAnalysisService.js';

const analyzeSchema = z.object({
  documentId: z.string().min(1),
});

export const analyzeDocument = async (req, res) => {
  try {
    const { documentId } = analyzeSchema.parse(req.body);

    const document = await getDocumentContent(documentId);

    if (!document || !document.extractedText) {
      return res.status(404).json({ message: 'Document content not found' });
    }

    const analysis = await analyzeDocumentWithAi({
      documentId,
      text: document.extractedText,
    });

    return res.status(200).json({
      message: 'Document analyzed successfully',
      documentId,
      summary: analysis.summary,
      keywords: analysis.keywords,
      category: analysis.category,
      sentiment: analysis.sentiment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request', errors: error.errors });
    }

    console.error('AI analysis failed:', error);
    return res.status(500).json({ message: 'AI analysis failed' });
  }
};
