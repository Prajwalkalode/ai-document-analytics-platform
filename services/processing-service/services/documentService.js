import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const getDocumentMetadata = async ({ tableName, documentId }) => {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { documentId },
    }),
  );

  return result.Item;
};

export const updateDocumentStatus = async ({ tableName, documentId, status, updatedAt }) => {
  await ddbDocClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { documentId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': updatedAt,
      },
    }),
  );
};

export const saveDocumentContent = async ({ tableName, documentId, extractedText, processedAt }) => {
  await ddbDocClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        documentId,
        extractedText,
        processedAt,
      },
    }),
  );
};

export const checkTable = async ({ tableName }) => {
  await ddbClient.send(
    new DescribeTableCommand({
      TableName: tableName,
    }),
  );
};
