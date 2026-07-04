import { analyzeDocumentService } from '../services/analysisService.js';

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
  console.log('Received SQS message');

  for (const record of event?.Records || []) {
    const message = parseSqsMessage(record);
    console.log(`Starting AI analysis for ${message.documentId}`);

    try {
      await analyzeDocumentService(message.documentId);
      console.log('Analysis completed');
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  }

  return { status: 'OK' };
};
