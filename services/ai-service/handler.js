import dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';
import { handleSqsEvent } from './handlers/sqsHandler.js';

// Load environment variables so Lambda has same env behavior as local
dotenv.config();

export const handler = async (event, context) => {
  if (event?.Records && Array.isArray(event.Records)) {
    return handleSqsEvent(event);
  }

  return serverlessExpress({ app })(event, context);
};
