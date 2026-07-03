import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';

export const getHealth = async (req, res) => {
  const dependencies = {
    dynamodb: 'DOWN',
  };

  try {
    const client = new DynamoDBClient({ region });
    await client.send(
      new DescribeTableCommand({
        TableName: process.env.AI_ANALYSIS_TABLE_NAME,
      })
    );
    dependencies.dynamodb = 'UP';
  } catch (error) {
    console.error('DynamoDB health check failed:', error);
  }

  const overallStatus = Object.values(dependencies).every((value) => value === 'UP')
    ? 'UP'
    : 'DEGRADED';

  return res.status(200).json({
    status: overallStatus,
    service: 'analytics-service',
    dependencies,
  });
};
