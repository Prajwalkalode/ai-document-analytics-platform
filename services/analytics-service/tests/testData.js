export const documents = [
  { documentId: 'D1', status: 'UPLOADED' },
  { documentId: 'D2', status: 'PROCESSED' },
  { documentId: 'D3', status: 'FAILED' },
  { documentId: 'D4', status: 'PROCESSED' },
];

export const analysisItems = [
  { documentId: 'D2', category: 'TECH', sentiment: 'POS', keywords: ['AI', 'ML'] },
  { documentId: 'D4', category: 'BUSINESS', sentiment: 'NEG', keywords: ['AI', 'sales'] },
  { documentId: 'D1', category: 'TECH', sentiment: 'POS', keywords: ['ml'] },
];

export const documentD2 = { documentId: 'D2', status: 'PROCESSED' };
export const analysisForD2 = [ { documentId: 'D2', category: 'TECH', sentiment: 'POS', keywords: ['AI'] } ];
