import {
  getDocumentMetadata,
  updateDocumentStatus,
  saveDocumentContent,
} from './documentService.js';
import { downloadFileFromS3 } from './s3Service.js';
import { extractTextFromBuffer } from './textExtractionService.js';

export const processDocumentService = async (documentId) => {
  const document = await getDocumentMetadata({
    tableName: process.env.DOCUMENTS_TABLE_NAME,
    documentId,
  });

  if (!document) {
    throw new Error('Document not found');
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

  return {
    documentId,
    status: 'PROCESSED',
    textLength: extractedText.length,
  };
};
