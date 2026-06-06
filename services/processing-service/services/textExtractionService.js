import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export const extractTextFromBuffer = async ({ fileBuffer, contentType }) => {
  if (contentType === 'text/plain') {
    return fileBuffer.toString('utf8');
  }

  if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value.trim();
  }

  if (contentType === 'application/pdf') {
    const result = await pdfParse(fileBuffer);
    return result.text.trim();
  }

  throw new Error(`Unsupported content type: ${contentType}`);
};
