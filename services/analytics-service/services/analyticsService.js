import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDocumentById, scanDocuments } from '../repository/documentRepository.js';
import { getAnalysisByDocumentId, scanAnalysis } from '../repository/analyticsRepository.js';

const region = process.env.AWS_REGION || 'ap-south-1';
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const documentsTableName = process.env.DOCUMENTS_TABLE_NAME;
const analysisTableName = process.env.AI_ANALYSIS_TABLE_NAME;

export const fetchOverview = async () => {
  const documents = await scanDocuments({ ddbDocClient, tableName: documentsTableName });
  await scanAnalysis({ ddbDocClient, tableName: analysisTableName });

  const uploadedDocuments = documents.filter((item) => item.status === 'UPLOADED').length;
  const processedDocuments = documents.filter((item) => item.status === 'PROCESSED').length;
  const failedDocuments = documents.filter((item) => item.status === 'FAILED').length;
  const totalDocuments = documents.length;

  return {
    totalDocuments,
    uploadedDocuments,
    processedDocuments,
    failedDocuments,
  };
};

export const fetchCategoryDistribution = async () => {
  const analysisItems = await scanAnalysis({ ddbDocClient, tableName: analysisTableName });
  return analysisItems.reduce((acc, item) => {
    const category = item.category || 'UNKNOWN';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
};

export const fetchSentimentDistribution = async () => {
  const analysisItems = await scanAnalysis({ ddbDocClient, tableName: analysisTableName });
  return analysisItems.reduce((acc, item) => {
    const sentiment = item.sentiment || 'UNKNOWN';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});
};

export const fetchTopKeywords = async () => {
  const analysisItems = await scanAnalysis({ ddbDocClient, tableName: analysisTableName });
  const keywordCounts = analysisItems.reduce((acc, item) => {
    const keywords = Array.isArray(item.keywords) ? item.keywords : [];
    keywords.forEach((keyword) => {
      const normalized = String(keyword).toLowerCase();
      acc[normalized] = (acc[normalized] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

export const fetchDocumentDetails = async (documentId) => {
  const document = await getDocumentById({
    ddbDocClient,
    tableName: documentsTableName,
    documentId,
  });

  const analysis = await getAnalysisByDocumentId({
    ddbDocClient,
    tableName: analysisTableName,
    documentId,
  });

  return { document, analysis };
};
