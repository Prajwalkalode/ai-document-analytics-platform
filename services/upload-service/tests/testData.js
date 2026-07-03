export const fileMock = {
  originalname: 'doc.txt',
  mimetype: 'text/plain',
  size: 12,
  buffer: Buffer.from('hello'),
};

export const user = { userId: 'USR1' };

export const docMetadata = {
  documentId: 'DOC1',
  userId: 'USR1',
  fileName: 'doc.txt',
  contentType: 'text/plain',
  fileSize: 12,
  s3Key: 'USR1/DOC1/doc.txt',
  status: 'UPLOADED',
  uploadedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};
