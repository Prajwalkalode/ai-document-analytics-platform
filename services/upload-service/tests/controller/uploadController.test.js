import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fileMock, user, docMetadata } from '../testData.js';

vi.mock('../../services/s3Service.js', () => ({
  uploadFileToS3: vi.fn(() => Promise.resolve('USR1/DOC1/doc.txt')),
}));

vi.mock('../../services/documentService.js', () => ({
  saveDocumentMetadata: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../utils/documentBuilder.js', () => ({
  buildDocumentMetadata: vi.fn(() => docMetadata),
}));

const { uploadDocument } = await import('../../controller/uploadController.js');

describe('uploadController', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.resetAllMocks();
    req = { file: fileMock, user };
    res = { status: vi.fn(() => res), json: vi.fn(() => res) };
  });

  it('returns 400 when no file', async () => {
    req.file = null;
    await uploadDocument(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'File is required' });
  });

  it('returns 401 on invalid user', async () => {
    req.file = fileMock;
    req.user = {}; // invalid
    await uploadDocument(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('uploads file and saves metadata (201)', async () => {
    req.file = fileMock;
    req.user = user;

    await uploadDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Document uploaded successfully',
        documentId: docMetadata.documentId,
      })
    );
  });

  it('returns 500 when S3 upload fails', async () => {
    const s3 = await import('../../services/s3Service.js');
    s3.uploadFileToS3.mockRejectedValue(new Error('S3 error'));

    await uploadDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Document upload failed' });
  });
});
