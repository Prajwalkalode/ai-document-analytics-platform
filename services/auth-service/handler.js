import dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';

dotenv.config();

export const handler = serverlessExpress({ app });
