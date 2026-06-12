import dotenv from 'dotenv';
dotenv.config();

const requiredVars = [
  'PORT',
  'AWS_REGION',
  'DOCUMENT_CONTENT_TABLE_NAME',
  'AI_RESULTS_TABLE_NAME',
  'JWT_SECRET',
  'USE_REAL_AI',
];

const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

if (process.env.USE_REAL_AI === 'true' && !process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required when USE_REAL_AI=true');
  process.exit(1);
}

import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`AI service is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
