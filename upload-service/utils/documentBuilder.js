import crypto from 'crypto';

const createDocumentId = () => {
  const randomValue = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `DOC${randomValue}`;
};

export const buildDocumentMetadata = (file, userId) => {
  const now = new Date().toISOString();
  const documentId = createDocumentId();
  const s3Key = `${userId}/${documentId}/${file.originalname}`;

  return {
    documentId,
    userId,
    fileName: file.originalname,
    contentType: file.mimetype,
    fileSize: file.size,
    s3Key,
    status: 'UPLOADED',
    uploadedAt: now,
    createdAt: now,
    updatedAt: now,
  };
};
