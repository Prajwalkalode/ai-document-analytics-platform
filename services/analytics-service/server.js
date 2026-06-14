import dotenv from 'dotenv';
dotenv.config();

const requiredVars = [
  'PORT',
  'AWS_REGION',
  'DOCUMENTS_TABLE_NAME',
  'AI_ANALYSIS_TABLE_NAME',
  'JWT_SECRET',
];

const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

const { default: app } = await import('./app.js');

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Analytics service is running on port ${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
