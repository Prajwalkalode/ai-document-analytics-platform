import { checkTable } from '../services/documentService.js';
import { checkBucket } from '../services/s3Service.js';

const tableName = process.env.DOCUMENTS_TABLE_NAME;
const bucketName = process.env.DOCUMENTS_BUCKET_NAME;

export const health = async (req, res) => {
  const dependencies = {
    dynamodb: 'DOWN',
    s3: 'DOWN',
  };

  try {
    await checkTable({ tableName });
    dependencies.dynamodb = 'UP';
  } catch (error) {
    console.error('DynamoDB health check failed:', error);
  }

  try {
    await checkBucket({ bucketName });
    dependencies.s3 = 'UP';
  } catch (error) {
    console.error('S3 health check failed:', error);
  }

  const overallStatus = Object.values(dependencies).every((value) => value === 'UP')
    ? 'UP'
    : 'DOWN';

  return res.status(200).json({
    status: overallStatus,
    service: 'upload-service',
    dependencies,
  });
};
