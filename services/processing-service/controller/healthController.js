import { checkTable } from '../services/documentService.js';
import { checkBucket } from '../services/s3Service.js';

export const health = async (req, res) => {
  const dependencies = {
    dynamodb: 'DOWN',
    s3: 'DOWN',
  };

  try {
    await checkTable({
      tableName: process.env.DOCUMENTS_TABLE_NAME,
    });
    dependencies.dynamodb = 'UP';
  } catch (error) {
    console.error('DynamoDB health check failed:', error);
  }

  try {
    await checkBucket({
      bucketName: process.env.DOCUMENTS_BUCKET_NAME,
    });
    dependencies.s3 = 'UP';
  } catch (error) {
    console.error('S3 health check failed:', error);
  }

  const overallStatus = Object.values(dependencies).every((value) => value === 'UP')
    ? 'UP'
    : 'DOWN';

  return res.status(200).json({
    status: overallStatus,
    service: 'processing-service',
    dependencies,
  });
};
