import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import aiRouter from './router/aiRouter.js';
import healthRouter from './router/healthRouter.js';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', aiRouter);
app.use('/', healthRouter);

app.use((req, res) => {
  return res.status(404).json({ message: 'No route found' });
});

export default app;
