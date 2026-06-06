import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'ap-south-1';
const s3Client = new S3Client({ region });

export const uploadFileToS3 = async ({ bucketName, key, body, contentType }) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return key;
};

export const checkBucket = async ({ bucketName }) => {
  await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
};
