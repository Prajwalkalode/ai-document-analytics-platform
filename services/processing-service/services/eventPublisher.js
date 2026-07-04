import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1',
});
const topicArn = process.env.DOCUMENT_PROCESSED_TOPIC_ARN;

export const publishDocumentProcessedEvent = async ({ documentId, processedAt, textLength }) => {
  if (!topicArn) {
    throw new Error('DOCUMENT_PROCESSED_TOPIC_ARN is not configured');
  }

  const payload = {
    eventType: 'DocumentProcessed',
    documentId,
    processedAt,
    textLength,
  };

  try {
    await snsClient.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(payload),
      })
    );
  } catch (error) {
    console.error('Publish failed:', error);
    throw new Error('Failed to publish DocumentProcessed event');
  }
};
