import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1' });
const topicArn = process.env.DOCUMENT_UPLOADED_TOPIC_ARN;

export const publishDocumentUploadedEvent = async ({ documentId, userId, s3Key, uploadedAt }) => {
  if (!topicArn) {
    throw new Error('DOCUMENT_UPLOADED_TOPIC_ARN is not configured');
  }

  const payload = {
    eventType: 'DocumentUploaded',
    documentId,
    userId,
    s3Key,
    uploadedAt,
  };

  try {
    await snsClient.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(payload),
      })
    );
  } catch (error) {
    console.error('SNS publish failed:', error);
    throw new Error('Failed to publish DocumentUploaded event');
  }
};
