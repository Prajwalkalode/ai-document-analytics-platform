import express from 'express';
import authRouter from './router/authRouter.js';

const app = express();

app.use(express.json());
app.use('/auth', authRouter);

app.use('/', (req, res) => {
    return res.status(404).json({ message: 'No route found' });
});

export default app;