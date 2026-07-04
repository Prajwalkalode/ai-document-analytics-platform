import { processDocumentService } from '../services/processDocumentService.js';
import { publishDocumentProcessedEvent } from '../services/eventPublisher.js';

const parseSqsMessage = (record) => {
  if (!record?.body) {
    throw new Error('Invalid SQS message payload');
  }

  let payload;
  try {
    payload = JSON.parse(record.body);
  } catch {
    throw new Error('Invalid SQS message payload');
  }

  if (!payload?.documentId) {
    throw new Error('Invalid SQS message payload');
  }

  return payload;
};

export const handleSqsEvent = async (event) => {
  console.log('Received SQS event');

  const records = event?.Records || [];

  for (const record of records) {
    const message = parseSqsMessage(record);
    console.log(`Processing document ${message.documentId}`);

    try {
      const result = await processDocumentService(message.documentId);
      console.log('Processing completed');
      console.log('Publishing DocumentProcessed event');
      await publishDocumentProcessedEvent({
        documentId: result.documentId,
        processedAt: result.processedAt,
        textLength: result.textLength,
      });
      console.log('SNS publish succeeded');
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  }

  return { status: 'OK' };
};
