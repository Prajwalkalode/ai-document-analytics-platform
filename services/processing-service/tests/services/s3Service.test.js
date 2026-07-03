import { describe, it, expect, vi, beforeEach } from 'vitest';
import { s3ObjectBody, s3Bucket, s3Key } from '../testData.js';

// Mock S3 client
const sendMock = vi.fn();
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: function () {
    return { send: sendMock };
  },
  GetObjectCommand: class GetObjectCommand {
    constructor(input) {
      this.input = input;
    }
  },
  HeadBucketCommand: class HeadBucketCommand {
    constructor(input) {
      this.input = input;
    }
  },
  __getSendMock: () => sendMock,
}));

const { downloadFileFromS3, checkBucket } = await import('../../services/s3Service.js');

describe('s3Service', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it('downloads file from s3', async () => {
    // S3 returns Body as an async iterable
    const stream = (async function* () {
      yield s3ObjectBody;
    })();
    sendMock.mockResolvedValue({ Body: stream });

    const buf = await downloadFileFromS3({ bucketName: s3Bucket, key: s3Key });
    expect(buf).toEqual(s3ObjectBody);
  });

  it('checkBucket calls head bucket', async () => {
    sendMock.mockResolvedValue({});
    await expect(checkBucket({ bucketName: s3Bucket })).resolves.toBeUndefined();
  });
});
