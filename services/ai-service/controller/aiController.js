import { z } from 'zod';
import { analyzeDocumentService } from '../services/analysisService.js';

const analyzeSchema = z.object({
  documentId: z.string().min(1),
  provider: z.enum(['openai', 'gemini', 'mock', 'mock_gemini']).optional(),
});

export const analyzeDocument = async (req, res) => {
  try {
    const { documentId, provider } = analyzeSchema.parse(req.body);

    const analysis = await analyzeDocumentService(documentId, provider);

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

    if (error?.statusCode === 404) {
      return res.status(404).json({ message: 'Document content not found' });
    }

    console.error('AI analysis failed:', error);
    return res.status(500).json({ message: 'AI analysis failed' });
  }
};
