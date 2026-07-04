import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1' });
const topicArn = process.env.ANALYSIS_COMPLETED_TOPIC_ARN;

export const publishAnalysisCompletedEvent = async ({ documentId, category, sentiment, completedAt }) => {
  if (!topicArn) {
    throw new Error('ANALYSIS_COMPLETED_TOPIC_ARN is not configured');
  }

  const payload = {
    eventType: 'AnalysisCompleted',
    documentId,
    category,
    sentiment,
    completedAt,
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
    throw new Error('Failed to publish AnalysisCompleted event');
  }
};
