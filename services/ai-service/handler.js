import dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';

// Load environment variables so Lambda has same env behavior as local
dotenv.config();

export const handler = serverlessExpress({ app });
