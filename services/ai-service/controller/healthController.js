import { checkDependencies } from '../services/healthService.js';

export const getHealth = async (req, res) => {
  try {
    const dynamoStatus = await checkDependencies();

    return res.status(200).json({
      status: 'UP',
      service: 'ai-service',
      dependencies: {
        dynamodb: dynamoStatus ? 'UP' : 'DOWN',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'DOWN',
      service: 'ai-service',
      dependencies: {
        dynamodb: 'DOWN',
      },
    });
  }
};
