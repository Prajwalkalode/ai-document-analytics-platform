import express from 'express';
import swaggerUi from 'swagger-ui-express';
import analyticsRouter from './router/analyticsRouter.js';
import healthRouter from './router/healthRouter.js';
import swaggerSpec from './swagger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/analytics', analyticsRouter);
app.use('/', healthRouter);

app.use((req, res) => {
  return res.status(404).json({ message: 'No route found' });
});

app.use(errorHandler);

export default app;
