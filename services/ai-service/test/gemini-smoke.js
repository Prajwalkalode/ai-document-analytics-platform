import { MockGeminiProvider } from '../providers/mockGeminiProvider.js';

console.log('Testing MockGeminiProvider...');
const mock = new MockGeminiProvider();
const sample = 'This is a test document about python and invoices. It is good.';
const res = await mock.generateAnalysis(sample);
console.log('MockGeminiProvider result:', JSON.stringify(res, null, 2));

try {
  const genai = await import('@google/genai');
  console.log('@google/genai imported; exported keys:', Object.keys(genai));
} catch (err) {
  console.error('Failed to import @google/genai:', err.message);
  process.exitCode = 2;
}

console.log('Smoke test completed.');
