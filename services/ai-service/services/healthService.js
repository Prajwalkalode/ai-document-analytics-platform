import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const region = process.env.AWS_REGION;
const ddbClient = new DynamoDBClient({ region });

export const checkDependencies = async () => {
  const tableName = process.env.DOCUMENT_CONTENT_TABLE_NAME;
  await ddbClient.send(
    new DescribeTableCommand({
      TableName: tableName,
    }),
  );
  return true;
};
