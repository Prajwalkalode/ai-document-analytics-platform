import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { safeScan } from '../utils/dynamoUtils.js';

export const getAnalysisByDocumentId = async ({ ddbDocClient, tableName, documentId }) => {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { documentId },
    }),
  );

  return result.Item || null;
};

export const scanAnalysis = async ({ ddbDocClient, tableName }) => {
  return safeScan({
    ddbDocClient,
    command: ScanCommand,
    params: { TableName: tableName },
  });
};
