import { S3Client, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'ap-south-1';
const s3Client = new S3Client({ region });

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export const downloadFileFromS3 = async ({ bucketName, key }) => {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error('S3 object has no body');
  }

  return await streamToBuffer(response.Body);
};

export const checkBucket = async ({ bucketName }) => {
  await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
};
