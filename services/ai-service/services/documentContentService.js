import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION;
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const getDocumentContent = async (documentId) => {
  const tableName = process.env.DOCUMENT_CONTENT_TABLE_NAME;

  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { documentId },
    })
  );

  return result.Item;
};
