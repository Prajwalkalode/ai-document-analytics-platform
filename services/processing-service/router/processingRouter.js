import express from 'express';
import { processDocument } from '../controller/processingController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/process', authenticate, processDocument);

export default router;
