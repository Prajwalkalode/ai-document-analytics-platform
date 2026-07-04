import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { processDocumentService } from '../services/processDocumentService.js';

const processSchema = z.object({
  documentId: z.string().min(1),
});

export const processDocument = async (req, res) => {
  try {
    const { documentId } = processSchema.parse(req.body);

    const result = await processDocumentService(documentId);

    return res.status(200).json({
      message: 'Document processed successfully',
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request', errors: error.errors });
    }

    console.error('Document processing failed:', error);
    return res.status(500).json({ message: 'Document processing failed' });
  }
};
