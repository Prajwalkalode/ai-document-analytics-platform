import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const saveDocumentMetadata = async ({ tableName, documentMetadata }) => {
  await ddbDocClient.send(
    new PutCommand({
      TableName: tableName,
      Item: documentMetadata,
    })
  );
};

export const checkTable = async ({ tableName }) => {
  await ddbClient.send(
    new DescribeTableCommand({
      TableName: tableName,
    })
  );
};
