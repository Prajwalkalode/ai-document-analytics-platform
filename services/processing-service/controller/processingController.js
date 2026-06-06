import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { getDocumentMetadata, updateDocumentStatus, saveDocumentContent } from '../services/documentService.js';
import { downloadFileFromS3 } from '../services/s3Service.js';
import { extractTextFromBuffer } from '../services/textExtractionService.js';

const processSchema = z.object({
  documentId: z.string().min(1),
});

export const processDocument = async (req, res) => {
  try {
    const { documentId } = processSchema.parse(req.body);

    const document = await getDocumentMetadata({
      tableName: process.env.DOCUMENTS_TABLE_NAME,
      documentId,
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await updateDocumentStatus({
      tableName: process.env.DOCUMENTS_TABLE_NAME,
      documentId,
      status: 'PROCESSING',
      updatedAt: new Date().toISOString(),
    });

    const fileBuffer = await downloadFileFromS3({
      bucketName: process.env.DOCUMENTS_BUCKET_NAME,
      key: document.s3Key,
    });

    const extractedText = await extractTextFromBuffer({
      fileBuffer,
      contentType: document.contentType,
    });

    const processedAt = new Date().toISOString();

    await saveDocumentContent({
      tableName: process.env.DOCUMENT_CONTENT_TABLE_NAME,
      documentId,
      extractedText,
      processedAt,
    });

    await updateDocumentStatus({
      tableName: process.env.DOCUMENTS_TABLE_NAME,
      documentId,
      status: 'PROCESSED',
      updatedAt: processedAt,
    });

    return res.status(200).json({
      message: 'Document processed successfully',
      documentId,
      status: 'PROCESSED',
      textLength: extractedText.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request', errors: error.errors });
    }

    console.error('Document processing failed:', error);
    return res.status(500).json({ message: 'Document processing failed' });
  }
};
