import express from 'express';
import {
  getOverview,
  getCategories,
  getSentiment,
  getKeywords,
  getDocumentAnalysis,
} from '../controller/analyticsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/overview', authenticate, getOverview);
router.get('/categories', authenticate, getCategories);
router.get('/sentiment', authenticate, getSentiment);
router.get('/keywords', authenticate, getKeywords);
router.get('/document/:documentId', authenticate, getDocumentAnalysis);

export default router;
