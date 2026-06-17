import express from 'express';
import processingRouter from './router/processingRouter.js';
import healthRouter from './router/healthRouter.js';

const app = express();

app.use(express.json());
app.use('/', processingRouter);
app.use('/', healthRouter);

app.use('/', (req, res) => {
  return res.status(404).json({ message: 'No route found' });
});

export default app;
