import { z } from 'zod';
import { uploadFileToS3 } from '../services/s3Service.js';
import { saveDocumentMetadata } from '../services/documentService.js';
import { buildDocumentMetadata } from '../utils/documentBuilder.js';

const userSchema = z.object({
  userId: z.string().min(1),
});

const bucketName = process.env.DOCUMENTS_BUCKET_NAME;
const tableName = process.env.DOCUMENTS_TABLE_NAME;

export const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  let user;
  try {
    user = userSchema.parse(req.user);
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const documentMetadata = buildDocumentMetadata(req.file, user.userId);

  try {
    await uploadFileToS3({
      bucketName,
      key: documentMetadata.s3Key,
      body: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await saveDocumentMetadata({
      tableName,
      documentMetadata,
    });

    return res.status(201).json({
      message: 'Document uploaded successfully',
      documentId: documentMetadata.documentId,
      status: documentMetadata.status,
    });
  } catch (error) {
    console.error('Document upload failed:', error);
    return res.status(500).json({ message: 'Document upload failed' });
  }
};
