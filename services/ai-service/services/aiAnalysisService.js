import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createAiProvider } from '../providers/aiProvider.js';

const region = process.env.AWS_REGION;
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const analyzeDocumentWithAi = async ({ documentId, text }) => {
  const provider = createAiProvider();
  const analysis = await provider.generateAnalysis(text);

  const tableName = process.env.AI_RESULTS_TABLE_NAME;
  const analyzedAt = new Date().toISOString();

  await ddbDocClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        documentId,
        summary: analysis.summary,
        keywords: analysis.keywords,
        category: analysis.category,
        sentiment: analysis.sentiment,
        analyzedAt,
      },
    }),
  );

  return { ...analysis, analyzedAt };
};
