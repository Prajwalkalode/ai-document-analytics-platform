import express from 'express';
import { analyzeDocument } from '../controller/aiController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/analyze', authenticate, analyzeDocument);

export default router;
