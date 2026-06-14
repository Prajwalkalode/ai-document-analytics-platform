import { z } from 'zod';
import {
  fetchOverview,
  fetchCategoryDistribution,
  fetchSentimentDistribution,
  fetchTopKeywords,
  fetchDocumentDetails,
} from '../services/analyticsService.js';

const documentIdSchema = z.object({
  documentId: z.string().min(1),
});

export const getOverview = async (req, res) => {
  try {
    const overview = await fetchOverview();

    return res.status(200).json(overview);
  } catch (error) {
    console.error('Analytics overview failed:', error);
    return res.status(500).json({ message: 'Analytics overview failed' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await fetchCategoryDistribution();
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Analytics categories failed:', error);
    return res.status(500).json({ message: 'Analytics categories failed' });
  }
};

export const getSentiment = async (req, res) => {
  try {
    const sentiment = await fetchSentimentDistribution();
    return res.status(200).json(sentiment);
  } catch (error) {
    console.error('Analytics sentiment failed:', error);
    return res.status(500).json({ message: 'Analytics sentiment failed' });
  }
};

export const getKeywords = async (req, res) => {
  try {
    const keywords = await fetchTopKeywords();
    return res.status(200).json({ keywords });
  } catch (error) {
    console.error('Analytics keywords failed:', error);
    return res.status(500).json({ message: 'Analytics keywords failed' });
  }
};

export const getDocumentAnalysis = async (req, res) => {
  try {
    const params = documentIdSchema.parse({ documentId: req.params.documentId });
    const documentData = await fetchDocumentDetails(params.documentId);

    if (!documentData.document && !documentData.analysis) {
      return res.status(404).json({ message: 'Document not found' });
    }

    return res.status(200).json(documentData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request', errors: error.errors });
    }

    console.error('Analytics document lookup failed:', error);
    return res.status(500).json({ message: 'Analytics document lookup failed' });
  }
};
