import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';

const health = async (req, res) => {
  const dependencies = {
    dynamodb: 'DOWN',
    jwt: 'DOWN',
  };
  const timestamp = new Date().toISOString();

  if (process.env.JWT_SECRET) {
    dependencies.jwt = 'UP';
  }

  try {
    const client = new DynamoDBClient({ region });
    await client.send(
      new DescribeTableCommand({
        TableName: process.env.AUTH_TABLE_NAME,
      })
    );
    dependencies.dynamodb = 'UP';
  } catch (error) {
    console.error('Health dependency check failed:', error);
  }

  const overallStatus = Object.values(dependencies).every((value) => value === 'UP')
    ? 'UP'
    : 'DEGRADED';

  return res.status(200).json({
    status: overallStatus,
    service: 'auth-service',
    timestamp,
    dependencies,
  });
};

export { health };
