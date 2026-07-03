import { describe, it, expect, vi } from 'vitest';
import { sampleTextBuffer, sampleDocxBuffer, samplePdfBuffer } from '../testData.js';

vi.mock('mammoth', () => ({
  default: { extractRawText: vi.fn(async ({ buffer }) => ({ value: 'docx text' })) },
  extractRawText: vi.fn(async ({ buffer }) => ({ value: 'docx text' })),
}));
vi.mock('pdf-parse', () => ({
  default: vi.fn(async (buf) => ({ text: 'pdf text' })),
  __esModule: true,
}));

const { extractTextFromBuffer } = await import('../../services/textExtractionService.js');

describe('textExtractionService', () => {
  it('extracts plain text', async () => {
    const out = await extractTextFromBuffer({
      fileBuffer: sampleTextBuffer,
      contentType: 'text/plain',
    });
    expect(out).toBe(sampleTextBuffer.toString('utf8'));
  });

  it('extracts docx text using mammoth', async () => {
    const out = await extractTextFromBuffer({
      fileBuffer: sampleDocxBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    expect(out).toBe('docx text');
  });

  it('extracts pdf text using pdf-parse', async () => {
    const out = await extractTextFromBuffer({
      fileBuffer: samplePdfBuffer,
      contentType: 'application/pdf',
    });
    expect(out).toBe('pdf text');
  });

  it('throws for unsupported types', async () => {
    await expect(
      extractTextFromBuffer({ fileBuffer: sampleTextBuffer, contentType: 'application/zip' })
    ).rejects.toThrow('Unsupported content type');
  });
});
