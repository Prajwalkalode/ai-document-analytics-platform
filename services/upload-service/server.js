import dotenv from 'dotenv';

dotenv.config();

const requiredVars = [
  'PORT',
  'AWS_REGION',
  'DOCUMENTS_TABLE_NAME',
  'DOCUMENTS_BUCKET_NAME',
  'JWT_SECRET',
];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`${varName} is required`);
  }
}

const { default: app } = await import('./app.js');
const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Upload service is running on port ${PORT}`);
});
