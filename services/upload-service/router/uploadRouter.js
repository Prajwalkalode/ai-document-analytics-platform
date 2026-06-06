import express from 'express';
import { uploadDocument } from '../controller/uploadController.js';
import { authenticate } from '../middleware/authenticate.js';
import { uploadMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', authenticate, uploadMiddleware, uploadDocument);

export default router;
